// frontend/src/config/paystackConfig.js
/**
 * Paystack configuration and helper functions
 * This file centralizes all Paystack-related settings and utilities
 */

// Paystack API configuration
const PAYSTACK_CONFIG = {
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    scriptUrl: 'https://js.paystack.co/v1/inline.js',
    channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
    currency: 'NGN', // Nigerian Naira
    country: 'NG',  // Nigeria
    callbackUrl: import.meta.env.VITE_PAYSTACK_CALLBACK_URL, // Optional callback URL for redirection after payment
  };
  
  /**
   * Load the Paystack script dynamically
   * @returns {Promise} Resolves when script is loaded
   */
  export const loadPaystackScript = () => {
    return new Promise((resolve, reject) => {
      // If script is already loaded, resolve immediately
      if (window.PaystackPop) {
        resolve(window.PaystackPop);
        return;
      }
  
      // Check if script is already being loaded
      const existingScript = document.querySelector(`script[src="${PAYSTACK_CONFIG.scriptUrl}"]`);
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(window.PaystackPop));
        existingScript.addEventListener('error', (e) => reject(e));
        return;
      }
  
      // Create and append script
      const script = document.createElement('script');
      script.src = PAYSTACK_CONFIG.scriptUrl;
      script.async = true;
      
      script.onload = () => resolve(window.PaystackPop);
      script.onerror = (e) => reject(e);
      
      document.body.appendChild(script);
    });
  };
  
  /**
   * Initialize Paystack inline payment
   * @param {Object} paymentData Payment details (email, amount, reference, etc.)
   * @param {Function} onSuccess Success callback 
   * @param {Function} onClose Close callback
   * @returns {Boolean} Whether initialization was successful
   */
  export const initializeInlinePayment = async (paymentData, onSuccess, onClose) => {
    try {
      // Load Paystack if not already loaded
      const PaystackPop = await loadPaystackScript();
      
      if (!PaystackPop) {
        console.error('Failed to load Paystack');
        return false;
      }
      
      // Setup payment handler
      const handler = PaystackPop.setup({
        key: PAYSTACK_CONFIG.publicKey,
        email: paymentData.email,
        amount: Math.round(paymentData.amount * 100), // Convert to kobo (smallest currency unit)
        ref: paymentData.reference,
        currency: PAYSTACK_CONFIG.currency,
        channels: PAYSTACK_CONFIG.channels,
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
      
      // Open payment iframe
      handler.openIframe();
      return true;
    } catch (error) {
      console.error('Paystack initialization error:', error);
      return false;
    }
  };
  
  /**
   * Create a payment URL for redirect
   * @param {Object} paymentData Payment details
   * @returns {Promise<string>} URL for payment redirection
   */
  export const createPaymentUrl = async (paymentData) => {
    try {
      const response = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          email: paymentData.email,
          amount: Math.round(paymentData.amount * 100), // Convert to kobo
          reference: paymentData.reference,
          orderId: paymentData.orderId,
          metadata: {
            customer_name: paymentData.customerName,
            products: paymentData.items.map(item => item.name || item.title).join(', ')
          }
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.data.authorizationUrl;
      } else {
        throw new Error(data.message || 'Payment initialization failed');
      }
    } catch (error) {
      console.error('Error creating payment URL:', error);
      throw error;
    }
  };
  
  /**
   * Verify a payment transaction
   * @param {string} reference Payment reference
   * @returns {Promise<Object>} Verification result
   */
  export const verifyPayment = async (reference) => {
    try {
      const response = await fetch(`/api/payment/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      return await response.json();
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  };
  
  // Export default configuration
  export default PAYSTACK_CONFIG;