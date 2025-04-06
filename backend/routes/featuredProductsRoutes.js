// routes/featuredProductsRoutes.js
const express = require('express');
const router = express.Router();
const featuredProductsController = require('../controllers/featuredProductsController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route to get featured products for a section
router.get('/', featuredProductsController.getFeaturedProducts);

// Route to get all featured product sections (for admin dashboard)
router.get('/sections', featuredProductsController.getAllSections);

// Protected routes for admin operations
//router.use(authMiddleware);

// Create or update featured products for a section
router.put('/:sectionId', featuredProductsController.updateFeaturedProducts);

// Delete featured products configuration for a section
router.delete('/:sectionId', featuredProductsController.deleteFeaturedProducts);

module.exports = router;