// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  shopifyCustomerId: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: String,
  lastName: String,
  birthdate: {
    type: Date,
    required: true
  },
  metafields: [{
    key: String,
    value: String,
    type: String,
    namespace: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);