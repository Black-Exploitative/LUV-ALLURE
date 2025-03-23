// routes/searchRoutes.js
const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Search products
router.get('/products', searchController.searchProducts);

// Get search suggestions
router.get('/suggestions', searchController.getSearchSuggestions);

// Get trending searches
router.get('/trending', searchController.getTrendingSearches);

module.exports = router;