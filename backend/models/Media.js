// models/Media.js
const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['image', 'video', 'document'],
    default: 'image'
  },
  url: {
    type: String,
    required: true
  },
  thumbnailUrl: String,
  altText: String,
  size: Number,
  dimensions: {
    width: Number,
    height: Number
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Media', MediaSchema);