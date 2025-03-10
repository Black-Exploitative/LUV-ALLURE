// controllers/authController.js - Authentication controller
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const shopifyClient = require('../utils/shopifyClient');

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, birthdate } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create user in Shopify
    const shopifyResponse = await shopifyClient.customerCreate(
      email, 
      password, 
      firstName, 
      lastName
    );
    
    if (shopifyResponse.customerCreate.customerUserErrors.length > 0) {
      return res.status(400).json({ 
        message: shopifyResponse.customerCreate.customerUserErrors[0].message 
      });
    }
    
    // Create user in our database with birthdate
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      birthdate: new Date(birthdate),
      shopifyCustomerId: shopifyResponse.customerCreate.customer.id
    });
    
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user in our database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Get Shopify customer access token
    const shopifyResponse = await shopifyClient.customerAccessTokenCreate(email, password);
    
    if (shopifyResponse.customerAccessTokenCreate.customerUserErrors.length > 0) {
      return res.status(400).json({ 
        message: shopifyResponse.customerAccessTokenCreate.customerUserErrors[0].message 
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        shopifyAccessToken: shopifyResponse.customerAccessTokenCreate.customerAccessToken.accessToken
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};