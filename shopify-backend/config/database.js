// config/database.js
require('dotenv').config();

module.exports = {
  development: {
    uri: process.env.MONGODB_URI_DEV,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true
    }
  },
  production: {
    uri: process.env.MONGODB_URI_PROD,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false,
      retryWrites: true,
      w: 'majority'
    }
  },
  test: {
    uri: process.env.MONGODB_URI_TEST,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true
    }
  },
  
  // Utility method to get current environment config
  getConfig() {
    const env = process.env.NODE_ENV || 'development';
    return this[env];
  }
};