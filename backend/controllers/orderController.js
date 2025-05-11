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
    console.log('Creating order with data:', JSON.stringify(req.body, null, 2));
    
    const { 
      items, 
      subtotal, 
      tax, 
      shipping, 
      packagingOption,
      giftMessage,
      total, 
      transactionId, 
      reference, 
      shippingProvider,
      estimatedDeliveryDays,
      shippingAddress 
    } = req.body;
    
    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }
    
    if (!subtotal || isNaN(parseFloat(subtotal))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subtotal'
      });
    }
    
    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Reference is required'
      });
    }
    
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }
    
    // Process and normalize numeric values
    const normalizedSubtotal = parseFloat(subtotal);
    const normalizedTax = parseFloat(tax || 0);
    const normalizedShipping = parseFloat(shipping || 0);
    const normalizedTotal = parseFloat(total);
    
    // Validate calculated total
    const calculatedTotal = normalizedSubtotal + normalizedTax + normalizedShipping + 
                          (packagingOption && packagingOption.price ? parseFloat(packagingOption.price) : 0);
    
    if (Math.abs(calculatedTotal - normalizedTotal) > 1) { // Allow small rounding differences
      console.warn(`Total mismatch: provided ${normalizedTotal}, calculated ${calculatedTotal}`);
    }
    
    // Check for existing order with same reference
    const existingOrder = await Order.findOne({ reference });
    if (existingOrder) {
      console.log(`Order with reference ${reference} already exists`);
      return res.status(409).json({
        success: false,
        message: 'An order with this reference already exists',
        orderId: existingOrder._id
      });
    }

    // Format items with consistent prices
    const formattedItems = items.map(item => {
      // Ensure price is a number
      let itemPrice = item.price;
      if (typeof itemPrice === 'string') {
        itemPrice = parseFloat(itemPrice);
      }
      
      return {
        variantId: item.variantId || item.id,
        shopifyProductId: item.productId || item.shopifyProductId || null,
        quantity: item.quantity || 1,
        title: item.title || item.name,
        price: itemPrice,
        image: item.image || (item.images && item.images[0])
      };
    });
    
    // Create order in our database
    const order = new Order({
      userId: req.user ? req.user.id : null,
      items: formattedItems,
      subtotal: normalizedSubtotal,
      tax: normalizedTax,
      shipping: normalizedShipping,
      packagingDetails: {
        packagingType: packagingOption?.id || 'normal',
        packagingName: packagingOption?.name || 'Normal Packaging',
        packagingPrice: packagingOption?.price ? parseFloat(packagingOption.price) : 0,
        giftMessage: giftMessage || null
      },
      total: normalizedTotal,
      transactionId,
      reference,
      shippingProvider,
      estimatedDeliveryDays,
      shippingAddress,
      paymentGateway: 'paystack',
      status: 'pending'
    });
    
    console.log('Saving order to database...');
    await order.save();
    console.log(`Order created successfully with ID: ${order._id}`);
    
    res.status(201).json({ 
      success: true, 
      message: 'Order created successfully',
      orderId: order._id,
      reference
    });
  } catch (error) {
    console.error('Error creating order:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'An order with this reference already exists'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
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
    let order;

    // Check if orderId is a valid MongoDB ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(orderId);

    if (isValidObjectId) {
      // Find by MongoDB ID
      order = await Order.findOne({
        _id: orderId,
        userId: req.user ? req.user.id : null
      });
    } else {
      // Find by Shopify order ID
      order = await Order.findOne({
        shopifyOrderId: orderId,
        userId: req.user ? req.user.id : null
      });

      // If not found in our database, try to fetch from Shopify directly
      if (!order && /^\d+$/.test(orderId)) {
        try {
          const shopifyOrder = await shopifyClient.getOrderById(orderId);
          if (shopifyOrder) {
            // Transform Shopify order to match our format
            return res.status(200).json({
              success: true,
              order: transformShopifyOrder(shopifyOrder, req.user)
            });
          }
        } catch (shopifyError) {
          console.error('Error fetching from Shopify:', shopifyError);
        }
      }
    }
    
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
    console.error(`Error retrieving order:`, error);
    next(error);
  }
};

// Helper function to transform Shopify orders
function transformShopifyOrder(shopifyOrder, user) {
  return {
    _id: shopifyOrder.id,
    shopifyOrderId: shopifyOrder.id,
    reference: shopifyOrder.name || shopifyOrder.order_number,
    createdAt: shopifyOrder.created_at,
    status: mapShopifyStatusToOurs(shopifyOrder.fulfillment_status, shopifyOrder.financial_status),
    total: parseFloat(shopifyOrder.total_price) || 0,
    subtotal: parseFloat(shopifyOrder.subtotal_price) || 0,
    tax: parseFloat(shopifyOrder.total_tax) || 0,
    shipping: parseFloat(shopifyOrder.shipping_lines?.[0]?.price || 0),
    userId: user?.id || null,
    items: shopifyOrder.line_items.map(item => ({
      title: item.title,
      quantity: item.quantity,
      price: parseFloat(item.price),
      variantId: item.variant_id,
      productId: item.product_id,
      image: item.image?.src || '/images/placeholder.jpg'
    })),
    shippingAddress: {
      firstName: shopifyOrder.shipping_address?.first_name || '',
      lastName: shopifyOrder.shipping_address?.last_name || '',
      address: shopifyOrder.shipping_address?.address1 || '',
      city: shopifyOrder.shipping_address?.city || '',
      state: shopifyOrder.shipping_address?.province || '',
      country: shopifyOrder.shipping_address?.country || '',
      zipCode: shopifyOrder.shipping_address?.zip || '',
      phone: shopifyOrder.shipping_address?.phone || ''
    },
    shippingProvider: shopifyOrder.shipping_lines?.[0]?.title || 'Standard Shipping',
    paymentStatus: mapShopifyFinancialStatus(shopifyOrder.financial_status),
    paymentGateway: 'paystack'
  };
}

function mapShopifyFinancialStatus(status) {
  switch(status) {
    case 'paid': return 'paid';
    case 'refunded': return 'refunded';
    case 'partially_refunded': return 'refunded';
    default: return 'pending';
  }
}

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

exports.getOrderByReference = async (req, res, next) => {
  try {
    const { reference } = req.params;
    
    const order = await Order.findOne({
      reference: reference,
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
exports.getShopifyOrders = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Get customer email to find their orders
    const userEmail = req.user.email;
    
    // Use Shopify client to fetch orders
    const shopifyOrders = await shopifyClient.getOrdersByEmail(userEmail);
    
    // Transform Shopify orders to match our format
    const transformedOrders = shopifyOrders.map(order => ({
      _id: order.id,  // Use Shopify order ID
      reference: order.name || order.order_number,
      createdAt: order.created_at,
      status: mapShopifyStatusToOurs(order.fulfillment_status, order.financial_status),
      total: parseFloat(order.total_price) || 0,
      subtotal: parseFloat(order.subtotal_price) || 0,
      tax: parseFloat(order.total_tax) || 0,
      shipping: parseFloat(order.shipping_lines?.[0]?.price || 0),
      items: order.line_items.map(item => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        variantId: item.variant_id,
        productId: item.product_id,
        image: item.image?.src || '/images/placeholder.jpg'
      })),
      shippingProvider: order.shipping_lines?.[0]?.title || 'Standard Shipping',
      trackingNumber: getTrackingNumber(order),
      trackingUrl: getTrackingUrl(order)
    }));
    
    res.status(200).json({
      success: true,
      orders: transformedOrders
    });
  } catch (error) {
    console.error('Error fetching Shopify orders:', error);
    next(error);
  }
};

// Helper function to map Shopify statuses to our status format
function mapShopifyStatusToOurs(fulfillmentStatus, financialStatus) {
  if (financialStatus === 'refunded') return 'refunded';
  if (financialStatus !== 'paid') return 'pending';
  if (fulfillmentStatus === 'fulfilled') return 'completed';
  if (fulfillmentStatus === 'partial') return 'processing';
  if (fulfillmentStatus === null && financialStatus === 'paid') return 'processing';
  return 'pending';
}

// Helper functions to extract tracking info
function getTrackingNumber(order) {
  if (order.fulfillments && order.fulfillments.length > 0) {
    const fulfillment = order.fulfillments[0];
    if (fulfillment.tracking_number) {
      return fulfillment.tracking_number;
    }
  }
  return null;
}

function getTrackingUrl(order) {
  if (order.fulfillments && order.fulfillments.length > 0) {
    const fulfillment = order.fulfillments[0];
    if (fulfillment.tracking_url) {
      return fulfillment.tracking_url;
    }
  }
  return null;
}
