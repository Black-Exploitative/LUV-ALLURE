// services/searchApi.js - Frontend service for search endpoints
import api from './api';

const searchService = {
  /**
   * Search products with filters
   * 
   * @param {string} query - Search query
   * @param {object} options - Filter options
   * @param {string} options.category - Product category filter
   * @param {string} options.color - Product color filter
   * @param {string} options.size - Product size filter
   * @param {string} options.sort - Sort order (e.g., 'newest', 'price-low-high')
   * @param {number} options.limit - Maximum number of results to return
   * @param {string} options.cursor - Pagination cursor
   * @returns {Promise<Object>} - Search results
   */
  searchProducts: async (query, options = {}) => {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      // Add search query if provided
      if (query) {
        params.append('q', query);
      }
      
      // Add category filter if provided
      if (options.category) {
        params.append('category', options.category);
      }
      
      // Add color filter if provided
      if (options.color) {
        params.append('color', options.color);
      }
      
      // Add size filter if provided
      if (options.size) {
        params.append('size', options.size);
      }
      
      // Add sort parameter if provided
      if (options.sort) {
        params.append('sort', options.sort);
      }
      
      // Add limit parameter if provided
      if (options.limit) {
        params.append('limit', options.limit.toString());
      }
      
      // Add cursor parameter for pagination if provided
      if (options.cursor) {
        params.append('cursor', options.cursor);
      }
      
      // Create query string
      const queryString = params.toString();
      
      // Make API request
      const response = await api.get(`/search/products?${queryString}`);
      
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },
  
  /**
   * Get products by category (used for navbar navigation)
   * 
   * @param {string} category - Category name
   * @param {object} options - Additional options
   * @returns {Promise<Object>} - Category products
   */
  getProductsByCategory: async (category, options = {}) => {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      // Add category parameter
      params.append('category', category);
      
      // Add sort parameter if provided
      if (options.sort) {
        params.append('sort', options.sort);
      }
      
      // Add limit parameter if provided
      if (options.limit) {
        params.append('limit', options.limit.toString());
      }
      
      // Make API request
      const response = await api.get(`/search/category?${params.toString()}`);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching category products:', error);
      throw error;
    }
  },
  
  /**
   * Get new arrivals (used for "New Arrivals" navbar link)
   * 
   * @param {object} options - Additional options
   * @returns {Promise<Object>} - New arrivals
   */
  getNewArrivals: async (options = {}) => {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      // Add limit parameter if provided
      if (options.limit) {
        params.append('limit', options.limit.toString());
      }
      
      // Make API request
      const response = await api.get(`/search/new-arrivals?${params.toString()}`);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      throw error;
    }
  },
  
  /**
   * Get search suggestions based on query
   * 
   * @param {string} query - Search query
   * @returns {Promise<Array>} - Search suggestions
   */
  getSearchSuggestions: async (query) => {
    try {
      // Make API request
      const response = await api.get(`/search/suggestions?q=${encodeURIComponent(query)}`);
      
      return response.data.suggestions || [];
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
      return [];
    }
  },
  
  /**
   * Get trending searches
   * 
   * @returns {Promise<Array>} - Trending searches
   */
  getTrendingSearches: async () => {
    try {
      // Make API request
      const response = await api.get('/search/trending');
      
      return response.data.trendingSearches || [];
    } catch (error) {
      console.error('Error fetching trending searches:', error);
      return [];
    }
  },
  
  /**
   * Search products by tag
   * 
   * @param {string} tag - Tag to search for
   * @returns {Promise<Array>} - Products with the specified tag
   */
  searchProductsByTag: async (tag) => {
    try {
      // Make API request
      const response = await api.get(`/search/tag?tag=${encodeURIComponent(tag)}`);
      
      return response.data.products || [];
    } catch (error) {
      console.error('Error searching products by tag:', error);
      return [];
    }
  }
};

export default searchService;