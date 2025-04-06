// models/FeaturedProducts.js
const mongoose = require('mongoose');

const FeaturedProductsSchema = new mongoose.Schema({
  sectionId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  productIds: {
    type: [String],
    required: true,
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the timestamp when document is updated
FeaturedProductsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('FeaturedProducts', FeaturedProductsSchema);