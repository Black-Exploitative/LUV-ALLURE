// backend/routes/orderRoutes.js - Updated with Shopify integration routes
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');

// Protected routes (require authentication)
router.use(auth);

// Create order and initialize payment
router.post('/create', orderController.createOrder);

// Verify payment
router.post('/verify-payment', orderController.verifyPayment);

// Get all orders for user
router.get('/', orderController.getOrders);

// Get order by ID
router.get('/:orderId', orderController.getOrderById);

// Verify if Shopify order was created
router.get('/:id/verify-shopify', orderController.verifyShopifyOrder);

// Create Shopify order (used for retrying if initial creation failed)
router.post('/:id/create-shopify', orderController.createShopifyOrder);

// Update order status (admin only)
router.put('/:orderId/status', orderController.updateOrderStatus);

router.get('/reference/:reference', orderController.getOrderByReference);

// Export the router
module.exports = router;