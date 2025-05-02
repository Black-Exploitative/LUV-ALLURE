// backend/controllers/paymentController.js
const crypto = require('crypto');
const paystackClient = require('../utils/paystackClient');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { createShopifyOrder } = require('../utils/orderUtils');

// Initialize a payment transaction
exports.initializePayment = async (req, res, next) => {
  try {
    const { 
      email, 
      amount, 
      reference, 
      orderId, 
      metadata
    } = req.body;

    // Validate inputs
    if (!email || !amount || !reference || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: email, amount, reference, orderId'
      });
    }

    // Initialize transaction with Paystack
    const paymentData = {
      email,
      amount, // Convert to kobo (Paystack uses smallest currency unit)
      reference,
      metadata: {
        order_id: orderId,
        ...metadata
      },
      callback_url: process.env.PAYSTACK_CALLBACK_URL,
      channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
    };

    const response = await paystackClient.initializeTransaction(paymentData);

    res.status(200).json({
      success: true,
      data: {
        authorizationUrl: response.data.authorization_url,
        accessCode: response.data.access_code,
        reference: response.data.reference
      }
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment initialization failed',
      error: error.message
    });
  }
};

// Verify a payment transaction
exports.verifyPayment = async (req, res, next) => {
  try {
    const { reference } = req.params;

    // Verify the transaction with Paystack
    const response = await paystackClient.verifyTransaction(reference);

    // If payment was successful
    if (response.data.status === 'success') {
      // Find the order by reference
      const order = await Order.findOne({ reference });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Update order status and payment details
      order.paymentStatus = 'paid';
      order.status = 'processing';
      order.paymentDetails = {
        reference: response.data.reference,
        amount: response.data.amount / 100, // Convert from kobo to naira
        currency: response.data.currency,
        channel: response.data.channel,
        paymentDate: new Date(),
        transactionId: response.data.id,
        cardLast4: response.data.authorization?.last4 || null,
        cardBrand: response.data.authorization?.card_type || null
      };

      await order.save();

      // Clear user's cart if they are logged in
      if (order.userId) {
        await Cart.findOneAndUpdate(
          { userId: order.userId },
          { items: [] }
        );
      }

      return res.status(200).json({
        success: true,
        status: 'success',
        message: 'Payment verified successfully',
        order: {
          id: order._id,
          reference: order.reference,
          status: order.status
        }
      });
    } else {
      // Payment failed
      return res.status(400).json({
        success: false,
        status: 'failed',
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

// Webhook handler for Paystack events
exports.paystackWebhook = async (req, res) => {
  try {
    // Verify that the request is from Paystack
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');
    
    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(401).send('Invalid signature');
    }
    
    const { event, data } = req.body;
    
    // For successful charges
    if (event === 'charge.success') {
      const { reference } = data;
      
      // Find order with this reference
      const order = await Order.findOne({ reference });
      
      if (order && order.paymentStatus !== 'paid') {
        order.paymentStatus = 'paid';
        order.status = 'processing';
        order.paymentDetails = {
          reference: data.reference,
          amount: data.amount / 100, // Convert from kobo to naira
          currency: data.currency,
          channel: data.channel,
          paymentDate: new Date(),
          transactionId: data.id,
          cardLast4: data.authorization?.last4 || null,
          cardBrand: data.authorization?.card_type || null
        };
        
        await order.save();
        
        // Clear user's cart if they are logged in
        if (order.userId) {
          await Cart.findOneAndUpdate(
            { userId: order.userId },
            { items: [] }
          );
        }
      }
    }
    
    // Always acknowledge receipt of webhook
    return res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Error processing Paystack webhook:', error);
    // Always return success to Paystack to prevent them from retrying
    return res.status(200).send('Webhook processed');
  }
};

// Get list of banks
exports.getBanks = async (req, res, next) => {
  try {
    const response = await paystackClient.getBanks();
    
    res.status(200).json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('Error fetching banks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch banks',
      error: error.message
    });
  }
};

// backend/controllers/paymentController.js
// Add this function to your existing controller

// Handle Paystack callback
exports.handlePaymentCallback = async (req, res) => {
    try {
      const { reference, trxref } = req.query;
      
      if (!reference) {
        // Redirect to a failure page if no reference is provided
        return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
      }
      
      // Look up the order by reference
      const order = await Order.findOne({ reference });
      
      if (!order) {
        console.error('Order not found for reference:', reference);
        return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
      }
      
      // If the order is already paid, just redirect to success page
      if (order.paymentStatus === 'paid') {
        return res.redirect(`${process.env.FRONTEND_URL}/order-confirmation/${order.reference}`);
      }
      
      // Verify the payment with Paystack
      try {
        const verifyResponse = await paystackClient.verifyTransaction(reference);
        
        if (verifyResponse.data.status === 'success') {
          // Update the order
          order.paymentStatus = 'paid';
          order.status = 'processing';
          const data = verifyResponse.data;
          
          order.paymentDetails = {
            reference: data.reference,
            amount: data.amount / 100, // Convert from kobo to naira
            currency: data.currency,
            channel: data.channel,
            paymentDate: new Date(),
            transactionId: data.id,
            authCode: data.authorization?.authorization_code || null,
            cardLast4: data.authorization?.last4 || null,
            cardBrand: data.authorization?.card_type || null
          };
          
          await order.save();
          
          // Create Shopify order
          try {
            await createShopifyOrder(order);
          } catch (shopifyError) {
            console.error('Error creating Shopify order from callback:', shopifyError);
            // Continue processing even if Shopify sync fails
          }
          
          // Clear the user's cart
          try {
            if (order.userId) {
              await Cart.findOneAndUpdate(
                { userId: order.userId },
                { items: [] }
              );
            }
            // Also clear local storage cart in frontend
            // This can be done in the handlePaymentSuccess function in Checkout.jsx
          } catch (cartError) {
            console.error('Error clearing cart:', cartError);
          }
          
          // Update inventory (if not already handled by Shopify)
          // Loop through items and update inventory in your database if needed
          for (const item of order.items) {
            try {
              // Get variant ID from the item
              const variantId = item.variantId || item.id;
              if (!variantId) continue;
              
              // Normalize variant ID if needed
              let normalizedId = variantId;
              if (typeof normalizedId === 'string') {
                if (normalizedId.includes('/')) {
                  normalizedId = normalizedId.split('/').pop();
                }
                if (normalizedId.includes('-')) {
                  normalizedId = normalizedId.split('-')[0];
                }
              }
              
              // Get current inventory level
              const Product = require('../models/Product'); // Adjust path as needed
              
              // Find the product in your local database
              const product = await Product.findOne({ 
                'variants.variantId': normalizedId 
              });
              
              if (product) {
                // Find the specific variant
                const variantIndex = product.variants.findIndex(v => 
                  v.variantId === normalizedId || v.variantId === String(normalizedId)
                );
                
                if (variantIndex >= 0) {
                  // Get current inventory and ordered quantity
                  const currentInventory = product.variants[variantIndex].inventoryQuantity || 0;
                  const orderedQuantity = item.quantity || 1;
                  
                  // Calculate new inventory level (prevent negative values)
                  const newInventory = Math.max(0, currentInventory - orderedQuantity);
                  
                  // Update inventory in your database
                  product.variants[variantIndex].inventoryQuantity = newInventory;
                  
                  // If inventory reaches zero, mark as not available
                  if (newInventory === 0) {
                    product.variants[variantIndex].availableForSale = false;
                  }
                  
                  await product.save();
                  
                  console.log(`Updated inventory for ${product.title} - ${product.variants[variantIndex].title}: ${currentInventory} → ${newInventory}`);
                }
              }
            } catch (error) {
              console.error(`Error updating inventory for item ${item.title || item.name}:`, error);
              // Continue processing other items even if this one fails
            }
          }
          
          // Redirect to success page
          return res.redirect(`${process.env.FRONTEND_URL}/order-confirmation/${order.reference}`);
        } else {
          // Payment wasn't successful
          return res.redirect(`${process.env.FRONTEND_URL}/payment-failed?reference=${reference}`);
        }
      } catch (verifyError) {
        console.error('Error verifying payment:', verifyError);
        return res.redirect(`${process.env.FRONTEND_URL}/payment-failed?reference=${reference}`);
      }
    } catch (error) {
      console.error('Payment callback error:', error);
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
    }
  };