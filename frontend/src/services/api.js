// services/api.js - Frontend API service

import axios from 'axios';

// Base API URL
const API_URL = 'http://localhost:3001/api';

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
    return config;
  },
  (error) => Promise.reject(error)
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

  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  }
};

// Product Services - Compatible with your ProductGrid component
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
  },

  // Update cart item quantity
  updateCartItem: async (variantId, quantity) => {
    try {
      const response = await api.put('/cart/update', { variantId, quantity });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update cart' };
    }
  },

  // Remove item from cart
  removeFromCart: async (variantId) => {
    try {
      const response = await api.delete(`/cart/remove/${variantId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to remove item from cart' };
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      const response = await api.delete('/cart/clear');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to clear cart' };
    }
  }
};

// Order Services
export const orderService = {
  // Create checkout
  createCheckout: async (shippingAddress) => {
    try {
      const response = await api.post('/orders/checkout', { shippingAddress });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create checkout' };
    }
  },

  // Get user's orders
  getOrders: async () => {
    try {
      const response = await api.get('/orders');
      return response.data.orders;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get orders' };
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data.order;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get order details' };
    }
  }
};

export default api;