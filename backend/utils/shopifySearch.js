// utils/shopifySearch.js

/**
 * Creates a search query for Shopify Storefront API to search for products
 * 
 * @param {string} searchQuery - The search term entered by the user
 * @param {Object} options - Additional search options
 * @param {string} options.category - Product category/type filter
 * @param {number} options.limit - Maximum number of results to return
 * @param {string} options.sortKey - How to sort results (e.g., TITLE, PRICE)
 * @param {string} options.sortDirection - Direction to sort (ASC or DESC)
 * @returns {string} - GraphQL query for Shopify Storefront API
 */
export const buildProductSearchQuery = (searchQuery, options = {}) => {
    const { 
      category = '',
      limit = 20,
      sortKey = 'RELEVANCE',
      sortDirection = 'DESC'
    } = options;
    
    // Build query filters
    let filters = [];
    
    // Add search term
    if (searchQuery) {
      filters.push(`query: "${searchQuery}"`);
    }
    
    // Add category filter if specified
    if (category && category !== 'all') {
      filters.push(`productType: "${category}"`);
    }
    
    // Build the GraphQL query
    return `
      query ProductSearch($first: Int!) {
        products(
          first: $first
          ${filters.length > 0 ? filters.join(', ') : ''}
          sortKey: ${sortKey}
          reverse: ${sortDirection === 'DESC' ? 'true' : 'false'}
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
  };
  
  /**
   * Transforms Shopify product data structure into a simplified format for the frontend
   * 
   * @param {Object} shopifyProducts - Raw Shopify products data from API
   * @returns {Array} - Transformed array of product objects
   */
  export const transformShopifyProducts = (shopifyProducts) => {
    if (!shopifyProducts || !shopifyProducts.edges) {
      return [];
    }
  
    return shopifyProducts.edges.map(({ node }) => {
      // Extract first image URL or use placeholder
      const imageUrl = node.images.edges.length > 0 
        ? node.images.edges[0].node.url 
        : '/images/placeholder.jpg';
      
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
  };
  
  /**
   * Extracts search suggestions from Shopify products and tags
   * 
   * @param {Object} shopifyProducts - Shopify products data
   * @param {string} query - Current search query
   * @returns {Array} - Array of search suggestions
   */
  export const extractSearchSuggestions = (shopifyProducts, query) => {
    if (!shopifyProducts || !shopifyProducts.edges || !query) {
      return [];
    }
    
    const lowerQuery = query.toLowerCase();
    const suggestions = new Set();
    
    // Extract suggestions from product titles, types, and tags
    shopifyProducts.edges.forEach(({ node }) => {
      // Add product title if it contains the query
      if (node.title.toLowerCase().includes(lowerQuery)) {
        suggestions.add(node.title);
      }
      
      // Add product type if it contains the query
      if (node.productType && node.productType.toLowerCase().includes(lowerQuery)) {
        suggestions.add(node.productType);
      }
      
      // Add tags that contain the query
      if (node.tags) {
        node.tags.forEach(tag => {
          if (tag.toLowerCase().includes(lowerQuery)) {
            suggestions.add(tag);
          }
        });
      }
    });
    
    // Convert Set to Array and limit number of suggestions
    return [...suggestions].slice(0, 5);
  };
  
  export default {
    buildProductSearchQuery,
    transformShopifyProducts,
    extractSearchSuggestions
  };