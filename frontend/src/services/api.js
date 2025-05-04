// services/api.js - Frontend API service with enhanced authentication

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

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to change password' };
    }
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to request password reset' };
    }
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reset password' };
    }
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  }
};

// Product Services - Compatible with your ProductGrid component

export const fetchProducts = async (filters = {}) => {
  try {
    // Build query parameters from filters
    const params = new URLSearchParams();
    
    // Add collection filter if provided
    if (filters.collection) {
      params.append('collection', filters.collection);
    }
    
    // Add category filter if provided
    if (filters.category) {
      params.append('category', filters.category);
    }
    
    // Add color filter if provided
    if (filters.color) {
      params.append('color', filters.color);
    }
    
    // Add size filter if provided
    if (filters.size) {
      params.append('size', filters.size);
    }
    
    // Add sort parameter if provided
    if (filters.sort) {
      params.append('sort', filters.sort);
    }
    
    // Add price range if provided
    if (filters.price) {
      params.append('price', filters.price);
    }
    
    // Add limit if provided
    if (filters.limit) {
      params.append('limit', filters.limit);
    }
    
    // Add pagination cursor if provided
    if (filters.cursor) {
      params.append('after', filters.cursor);
    }
    
    // Create query string
    const queryString = params.toString();
    const url = queryString ? `/products?${queryString}` : '/products';
    
    console.log(`Fetching products from ${url}`);
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};export const searchProductsWithFilters = async (query, filters = {}) => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    
    // Add search query
    if (query) {
      params.append('q', query);
    }
    
    // Add category filter
    if (filters.category) {
      params.append('category', filters.category);
    }
    
    // Add color filter
    if (filters.color) {
      params.append('color', filters.color);
    }
    
    // Add size filter
    if (filters.size) {
      params.append('size', filters.size);
    }
    
    // Add sort parameter
    if (filters.sort) {
      params.append('sort', filters.sort);
    }
    
    // Add price range
    if (filters.price) {
      params.append('price', filters.price);
    }
    
    // Add limit
    if (filters.limit) {
      params.append('limit', filters.limit.toString());
    }
    
    // Add pagination cursor
    if (filters.cursor) {
      params.append('cursor', filters.cursor);
    }
    
    // Create query string
    const queryString = params.toString();
    
    const response = await api.get(`/search/products?${queryString}`);
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
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

// Address Services
export const addressService = {
  // Get user's addresses
  getAddresses: async () => {
    try {
      const response = await api.get('/user/addresses');
      return response.data.addresses;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get addresses' };
    }
  },

  // Add new address
  addAddress: async (addressData) => {
    try {
      const response = await api.post('/user/addresses', addressData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add address' };
    }
  },

  // Update address
  updateAddress: async (addressId, addressData) => {
    try {
      const response = await api.put(`/user/addresses/${addressId}`, addressData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update address' };
    }
  },

  // Delete address
  deleteAddress: async (addressId) => {
    try {
      const response = await api.delete(`/user/addresses/${addressId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete address' };
    }
  },

  // Set default address
  setDefaultAddress: async (addressId) => {
    try {
      const response = await api.put(`/user/addresses/${addressId}/default`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to set default address' };
    }
  }
};

// Payment Method Services
export const paymentService = {
  // Get user's payment methods
  getPaymentMethods: async () => {
    try {
      const response = await api.get('/user/payment-methods');
      return response.data.paymentMethods;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get payment methods' };
    }
  },

  // Add new payment method
  addPaymentMethod: async (paymentData) => {
    try {
      const response = await api.post('/user/payment-methods', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add payment method' };
    }
  },

  // Delete payment method
  deletePaymentMethod: async (paymentMethodId) => {
    try {
      const response = await api.delete(`/user/payment-methods/${paymentMethodId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete payment method' };
    }
  },

  // Set default payment method
  setDefaultPaymentMethod: async (paymentMethodId) => {
    try {
      const response = await api.put(`/user/payment-methods/${paymentMethodId}/default`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to set default payment method' };
    }
  }
};

export default api;