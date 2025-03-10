// models/Order.js - Order model
const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  variantId: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  title: String,
  price: String
});

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shopifyOrderId: {
    type: String
  },
  checkoutId: {
    type: String
  },
  items: [OrderItemSchema],
  totalPrice: {
    type: String,
    required: true
  },
  shippingAddress: {
    firstName: String,
    lastName: String,
    address1: String,
    address2: String,
    city: String,
    province: String,
    country: String,
    zip: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);