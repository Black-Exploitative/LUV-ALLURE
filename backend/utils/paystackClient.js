// backend/utils/paystackClient.js
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

class PaystackClient {
  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY;
    this.publicKey = process.env.PAYSTACK_PUBLIC_KEY;
    this.baseUrl = 'https://api.paystack.co';
  }

  // Initialize a transaction
  async initializeTransaction(data) {
    try {
      const response = await axios.post(`${this.baseUrl}/transaction/initialize`, data, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Paystack transaction initialization error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Verify a transaction
  async verifyTransaction(reference) {
    try {
      const response = await axios.get(`${this.baseUrl}/transaction/verify/${reference}`, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Paystack transaction verification error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get list of banks
  async getBanks() {
    try {
      const response = await axios.get(`${this.baseUrl}/bank`, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Paystack get banks error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Create a payment page
  async createPaymentPage(data) {
    try {
      const response = await axios.post(`${this.baseUrl}/page`, data, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Paystack payment page creation error:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new PaystackClient();