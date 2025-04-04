// models/Banner.js
const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  page: {
    type: String,
    required: true,
    trim: true
  },
  title: String,
  description: String,
  imageUrl: {
    type: String,
    required: true
  },
  altText: String,
  buttonText: String,
  buttonLink: String,
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: Date,
  endDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Banner', BannerSchema);
