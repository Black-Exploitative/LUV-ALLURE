// models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  shopifyProductId: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  vendor: {
    type: String,
    trim: true
  },
  productType: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  variants: [{
    shopifyVariantId: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    sku: {
      type: String,
      trim: true
    },
    color: {
      type: String,
      trim: true
    },
    size: {
      type: String,
      trim: true
    },
    inventory: {
      type: Number,
      default: 0
    }
  }],
  customFields: {
    styleCategory: {
      type: String,
      trim: true
    },
    seasonalCollection: {
      type: String,
      trim: true
    }
  },
  metafields: [{
    key: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    namespace: {
      type: String,
      default: 'custom'
    }
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual to get total inventory
ProductSchema.virtual('totalInventory').get(function() {
  return this.variants.reduce((total, variant) => total + variant.inventory, 0);
});

// Compound index for performance
ProductSchema.index({ 
  shopifyProductId: 1, 
  'variants.color': 1, 
  'variants.size': 1 
});

module.exports = mongoose.model('Product', ProductSchema);