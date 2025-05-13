// Modified server.js for Vercel - Updated CORS

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
const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config();
const app = express();

mongoose.set('strictQuery', false);

// Simplified CORS configuration to fix Vercel issues
app.use(cors({
  origin: '*', // Allow all origins for now
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Add OPTIONS method handler
app.options('*', cors());

// Body parsing middleware
app.use(express.json());

// Special middleware for Paystack webhook (raw body)
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

// Serve uploaded files
// For Vercel, we'll need to adapt this
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
} else {
  // In production on Vercel, serve from the current directory
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  
  // Log to debug
  app.use('/uploads', (req, res, next) => {
    console.log(`Uploads requested: ${req.url}`);
    next();
  });
}

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Test route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Log all requests in production for debugging
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/cms/featured-products', featuredProductsRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/payment', paymentRoutes);

// Error handling middleware
app.use(errorHandler);

// Only start the server if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the Express app for Vercel
module.exports = app;