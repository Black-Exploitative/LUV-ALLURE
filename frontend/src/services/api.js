// frontend/src/services/api.js
import axios from 'axios';

// Detect environment for base URL
const isProduction = import.meta.env.PROD;
const API_URL = isProduction 
  ? import.meta.env.VITE_API_URL || 'https://backend-mocha-eta-71.vercel.app/api'
  : 'http://localhost:3001/api';

console.log('API Service initialized with base URL:', API_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Log the request for debugging
    if (isProduction) {
      console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 Unauthorized, clear local storage and reload
    if (error.response?.status === 401) {
      // Check if the error is not from login/register endpoints
      const isAuthEndpoint = error.config.url.includes('/auth/login') || 
                            error.config.url.includes('/auth/register');
      
      if (!isAuthEndpoint) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Don't reload automatically, let the context handle the redirect
      }
    }
    
    // Log the error for debugging
    if (isProduction) {
      console.error('API Error:', error.response?.status, error.response?.data);
    }
    
    return Promise.reject(error);
  }
);

// Authentication Services
export const authService = {
  // Register new user with birthdate
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get user profile' };
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      
      // Update user in localStorage if the request was successful
      if (response.data.user) {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, ...response.data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  }
};

// Product Services
export const fetchProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductByHandle = async (handle) => {
  try {
    const response = await api.get(`/products/${handle}`);
    return response.data.product;
  } catch (error) {
    console.error(`Error fetching product ${handle}:`, error);
    throw error;
  }
};

// Cart Services
export const cartService = {
  // Get user's cart
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data.cart;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get cart' };
    }
  },

  // Add item to cart
  addToCart: async (product) => {
    try {
      const cartItem = {
        variantId: product.variantId,
        quantity: product.quantity || 1,
        title: product.title,
        price: product.price,
        image: product.image || product.images[0]
      };
      
      const response = await api.post('/cart/add', cartItem);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add item to cart' };
    }
  }
};

export default api;