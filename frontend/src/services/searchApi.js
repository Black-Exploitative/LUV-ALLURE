// services/searchApi.js - Updated to remove mock data and fix endpoint
import api from './api';

// Service for search-related API calls
const searchService = {
  // Search products
  searchProducts: async (query, options = {}) => {
    try {
      const { 
        category = 'all', 
        limit = 10, 
        page = 1, 
        color, 
        size,
        sort = 'relevance'
      } = options;
      
      // Create query parameters
      const params = new URLSearchParams();
      params.append('q', query);
      if (category !== 'all') params.append('category', category);
      params.append('limit', limit.toString());
      params.append('page', page.toString());
      
      // Add filter parameters
      if (color) params.append('color', color);
      if (size) params.append('size', size);
      if (sort) params.append('sort', sort);
      
      // Use the correct endpoint - /search/products instead of /products/search
      const response = await api.get(`/search/products?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      // Return empty results instead of mock data
      return {
        products: [],
        totalCount: 0,
        query
      };
    }
  },
  
  // Get search suggestions (for autocomplete)
  getSearchSuggestions: async (query) => {
    try {
      const response = await api.get(`/search/suggestions?q=${encodeURIComponent(query)}`);
      return response.data.suggestions;
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      // Return empty array instead of mock data
      return [];
    }
  },

  // Get trending searches (no mock data)
  getTrendingSearches: async () => {
    try {
      const response = await api.get('/search/trending');
      return response.data.trendingSearches;
    } catch (error) {
      console.error('Error getting trending searches:', error);
      return [];
    }
  },

  // Search products by tag
  searchProductsByTag: async (tag) => {
    try {
      const response = await api.get(`/search/tag?tag=${encodeURIComponent(tag)}`);
      return response.data.products;
    } catch (error) {
      console.error('Error searching products by tag:', error);
      return [];
    }
  }
};

export default searchService;