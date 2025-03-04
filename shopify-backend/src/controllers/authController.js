// controllers/authController.js
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const shopifyConfig = require('../config/shopify');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email,
      role: user.role 
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: '30d' }
  );
};

exports.registerCustomer = async (req, res) => {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName,
      birthdate 
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create Shopify Customer
    const shopifyCustomer = await shopifyConfig.customer.create({
      first_name: firstName,
      last_name: lastName,
      email: email,
      verified_email: true
    });

    // Create User in Local Database
    const newUser = await User.create({
      shopifyCustomerId: shopifyCustomer.id,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      birthdate,
      role: 'customer'
    });

    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      token: generateToken(newUser),
      shopifyCustomerId: shopifyCustomer.id
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Registration failed', 
      error: error.message 
    });
  }
};

exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      email: user.email,
      token: generateToken(user),
      shopifyCustomerId: user.shopifyCustomerId
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Additional authentication methods like forgotPassword, resetPassword, etc.
exports.forgotPassword = async (req, res) => {
  // Implement password reset logic
};

exports.resetPassword = async (req, res) => {
  // Implement password reset verification
};