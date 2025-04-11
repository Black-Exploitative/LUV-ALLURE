// controllers/searchController.js
const shopifyClient = require('../utils/shopifyClient');

// Search products based on query
exports.searchProducts = async (req, res, next) => {
  try {
    const { q, category, limit = 20, page = 1, sort = 'relevance' } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ 
        message: 'Search query must be at least 2 characters long'
      });
    }
    
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
      default:
        sortKey = 'RELEVANCE';
        sortDirection = 'DESC';
    }
    
    // Create GraphQL query
    let filters = [];
    
    // Add search term
    if (q) {
      filters.push(`query: "${q}"`);
    }
    
    // Add category filter if specified
    if (category && category !== 'all') {
      filters.push(`productType: "${category}"`);
    }
    
    // Calculate pagination for cursor-based pagination
    const first = parseInt(limit);
    const after = page > 1 ? req.query.cursor : null;
    
    // Build the GraphQL query
    const query = `
      {
        products(
          first: $first,
          after: $after,
          query: $query,
          sortKey: $sortKey,
          reverse: $reverse
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
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 5) {
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
    const products = result.products.edges.map(({ node }) => {
      // Extract first image URL or use placeholder
      const imageUrl = node.images.edges.length > 0 
        ? node.images.edges[0].node.url 
        : null;
      
      // Get price from price range
      const price = node.priceRange?.minVariantPrice?.amount || '0.00';
      
      // Get variants
      const variants = node.variants?.edges.map(({ node: variant }) => ({
        id: variant.id,
        title: variant.title,
        price: variant.price.amount,
        options: variant.selectedOptions,
        available: variant.availableForSale
      })) || [];
      
      // Transform to simplified structure
      return {
        id: node.id,
        handle: node.handle,
        title: node.title,
        description: node.description,
        productType: node.productType,
        tags: node.tags || [],
        price: price,
        image: imageUrl,
        variants: variants
      };
    });
    
    res.status(200).json({
      products,
      pageInfo: result.products.pageInfo,
      query: q,
      totalCount: products.length
    });
  } catch (error) {
    next(error);
  }
};

// Get search suggestions based on query
exports.getSearchSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(200).json({ suggestions: [] });
    }
    
    // Query for products matching the search term
    const query = `
      {
        products(
          first: 20,
          query: "${q}"
        ) {
          edges {
            node {
              title
              productType
              tags
            }
          }
        }
      }
    `;
    
    const result = await shopifyClient.query(query);
    
    // Extract suggestions from product titles, types, and tags
    const suggestionsSet = new Set();
    
    result.products.edges.forEach(({ node }) => {
      // Add product title if it contains the query
      if (node.title.toLowerCase().includes(q.toLowerCase())) {
        suggestionsSet.add(node.title);
      }
      
      // Add product type if it contains the query
      if (node.productType && node.productType.toLowerCase().includes(q.toLowerCase())) {
        suggestionsSet.add(node.productType);
      }
      
      // Add tags that contain the query
      if (node.tags) {
        node.tags.forEach(tag => {
          if (tag.toLowerCase().includes(q.toLowerCase())) {
            suggestionsSet.add(tag);
          }
        });
      }
    });
    
    // Convert Set to Array and limit to 5 suggestions
    const suggestions = [...suggestionsSet].slice(0, 5);
    
    res.status(200).json({ suggestions });
  } catch (error) {
    next(error);
  }
};

// Get popular searches/trending terms
exports.getTrendingSearches = async (req, res, next) => {
  try {
    // This would typically come from analytics data
    // For this example, we'll return static trending terms
    const trendingSearches = [
      "Summer Collection",
      "Evening Dress",
      "Wedding Guest",
      "Party Wear",
      "New Arrivals"
    ];
    
    res.status(200).json({ trendingSearches });
  } catch (error) {
    next(error);
  }
};

exports.searchProductsByTag = async (req, res, next) => {
  try {
    const { tag } = req.query;
    
    if (!tag) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tag parameter is required' 
      });
    }
    
    // Create GraphQL query
    const query = `
      {
        products(first: 10, query: "tag:${tag}") {
          edges {
            node {
              id
              title
              handle
              description
              images(first: 1) {
                edges {
                  node {
                    url
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    price {
                      amount
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
    
    // Execute the query
    const result = await shopifyClient.query(query);
    
    // Transform products for the frontend
    const products = result.products.edges.map(({ node }) => {
      const imageUrl = node.images.edges.length > 0 
        ? node.images.edges[0].node.url 
        : null;
      
      const price = node.variants.edges.length > 0 
        ? node.variants.edges[0].node.price.amount
        : "0.00";
      
      return {
        id: node.id.split('/').pop(),
        title: node.title,
        handle: node.handle,
        description: node.description,
        image: imageUrl,
        price: price
      };
    });
    
    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    next(error);
  }
};