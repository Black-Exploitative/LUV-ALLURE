// backend/routes/orderRoutes.js - Fixed Order routes
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');

// All order routes are protected
router.use(auth);

// Create order and initialize payment
router.post('/create', orderController.createOrder);

// Verify payment
router.post('/verify-payment', orderController.verifyPayment);

// Get all orders for user
router.get('/', orderController.getOrders);

// Get order by ID
router.get('/:orderId', orderController.getOrderById);

// Update order status (admin only)
router.put('/:orderId/status', orderController.updateOrderStatus);

module.exports = router;