// controllers/cartController.js - Cart controller
const Cart = require('../models/Cart');
const shopifyClient = require('../utils/shopifyClient');

// Get cart items for a user
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      // Create empty cart if it doesn't exist
      cart = new Cart({ userId: req.user.id, items: [] });
      await cart.save();
    }
    
    res.status(200).json({ cart });
  } catch (error) {
    next(error);
  }
};

// Add item to cart
exports.addToCart = async (req, res, next) => {
  try {
    const { variantId, quantity, title, price, image } = req.body;
    
    let cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      // Create new cart if it doesn't exist
      cart = new Cart({
        userId: req.user.id,
        items: [{
          variantId,
          quantity,
          title,
          price,
          image
        }],
      });
    } else {
      // Check if product already exists in cart
      const itemIndex = cart.items.findIndex(item => item.variantId === variantId);
      
      if (itemIndex > -1) {
        // Update quantity if item exists
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({
          variantId,
          quantity,
          title,
          price,
          image
        });
      }
    }
    
    cart.updatedAt = Date.now();
    await cart.save();
    
    res.status(200).json({ 
      message: 'Item added to cart',
      cart 
    });
  } catch (error) {
    next(error);
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res, next) => {
  try {
    const { variantId, quantity } = req.body;
    
    const cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(item => item.variantId === variantId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }
    
    cart.updatedAt = Date.now();
    await cart.save();
    
    res.status(200).json({
      message: 'Cart updated successfully',
      cart
    });
  } catch (error) {
    next(error);
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res, next) => {
  try {
    const { variantId } = req.params;
    
    const cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(item => item.variantId === variantId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    cart.items.splice(itemIndex, 1);
    cart.updatedAt = Date.now();
    
    await cart.save();
    
    res.status(200).json({
      message: 'Item removed from cart',
      cart
    });
  } catch (error) {
    next(error);
  }
};

// Clear cart
exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.items = [];
    cart.updatedAt = Date.now();
    
    await cart.save();
    
    res.status(200).json({
      message: 'Cart cleared successfully',
      cart
    });
  } catch (error) {
    next(error);
  }
};