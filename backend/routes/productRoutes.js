// backend/routes/productRoutes.js - Updated product routes with filter support
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Main products endpoint with filter support
router.get('/', productController.getProducts);

// Get product by ID
router.get('/id/:id', productController.getProductById);

// Get product by handle
router.get('/handle/:handle', productController.getProductByHandle);

// Get products by category (e.g., "dresses", "tops")
router.get('/category/:category', productController.getProductsByCategory);

// Get products by color (e.g., "red", "black")
router.get('/color/:color', productController.getProductsByColor);

// Get products by tag (e.g., "sale", "new", "featured")
router.get('/tag/:tag', productController.getProductsByTag);

// Legacy route compatibility - handle route is still supported
router.get('/:handle', productController.getProductByHandle);

module.exports = router;