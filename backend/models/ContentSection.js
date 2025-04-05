// models/ContentSection.js
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
    enum: ['hero', 'featured-products', 'banner', 'collection', 'testimonial', 'custom'],
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
    altText: String
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
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

module.exports = mongoose.model('ContentSection', ContentSectionSchema);