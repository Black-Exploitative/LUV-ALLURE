// backend/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/authMiddleware');

// Initialize a transaction
router.post('/initialize', auth, paymentController.initializePayment);

// Verify a transaction
router.get('/verify/:reference', auth, paymentController.verifyPayment);

// Webhook endpoint (public)
router.post('/webhook', paymentController.paystackWebhook);

// Get banks list
router.get('/banks', paymentController.getBanks);

module.exports = router;