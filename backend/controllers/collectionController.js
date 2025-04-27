// backend/controllers/collectionController.js
const Collection = require('../models/Collection');
const shopifyClient = require('../utils/shopifyClient');

// Get all collections
exports.getAllCollections = async (req, res, next) => {
  try {
    const collections = await Collection.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });
    
    res.status(200).json({ 
      success: true, 
      count: collections.length,
      data: collections 
    });
  } catch (error) {
    next(error);
  }
};

// Get collection by handle
exports.getCollectionByHandle = async (req, res, next) => {
  try {
    const { handle } = req.params;
    
    const collection = await Collection.findOne({ 
      handle, 
      isActive: true 
    });
    
    if (!collection) {
      return res.status(404).json({ 
        success: false, 
        message: 'Collection not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: collection 
    });
  } catch (error) {
    next(error);
  }
};

// Get collection products
exports.getCollectionProducts = async (req, res, next) => {
  try {
    const { handle } = req.params;
    const { page = 1, limit = 20, sort = 'relevance', ...filters } = req.query;
    
    const collection = await Collection.findOne({ 
      handle, 
      isActive: true 
    });
    
    if (!collection) {
      return res.status(404).json({ 
        success: false, 
        message: 'Collection not found' 
      });
    }
    
    // Build filter query based on collection settings and request filters
    let filterQuery = '';
    
    // Apply collection tags if they exist
    if (collection.filters.tags && collection.filters.tags.length > 0) {
      const tagQueries = collection.filters.tags.map(tag => `tag:"${tag}"`);
      filterQuery += `(${tagQueries.join(' OR ')})`;
    }
    
    // Apply additional filters from request
    if (filters.category) {
      filterQuery += filterQuery ? ` AND product_type:"${filters.category}"` : `product_type:"${filters.category}"`;
    }
    
    if (filters.price) {
      const [min, max] = filters.price.split('-');
      if (min && max) {
        filterQuery += filterQuery ? ` AND price:>${min} AND price:<${max}` : `price:>${min} AND price:<${max}`;
      }
    }
    
    // Apply other filters as needed
    
    // Map sort parameter to Shopify sort key
    let sortKey = 'RELEVANCE';
    let sortDirection = 'DESC';
    
    switch (sort.toLowerCase()) {
      case 'price-low-high':
        sortKey = 'PRICE';
        sortDirection = 'ASC';
        break;
      case 'price-high-low':
        sortKey = 'PRICE';
        sortDirection = 'DESC';
        break;
      case 'newest':
        sortKey = 'CREATED_AT';
        sortDirection = 'DESC';
        break;
      case 'alphabetical':
        sortKey = 'TITLE';
        sortDirection = 'ASC';
        break;
      case 'best-selling':
        sortKey = 'BEST_SELLING';
        sortDirection = 'DESC';
        break;
    }
    
    // Build GraphQL query
    const query = `
      {
        products(
          first: ${parseInt(limit)},
          query: "${filterQuery}",
          sortKey: ${sortKey},
          reverse: ${sortDirection === 'DESC'}
        ) {
          edges {
            node {
              id
              title
              handle
              description
              productType
              tags
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 10) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    selectedOptions {
                      name
                      value
                    }
                    availableForSale
                  }
                }
              }
              options {
                id
                name
                values
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;
    
    // Execute the query
    const result = await shopifyClient.query(query);
    
    // Transform products for the frontend
    const products = result.products.edges.map(({ node }) => ({
      id: node.id.split('/').pop(),
      title: node.title,
      handle: node.handle,
      description: node.description,
      price: node.priceRange?.minVariantPrice?.amount || '0.00',
      images: node.images.edges.map(edge => edge.node.url),
      variants: node.variants.edges.map(edge => ({
        id: edge.node.id.split('/').pop(),
        title: edge.node.title,
        price: edge.node.price.amount,
        options: edge.node.selectedOptions,
        availableForSale: edge.node.availableForSale
      })),
      options: node.options.map(option => ({
        name: option.name,
        values: option.values
      }))
    }));
    
    res.status(200).json({
      success: true,
      products: products,
      pageInfo: result.products.pageInfo,
      totalCount: products.length,
      collection: {
        name: collection.name,
        description: collection.description,
        header: {
          title: collection.headerTitle || collection.name,
          description: collection.headerDescription || collection.description,
          imageUrl: collection.headerImage,
          overlayOpacity: collection.headerOverlayOpacity
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create collection (Admin)
exports.createCollection = async (req, res, next) => {
  try {
    const { name, description, headerImage, filters, productIds } = req.body;
    
    // Generate handle from name
    const handle = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Check if handle already exists
    const existingCollection = await Collection.findOne({ handle });
    if (existingCollection) {
      return res.status(400).json({ 
        success: false, 
        message: 'Collection with this name already exists' 
      });
    }
    
    const collection = new Collection({
      name,
      handle,
      description,
      headerImage,
      headerTitle: name,
      headerDescription: description,
      filters,
      productIds
    });
    
    await collection.save();
    
    res.status(201).json({ 
      success: true, 
      data: collection 
    });
  } catch (error) {
    next(error);
  }
};

// Update collection (Admin)
exports.updateCollection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // If name is being updated, also update handle
    if (updates.name) {
      updates.handle = updates.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    const collection = await Collection.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!collection) {
      return res.status(404).json({ 
        success: false, 
        message: 'Collection not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: collection 
    });
  } catch (error) {
    next(error);
  }
};

// Delete collection (Admin)
exports.deleteCollection = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const collection = await Collection.findByIdAndDelete(id);
    
    if (!collection) {
      return res.status(404).json({ 
        success: false, 
        message: 'Collection not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Collection deleted successfully' 
    });
  } catch (error) {
    next(error);
  }
};