// routes/auth.js - Enhanced authentication routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

// Public routes

// Register new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Request password reset
router.post('/forgot-password', authController.forgotPassword);

// Reset password with token
router.post('/reset-password', authController.resetPassword);

// Protected routes - require authentication

// Get user profile
router.get('/profile', auth, authController.getProfile);

// Update user profile
router.put('/profile', auth, authController.updateProfile);

// Change password
router.post('/change-password', auth, authController.changePassword);

module.exports = router;