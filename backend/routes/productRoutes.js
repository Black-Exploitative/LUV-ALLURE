// routes/products.js - Product routes
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Get all products
router.get('/', productController.getProducts);

router.get('/id/:id', productController.getProductById);

// Get product by handle
router.get('/:handle', productController.getProductByHandle);



module.exports = router;