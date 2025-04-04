// models/HomepageLayout.js
const mongoose = require('mongoose');

const HomepageLayoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  sections: [{
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContentSection'
    },
    order: {
      type: Number,
      default: 0
    },
    column: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      min: 1,
      max: 12,
      default: 12
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HomepageLayout', HomepageLayoutSchema);