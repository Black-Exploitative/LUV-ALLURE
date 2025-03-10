// routes/orders.js - Order routes
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');

// All order routes are protected
router.use(auth);

// Create checkout
router.post('/checkout', orderController.createCheckout);

// Get all orders for user
router.get('/', orderController.getOrders);

// Get order by ID
router.get('/:orderId', orderController.getOrderById);

module.exports = router;