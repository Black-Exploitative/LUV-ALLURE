import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const API_VERSION = "2025-01";

const shopifyAPI = axios.create({
  baseURL: `${SHOPIFY_STORE_URL}/admin/api/${API_VERSION}`,
  headers: {
    "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
    "Content-Type": "application/json",
  },
});

/**
 * 🛒 1. Create a New Shopify Customer (User Registration)
 */
export const createCustomer = async (customerData) => {
  try {
    const response = await shopifyAPI.post("/customers.json", {
      customer: customerData,
    });
    return response.data.customer;
  } catch (error) {
    console.error("Error creating Shopify customer:", error.response?.data);
    throw error;
  }
};

/**
 * 🔑 2. Authenticate a Customer (User Login)
 */
export const getCustomerByEmail = async (email) => {
  try {
    const response = await shopifyAPI.get(`/customers/search.json?query=email:${email}`);
    return response.data.customers[0] || null;
  } catch (error) {
    console.error("Error fetching customer:", error.response?.data);
    throw error;
  }
};

/**
 * 🛍 3. Fetch All Products from Shopify
 */
export const fetchAllProducts = async () => {
  try {
    const response = await shopifyAPI.get("/products.json");
    return response.data.products;
  } catch (error) {
    console.error("Error fetching products:", error.response?.data);
    throw error;
  }
};

/**
 * 🔎 4. Get a Single Product by ID
 */
export const getProductById = async (productId) => {
  try {
    const response = await shopifyAPI.get(`/products/${productId}.json`);
    return response.data.product;
  } catch (error) {
    console.error("Error fetching product:", error.response?.data);
    throw error;
  }
};

/**
 * 🛒 5. Create an Order in Shopify
 */
export const createOrder = async (orderData) => {
  try {
    const response = await shopifyAPI.post("/orders.json", {
      order: orderData,
    });
    return response.data.order;
  } catch (error) {
    console.error("Error creating order:", error.response?.data);
    throw error;
  }
};

/**
 * 🔄 6. Update Inventory Levels After Order
 */
export const updateInventory = async (inventoryItemId, availableQuantity) => {
  try {
    const response = await shopifyAPI.post("/inventory_levels/set.json", {
      inventory_item_id: inventoryItemId,
      available: availableQuantity,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating inventory:", error.response?.data);
    throw error;
  }
};

/**
 * 📦 7. Fetch All Orders for a Customer
 */
export const getCustomerOrders = async (customerId) => {
  try {
    const response = await shopifyAPI.get(`/orders.json?customer_id=${customerId}`);
    return response.data.orders;
  } catch (error) {
    console.error("Error fetching customer orders:", error.response?.data);
    throw error;
  }
};

/**
 * 🔄 8. Process a Return Request (Refund)
 */
export const processReturn = async (orderId, refundAmount) => {
  try {
    const response = await shopifyAPI.post(`/orders/${orderId}/refunds.json`, {
      refund: {
        amount: refundAmount,
        currency: "USD",
        note: "Customer requested a return.",
      },
    });
    return response.data.refund;
  } catch (error) {
    console.error("Error processing return:", error.response?.data);
    throw error;
  }
};

/**
 * 📡 9. Handle Shopify Webhook (Order Fulfillment, Inventory Updates)
 */
export const handleWebhook = async (req, res) => {
  console.log("Received Shopify Webhook:", req.body);
  res.sendStatus(200);
};

export default {
  createCustomer,
  getCustomerByEmail,
  fetchAllProducts,
  getProductById,
  createOrder,
  updateInventory,
  getCustomerOrders,
  processReturn,
  handleWebhook,
};
