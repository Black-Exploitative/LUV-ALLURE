// models/ProductRelationship.js
const mongoose = require('mongoose');

const ProductRelationshipSchema = new mongoose.Schema({
  sourceProductId: {
    type: String,
    required: true
  },
  relatedProductId: {
    type: String,
    required: true
  },
  relationType: {
    type: String,
    enum: ['style-with', 'also-purchased', 'also-viewed', 'recommended'],
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
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

// Compound index to prevent duplicate relationships
ProductRelationshipSchema.index(
  { sourceProductId: 1, relatedProductId: 1, relationType: 1 },
  { unique: true }
);

// Update timestamp when document is modified
ProductRelationshipSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ProductRelationship', ProductRelationshipSchema);