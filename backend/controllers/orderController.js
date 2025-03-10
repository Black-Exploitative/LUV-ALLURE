// controllers/orderController.js - Order controller
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const shopifyClient = require('../utils/shopifyClient');

// Create checkout
exports.createCheckout = async (req, res, next) => {
  try {
    const { shippingAddress } = req.body;
    
    // Get user's cart
    const cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Format line items for Shopify
    const lineItems = cart.items.map(item => ({
      variantId: `gid://shopify/ProductVariant/${item.variantId}`,
      quantity: item.quantity
    }));
    
    // Get user email
    const user = await User.findById(req.user.id);
    
    // Create checkout in Shopify
    const result = await shopifyClient.createCheckout(lineItems, user.email);
    
    if (result.checkoutCreate.checkoutUserErrors.length > 0) {
      return res.status(400).json({ 
        message: result.checkoutCreate.checkoutUserErrors[0].message 
      });
    }
    
    const checkout = result.checkoutCreate.checkout;
    
    // Associate checkout with customer if logged in
    if (req.user.shopifyAccessToken) {
      await shopifyClient.checkoutCustomerAssociate(
        checkout.id,
        req.user.shopifyAccessToken
      );
    }
    
    // Calculate total price
    const totalPrice = cart.items.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0).toFixed(2);
    
    // Create order in our database
    const order = new Order({
      userId: req.user.id,
      checkoutId: checkout.id,
      items: cart.items.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
        title: item.title,
        price: item.price
      })),
      totalPrice,
      shippingAddress,
      status: 'pending'
    });
    
    await order.save();
    
    res.status(201).json({
      message: 'Checkout created successfully',
      order,
      checkout: {
        id: checkout.id,
        webUrl: checkout.webUrl,
        subtotalPrice: checkout.subtotalPrice,
        totalPrice: checkout.totalPrice
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders for a user
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    
    res.status(200).json({ orders });
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
      userId: req.user.id
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(200).json({ order });
  } catch (error) {
    next(error);
  }
};