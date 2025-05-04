// routes/searchRoutes.js - Updated with filter endpoints
const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Main search products endpoint (handles filters)
router.get('/products', searchController.searchProducts);

// Specialized endpoints for navbar links
router.get('/category', searchController.getProductsByCategory);
router.get('/new-arrivals', searchController.getNewArrivals);

// Get search suggestions
router.get('/suggestions', searchController.getSearchSuggestions);

// Get trending searches
router.get('/trending', searchController.getTrendingSearches);

// Search by tag (for collections and related products)
router.get('/tag', searchController.searchProductsByTag);

module.exports = router;