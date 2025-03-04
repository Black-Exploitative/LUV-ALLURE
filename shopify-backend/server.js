require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const shopifyRoutes = require('./src/routes/shopifyRoutes');
const productRoutes = require('./src/routes/productRoutes');
const customerRoutes = require('./src/routes/customerRoutes');

const app = express();

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(express.json());
app.use('/api/shopify', shopifyRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);