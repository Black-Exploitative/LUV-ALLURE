// models/Order.js - Complete model with packaging options
const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  variantId: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  title: String,
  price: String,
  image: String
});

const ShippingAddressSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  address: String,
  city: String,
  state: String,
  country: String,
  zipCode: String,
  phone: String,
  email: String
});

const PaymentDetailsSchema = new mongoose.Schema({
  reference: String,
  amount: Number,
  currency: String,
  channel: String,
  paymentDate: Date,
  transactionId: String,
  authCode: String,
  cardLast4: String,
  cardBrand: String
});

// New schema for packaging details
const PackagingDetailsSchema = new mongoose.Schema({
  packagingType: {
    type: String,
    enum: ['normal', 'luxe', 'gift'],
    default: 'normal'
  },
  packagingName: {
    type: String,
    default: 'Normal Packaging'
  },
  packagingPrice: {
    type: Number,
    default: 0
  },
  giftMessage: {
    type: String
  }
});

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
    // Optional to allow guest checkout
  },
  shopifyOrderId: {
    type: String
  },
  checkoutId: {
    type: String
  },
  transactionId: {
    type: String,
    required: true
  },
  reference: {
    type: String,
    required: true,
    unique: true
  },
  items: [OrderItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  shipping: {
    type: Number,
    required: true
  },
  // Add packaging details to the order
  packagingDetails: PackagingDetailsSchema,
  total: {
    type: Number,
    required: true
  },
  shippingAddress: ShippingAddressSchema,
  // Shipping provider details
  shippingProvider: {
    type: String,
    enum: ['GIGL', 'Bolt', 'DHL', 'Other']
  },
  estimatedDeliveryDays: {
    type: String
  },
  trackingNumber: String,
  trackingUrl: String,
  paymentGateway: {
    type: String,
    enum: ['paystack', 'applepay', 'googlepay', 'flutterwave', 'bank'],
    default: 'paystack'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDetails: PaymentDetailsSchema,
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled', 'failed', 'refunded'],
    default: 'pending'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  shopifySyncAttempted: {
    type: Boolean,
    default: false
  },
  shopifySyncError: {
    type: String
  }
});

// Update timestamp when document is updated
OrderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', OrderSchema);