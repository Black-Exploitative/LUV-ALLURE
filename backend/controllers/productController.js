// controllers/productController.js - Product controller
const shopifyClient = require('../utils/shopifyClient');

// Get all products with filter support
exports.getProducts = async (req, res, next) => {
  try {
    const { 
      first = 20, 
      after = null,
      category,
      color,
      size,
      collection,
      sort,
      price
    } = req.query;
    
    // Log the received filter parameters
    console.log('Fetching products with filters:', {
      first, after, category, color, size, collection, sort, price
    });
    
    // Build GraphQL query with filters
    const query = buildProductQuery(category, color, size, collection, sort, price);
    
    // Execute the query with appropriate variables
    const variables = {
      first: parseInt(first),
      after: after || null,
      query: buildShopifyFilterString(category, color, size, collection, price)
    };
    
    // Add sort parameters if provided
    if (sort) {
      variables.sortKey = mapSortToShopify(sort);
      variables.reverse = isReverseSortOrder(sort);
    }
    
    // Execute the query
    const result = await shopifyClient.query(query, variables);
    
    // Transform the response to match frontend expectations
    const transformedProducts = result.products.edges.map(edge => {
      const product = edge.node;
      return {
        id: product.id.split('/').pop(),
        title: product.title,
        handle: product.handle,
        description: product.description,
        images: product.images.edges.map(imgEdge => ({
          src: imgEdge.node.url,
          altText: imgEdge.node.altText
        })),
        variants: product.variants.edges.map(variantEdge => ({
          id: variantEdge.node.id.split('/').pop(),
          title: variantEdge.node.title,
          price: variantEdge.node.price,
          selectedOptions: variantEdge.node.selectedOptions,
          inventoryQuantity: variantEdge.node.inventoryQuantity
        })),
        options: product.variants.edges.map(variantEdge => ({
          name: variantEdge.node.title,
          values: [variantEdge.node.title]
        }))
      };
    });
    
    res.status(200).json({
      products: transformedProducts,
      pageInfo: result.products.pageInfo
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    next(error);
  }
};

// Helper function to build Shopify filter string
function buildShopifyFilterString(category, color, size, collection, price) {
  let filterParts = [];
  
  // Add category filter
  if (category) {
    filterParts.push(`product_type:${category}`);
  }
  
  // Add color filter (check in title, variants and tags)
  if (color) {
    filterParts.push(`(title:${color} OR variants:${color} OR tag:${color})`);
  }
  
  // Add size filter (check in variants and tags)
  if (size) {
    filterParts.push(`(variants:${size} OR tag:${size})`);
  }
  
  // Add collection filter
  if (collection) {
    filterParts.push(`collection:${collection}`);
  }
  
  // Add price filter
  if (price) {
    const [minPrice, maxPrice] = price.split('-');
    if (minPrice) {
      filterParts.push(`variants.price:>=${minPrice}`);
    }
    if (maxPrice) {
      filterParts.push(`variants.price:<=${maxPrice}`);
    }
  }
  
  return filterParts.join(' AND ');
}

// Helper function to build the GraphQL query
function buildProductQuery(category, color, size, collection, sort, price) {
  return `
    query GetProducts($first: Int!, $after: String, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
      products(
        first: $first, 
        after: $after, 
        query: $query,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            title
            handle
            description
            featuredImage {
              url
              altText
            }
            images(first: 100) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            options {
              id
              name
              values
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
                  inventoryQuantity: quantityAvailable
                }
              }
            }
          }
        }
      }
    }
  `;
}

// Helper function to map sort parameter to Shopify sort key
function mapSortToShopify(sort) {
  switch(sort.toLowerCase()) {
    case 'price-low-high':
    case 'price-high-low':
      return 'PRICE';
    case 'newest':
      return 'CREATED_AT';
    case 'alphabetical':
    case 'alphabetical: a-z':
      return 'TITLE';
    case 'best-selling':
    case 'most-popular':
      return 'BEST_SELLING';
    default:
      return 'RELEVANCE';
  }
}

// Helper function to determine sort direction
function isReverseSortOrder(sort) {
  // Return true for descending order, false for ascending
  switch(sort.toLowerCase()) {
    case 'price-high-low':
    case 'newest':
      return true; // Descending
    case 'price-low-high':
    case 'alphabetical':
    case 'alphabetical: a-z':
      return false; // Ascending
    default:
      return false; // Default to ascending
  }
}
// Get product by handle
exports.getProductByHandle = async (req, res, next) => {
  try {
    const { handle } = req.params;
    const result = await shopifyClient.getProductByHandle(handle);
    
    if (!result.product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const product = result.product;
    const transformedProduct = {
      id: product.id.split('/').pop(),
      title: product.title,
      handle: product.handle,
      description: product.description,
      images: product.images.edges.map(imgEdge => ({
        src: imgEdge.node.url,
        altText: imgEdge.node.altText
      })),
      variants: product.variants.edges.map(variantEdge => ({
        id: variantEdge.node.id.split('/').pop(),
        title: variantEdge.node.title,
        price: variantEdge.node.price,
        selectedOptions: variantEdge.node.selectedOptions,
        inventoryQuantity: variantEdge.node.inventoryQuantity
      })),
      options: product.variants.edges.map(variantEdge => ({
        name: variantEdge.node.title,
        values: [variantEdge.node.title]
      }))
    };
    
    res.status(200).json({ product: transformedProduct });
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    console.log('Fetching product with ID:', id);

    // Format ID for Shopify if needed
    const formattedId = id.includes('gid://') 
      ? id 
      : `gid://shopify/Product/${id}`;
    
    // Get product from Shopify
    const product = await shopifyClient.getProductById(formattedId);
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }
    
    // Transform the product for frontend
    const transformedProduct = {
      id: product.id.split('/').pop() || id,
      title: product.title,
      handle: product.handle,
      description: product.description,
      images: product.images.edges.map(imgEdge => ({
        src: imgEdge.node.url,
        altText: imgEdge.node.altText
      })),
      variants: product.variants.edges.map(variantEdge => ({
        id: variantEdge.node.id.split('/').pop(),
        title: variantEdge.node.title,
        price: variantEdge.node.price.amount,
        selectedOptions: variantEdge.node.selectedOptions,
        inventoryQuantity: variantEdge.node.inventoryQuantity,
        availableForSale: variantEdge.node.availableForSale
      })),
      options: product.options.map(option => ({
        name: option.name,
        values: option.values
      }))
    };
    
    res.status(200).json({ 
      success: true,
      product: transformedProduct 
    });
  } catch (error) {
    console.error(`Error fetching product ${req.params.id}:`, error);
    next(error);
  }
};