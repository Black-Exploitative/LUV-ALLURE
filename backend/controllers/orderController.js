// backend/controllers/orderController.js - Enhanced to handle Shopify integration
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const shopifyClient = require('../utils/shopifyClient');
const axios = require('axios');
const crypto = require('crypto');
const { createShopifyOrder } = require('../utils/orderUtils');

// Create a new order and initialize payment
exports.createOrder = async (req, res, next) => {
  try {
    const { 
      items, 
      subtotal, 
      tax, 
      shipping, 
      packagingOption, // Packaging option object
      giftMessage, // Gift message for gift packaging
      total, 
      transactionId, 
      reference, 
      shippingProvider,
      estimatedDeliveryDays,
      shippingAddress 
    } = req.body;
    
    // Create order in our database
    const order = new Order({
      userId: req.user ? req.user.id : null,
      items: items.map(item => ({
        variantId: item.variantId || item.id,
        quantity: item.quantity || 1,
        title: item.name || item.title,
        price: item.price,
        image: item.image || (item.images && item.images[0])
      })),
      subtotal,
      tax,
      shipping,
      packagingDetails: { // Add packaging details to the order
        packagingType: packagingOption?.id || 'normal',
        packagingName: packagingOption?.name || 'Normal Packaging',
        packagingPrice: packagingOption?.price || 0,
        giftMessage: giftMessage || null
      },
      total,
      transactionId,
      reference,
      shippingProvider,
      estimatedDeliveryDays,
      shippingAddress,
      paymentGateway: 'paystack',
      status: 'pending'
    });
    
    await order.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Order created successfully',
      orderId: order._id,
      reference
    });
  } catch (error) {
    console.error('Error creating order:', error);
    next(error);
  }
};

// Verify Paystack payment and update order
exports.verifyPayment = async (req, res, next) => {
  try {
    const { orderId, reference } = req.body;
    
    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    // Verify the payment with Paystack
    const verifyUrl = `https://api.paystack.co/transaction/verify/${reference}`;
    const paystackResponse = await axios.get(verifyUrl, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    });
    
    const { data } = paystackResponse.data;
    
    // If payment is successful
    if (paystackResponse.data.status && data.status === 'success') {
      // Update the order
      order.paymentStatus = 'paid';
      order.status = 'processing';
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
      
      // Create order in Shopify
      try {
        await createShopifyOrder(order);
      } catch (shopifyError) {
        console.error('Error creating Shopify order:', shopifyError);
        // Continue with success response even if Shopify sync fails
        // We'll retry Shopify sync later
      }
      
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
      order.paymentStatus = 'failed';
      order.status = 'failed';
      await order.save();
      
      return res.status(400).json({
        success: false,
        status: 'failed',
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    next(error);
  }
};

// Verify that an order was created in Shopify
exports.verifyShopifyOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    return res.status(200).json({
      success: true,
      shopifyOrderId: order.shopifyOrderId || null
    });
  } catch (error) {
    console.error('Error verifying Shopify order:', error);
    next(error);
  }
};

// Create a Shopify order for an existing order
exports.createShopifyOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    // Don't create Shopify order if payment isn't complete
    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({ success: false, message: 'Cannot create Shopify order for unpaid order' });
    }
    
    // Create the Shopify order
    const shopifyOrder = await createShopifyOrder(order);
    
    return res.status(200).json({
      success: true,
      message: 'Shopify order created successfully',
      shopifyOrderId: order.shopifyOrderId
    });
  } catch (error) {
    console.error('Error creating Shopify order:', error);
    next(error);
  }
};


// Get all orders for a user
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    
    res.status(200).json({ 
      success: true,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// Get order by ID
exports.getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findOne({
      _id: orderId,
      userId: req.user ? req.user.id : null
    });
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }
    
    res.status(200).json({ 
      success: true,
      order 
    });
  } catch (error) {
    next(error);
  }
};

// Webhook handler for Paystack payment events
exports.paystackWebhook = async (req, res) => {
  try {
    // Verify the event is from Paystack
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
          authCode: data.authorization?.authorization_code || null,
          cardLast4: data.authorization?.last4 || null,
          cardBrand: data.authorization?.card_type || null
        };
        
        await order.save();
        
        // Create Shopify order if it wasn't created earlier
        try {
          if (!order.shopifyOrderId) {
            await createShopifyOrder(order);
          }
        } catch (shopifyError) {
          console.error('Error creating Shopify order from webhook:', shopifyError);
          // Continue processing even if Shopify sync fails
        }
        
        // Clear the user's cart
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

// Update order status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber, trackingUrl } = req.body;
    
    // Make sure the status is valid
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled', 'failed', 'refunded'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    // Find and update the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Update the order fields
    if (status) order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (trackingUrl) order.trackingUrl = trackingUrl;
    
    await order.save();
    
    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    next(error);
  }
};