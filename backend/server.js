// backend/server.js - Updated with payment routes
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const searchRoutes = require('./routes/searchRoutes');
const cmsRoutes = require('./routes/cmsRoutes');
const featuredProductsRoutes = require('./routes/featuredProductsRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); // New payment routes

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Special middleware for Paystack webhook (raw body)
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/cms/featured-products', featuredProductsRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/payment', paymentRoutes); // Add payment routes

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));