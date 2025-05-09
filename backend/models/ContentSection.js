// backend/models/ContentSection.js - Update to ensure overlay opacity support
const mongoose = require('mongoose');

const ContentSectionSchema = new mongoose.Schema({
name: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    required: true,
    enum: ['hero', 'banner', 'featured-products', 'custom', 'collection', 'testimonial', 'shop-banner', 'promo-section', 'collection-hero', 'shop-header']
  },
  // Add deviceType field to distinguish between mobile and desktop versions
  deviceType: { 
    type: String, 
    enum: ['mobile', 'desktop'],
    default: 'desktop' // Default to desktop for backward compatibility
  },
  content: {
    title: String,
    subtitle: String,
    description: String,
    buttonText: String,
    buttonLink: String,
    alignment: { 
      type: String, 
      default: 'center',
      enum: ['left', 'center', 'right']
    },
    buttonPosition: { // Add button position support
      type: String,
      default: 'bottom',
      enum: ['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right']
    },
    linkText: String,  // For promo sections
    linkUrl: String    // For promo sections
  },
  media: {
    imageUrl: String,
    videoUrl: String,
    altText: String,
    overlayOpacity: {
      type: Number,
      default: 0.3,
      min: 0,
      max: 1
    }
  },
  products: [String], // Array of product IDs
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

ContentSectionSchema.statics.findActiveByType = function(type, deviceType) {
  const query = { type, isActive: true };
  
  // If deviceType is specified, filter by that as well
  if (deviceType) {
    // If deviceType is 'desktop', also include sections with null deviceType (for backward compatibility)
    if (deviceType === 'desktop') {
      query.$or = [{ deviceType: 'desktop' }, { deviceType: { $exists: false } }];
    } else {
      query.deviceType = deviceType;
    }
  }
  
  return this.find(query).sort({ order: 1 });
};
module.exports = mongoose.model('ContentSection', ContentSectionSchema);