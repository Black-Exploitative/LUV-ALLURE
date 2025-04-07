// backend/models/ContentSection.js
// Update the ContentSection model to include a 'shop-banner' type

const mongoose = require('mongoose');

const ContentSectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['hero', 'featured-products', 'banner', 'collection', 'testimonial', 'shop-banner', 'custom'],
    default: 'custom'
  },
  content: {
    title: String,
    subtitle: String,
    description: String,
    buttonText: String,
    buttonLink: String,
    alignment: {
      type: String,
      enum: ['left', 'center', 'right'],
      default: 'center'
    }
  },
  media: {
    imageUrl: String,
    videoUrl: String,
    altText: String,
    overlayOpacity: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.4
    }
  },
  ShopifyProductsIDs: [String],
  products: [String],
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

module.exports = mongoose.model('ContentSection', ContentSectionSchema);