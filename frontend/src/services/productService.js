// frontend/src/services/productService.js
import api from './api';

/**
 * Service for product-related API calls
 */
const productService = {
  /**
   * Fetch products with filters
   * 
   * @param {Object} filters - Filter parameters (category, color, size, etc.)
   * @param {string} sort - Sort parameter
   * @param {number} limit - Number of products to fetch
   * @param {string} cursor - Pagination cursor
   * @returns {Promise<Object>} - Promise with products data
   */
  async getProducts(filters = {}, sort = 'relevance', limit = 12, cursor = null) {
    // Build query parameters
    const params = new URLSearchParams();
    
    // Add filters to params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        // Handle array values
        if (Array.isArray(value)) {
          value.forEach(val => params.append(key, val));
        } else {
          params.append(key, value);
        }
      }
    });
    
    // Add sort parameter
    if (sort && sort !== 'relevance') {
      params.append('sort', sort);
    }
    
    // Add pagination parameters
    params.append('limit', limit.toString());
    if (cursor) {
      params.append('cursor', cursor);
    }
    
    console.log('Fetching products with params:', Object.fromEntries(params.entries()));
    
    try {
      const response = await api.get(`/products?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  
  /**
   * Fetch products by category
   * 
   * @param {string} category - Category name
   * @param {Object} additionalFilters - Additional filters
   * @param {string} sort - Sort parameter
   * @param {number} limit - Number of products to fetch
   * @returns {Promise<Object>} - Promise with products data
   */
  async getProductsByCategory(category, additionalFilters = {}, sort = 'relevance', limit = 12) {
    try {
      return await this.getProducts({ ...additionalFilters, category }, sort, limit);
    } catch (error) {
      console.error(`Error fetching products by category ${category}:`, error);
      throw error;
    }
  },
  
  /**
   * Fetch products by color
   * 
   * @param {string} color - Color name
   * @param {Object} additionalFilters - Additional filters
   * @param {string} sort - Sort parameter
   * @param {number} limit - Number of products to fetch
   * @returns {Promise<Object>} - Promise with products data
   */
  async getProductsByColor(color, additionalFilters = {}, sort = 'relevance', limit = 12) {
    try {
      return await this.getProducts({ ...additionalFilters, color }, sort, limit);
    } catch (error) {
      console.error(`Error fetching products by color ${color}:`, error);
      throw error;
    }
  },
  
  /**
   * Fetch products by tag
   * 
   * @param {string} tag - Tag name
   * @param {Object} additionalFilters - Additional filters
   * @param {string} sort - Sort parameter
   * @param {number} limit - Number of products to fetch
   * @returns {Promise<Object>} - Promise with products data
   */
  async getProductsByTag(tag, additionalFilters = {}, sort = 'relevance', limit = 12) {
    try {
      return await this.getProducts({ ...additionalFilters, tag }, sort, limit);
    } catch (error) {
      console.error(`Error fetching products by tag ${tag}:`, error);
      throw error;
    }
  },
  
  /**
   * Fetch a single product by handle
   * 
   * @param {string} handle - Product handle/slug
   * @returns {Promise<Object>} - Promise with product data
   */
  async getProductByHandle(handle) {
    try {
      const response = await api.get(`/products/handle/${handle}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product by handle ${handle}:`, error);
      throw error;
    }
  },
  
  /**
   * Fetch a single product by ID
   * 
   * @param {string} id - Product ID
   * @returns {Promise<Object>} - Promise with product data
   */
  async getProductById(id) {
    try {
      const response = await api.get(`/products/id/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product by ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Fetch related products for a given product
   * 
   * @param {string} productId - Product ID
   * @param {number} limit - Number of related products to fetch
   * @returns {Promise<Object>} - Promise with related products data
   */
  async getRelatedProducts(productId, limit = 4) {
    try {
      const response = await api.get(`/products?related=${productId}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching related products for ${productId}:`, error);
      throw error;
    }
  },
  
  /**
   * Fetch new arrivals
   * 
   * @param {number} limit - Number of products to fetch
   * @returns {Promise<Object>} - Promise with new arrivals data
   */
  async getNewArrivals(limit = 12) {
    try {
      return await this.getProducts({}, 'newest', limit);
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      throw error;
    }
  },
  
  /**
   * Fetch best selling products
   * 
   * @param {number} limit - Number of products to fetch
   * @returns {Promise<Object>} - Promise with best selling products data
   */
  async getBestSellers(limit = 12) {
    try {
      return await this.getProducts({}, 'best-selling', limit);
    } catch (error) {
      console.error('Error fetching best sellers:', error);
      throw error;
    }
  },
  
  /**
   * Fetch products with specific attributes
   * 
   * @param {Object} attributes - Product attributes
   * @param {number} limit - Number of products to fetch
   * @returns {Promise<Object>} - Promise with products data
   */
  async getProductsByAttributes(attributes, limit = 12) {
    try {
      return await this.getProducts(attributes, 'relevance', limit);
    } catch (error) {
      console.error('Error fetching products by attributes:', error);
      throw error;
    }
  }
};

export default productService;