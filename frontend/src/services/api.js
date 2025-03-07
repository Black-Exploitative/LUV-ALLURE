import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// User Authentication
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

// Product Handling
export const fetchProducts = async () => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
};

// Order Management
export const placeOrder = async (orderData) => {
  const response = await axios.post(`${API_URL}/orders`, orderData);
  return response.data;
};

// Return Requests
export const requestReturn = async (returnData) => {
  const response = await axios.post(`${API_URL}/returns/request`, returnData);
  return response.data;
};

export const getReturnStatus = async (orderId) => {
  const response = await axios.get(`${API_URL}/returns/status/${orderId}`);
  return response.data;
};
