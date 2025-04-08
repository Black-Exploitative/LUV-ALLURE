// backend/models/ContentSection.js
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
    enum: [
      'hero', 
      'featured-products', 
      'banner', 
      'collection',
      'testimonial', 
      'shop-banner',
      'collection-hero',  // New type for the collection hero (renamed from shop-banner)
      'promo-section',    // New type for the promo section
      'shop-header',      // New type for the shop page header
      'services',         // Type for services section
      'custom'            // For any custom section type
    ],
    default: 'custom'
  },
  content: {
    title: String,
    subtitle: String,
    description: String,
    buttonText: String,
    buttonLink: String,
    linkText: String,    // For promo section explore link text
    linkUrl: String,     // For promo section explore link URL
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
    },
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      default: 'image'
    }
  },
  shopifyProductIds: [String],  // For linking to Shopify products
  products: [String],           // Generic products field
  services: [{                  // For the services section
    title: String,
    description: String,
    iconUrl: String,
    imageUrl: String
  }],
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

// Update timestamp when modified
ContentSectionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ContentSection', ContentSectionSchema);