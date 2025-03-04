// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { 
  registerCustomer,
  loginCustomer,
  forgotPassword,
  resetPassword,
  refreshToken,
  googleLogin,
  appleLogin
} = require('../controllers/authController');
const { 
  protect, 
  roleCheck 
} = require('../middlewares/authMiddleware');

// Public Routes
router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);

// Social Login Routes
router.post('/google-login', googleLogin);
router.post('/apple-login', appleLogin);

// Protected Routes
router.get('/profile', protect, (req, res) => {
  res.json(req.user);
});

router.put('/profile', protect, (req, res) => {
  // Update user profile logic
});

// Admin-only Route Example
router.get('/users', 
  protect, 
  roleCheck(['admin', 'manager']), 
  (req, res) => {
    // List all users logic
  }
);

module.exports = router;