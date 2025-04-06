// models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  shopifyId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  handle: String,
  productType: String,
  tags: [String],
  price: String,
  compareAtPrice: String,
  imageUrl: String,
  images: [String],
  variants: [{
    variantId: String,
    title: String,
    price: String,
    sku: String
  }],
  collections: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);