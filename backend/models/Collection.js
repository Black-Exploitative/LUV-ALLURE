// backend/models/Collection.js
const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  handle: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true
  },
  headerImage: {
    type: String
  },
  headerTitle: {
    type: String,
    trim: true
  },
  headerDescription: {
    type: String,
    trim: true
  },
  headerOverlayOpacity: {
    type: Number,
    default: 0.5,
    min: 0,
    max: 1
  },
  filters: {
    tags: [String],
    categories: [String],
    customFilters: [{
      name: String,
      values: [String]
    }]
  },
  productIds: [{
    type: String
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

// Update timestamp when document is modified
CollectionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Collection', CollectionSchema);