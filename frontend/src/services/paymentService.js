// frontend/src/services/paymentService.js
import api from './api';

const paymentService = {
  // Initialize payment with Paystack
  initializePayment: async (paymentData) => {
    try {
      const response = await api.post('/payment/initialize', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error initializing payment:', error);
      throw error.response?.data || { message: 'Payment initialization failed' };
    }
  },

  // Verify payment status
  verifyPayment: async (reference) => {
    try {
      const response = await api.get(`/payment/verify/${reference}`);
      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error.response?.data || { message: 'Payment verification failed' };
    }
  },

  // Get list of banks (for bank transfers)
  getBanks: async () => {
    try {
      const response = await api.get('/payment/banks');
      return response.data;
    } catch (error) {
      console.error('Error fetching banks:', error);
      throw error.response?.data || { message: 'Failed to fetch banks' };
    }
  },

  // Process payment using Paystack Popup
  processPaymentWithPopup: async (orderData) => {
    try {
      // First, initialize payment to get authorization URL
      const paymentInitData = {
        email: orderData.email,
        amount: orderData.amount,
        reference: orderData.reference,
        orderId: orderData.orderId,
        metadata: {
          customer_name: `${orderData.firstName} ${orderData.lastName}`,
          products: orderData.items.map(item => item.name || item.title).join(', ')
        }
      };

      const initResponse = await paymentService.initializePayment(paymentInitData);

      if (initResponse.success) {
        // Open Paystack checkout in new window
        window.open(initResponse.data.authorizationUrl, '_blank');
        
        return {
          success: true,
          message: 'Payment initialized',
          reference: initResponse.data.reference
        };
      } else {
        throw new Error(initResponse.message || 'Payment initialization failed');
      }
    } catch (error) {
      console.error('Error processing payment with popup:', error);
      throw error;
    }
  },

  // Inline implementation of Paystack checkout
  initializeInlinePayment: (paymentData, onSuccess, onClose) => {
    // Check if PaystackPop is available
    if (window.PaystackPop) {
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: paymentData.email,
        amount: Math.round(paymentData.amount * 100), // Convert to kobo
        ref: paymentData.reference,
        metadata: {
          order_id: paymentData.orderId,
          custom_fields: [
            {
              display_name: "Order ID",
              variable_name: "order_id",
              value: paymentData.orderId
            },
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: paymentData.customerName
            }
          ]
        },
        onSuccess,
        onClose
      });
      
      handler.openIframe();
      return true;
    } else {
      console.error('Paystack script not loaded');
      return false;
    }
  }
};

export default paymentService;