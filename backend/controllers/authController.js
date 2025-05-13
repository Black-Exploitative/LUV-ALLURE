// controllers/authController.js - Fixed JWT Secret issue
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const shopifyClient = require('../utils/shopifyClient');
const shopifyPasswordProxy = require('../utils/shopifyPasswordProxy');

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
    
    // Store the Shopify password securely
    await shopifyPasswordProxy.storeShopifyPassword(user._id, password);
    
    // Make sure JWT_SECRET is defined before using it
    const jwtSecret = process.env.JWT_SECRET || "";
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      jwtSecret,
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
    
    // Store/update the Shopify password securely (in case it changed elsewhere)
    await shopifyPasswordProxy.storeShopifyPassword(user._id, password);
    
    // Get Shopify customer access token
    const shopifyResponse = await shopifyClient.customerAccessTokenCreate(email, password);
    
    if (shopifyResponse.customerAccessTokenCreate.customerUserErrors.length > 0) {
      return res.status(400).json({ 
        message: shopifyResponse.customerAccessTokenCreate.customerUserErrors[0].message 
      });
    }
    
    // Make sure JWT_SECRET is defined before using it
    const jwtSecret = process.env.JWT_SECRET || "";
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        shopifyAccessToken: shopifyResponse.customerAccessTokenCreate.customerAccessToken.accessToken
      },
      jwtSecret,
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
    const user = await User.findById(req.user.id).select('-password -shopifyPasswordEncrypted');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNumber } = req.body;
    
    // Find and update user in our database
    const user = await User.findByIdAndUpdate(
      req.user.id, 
      { firstName, lastName, phoneNumber, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).select('-password -shopifyPasswordEncrypted');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user in Shopify if we have a stored password
    const hasStoredPassword = await shopifyPasswordProxy.hasStoredShopifyPassword(req.user.id);
    
    if (hasStoredPassword) {
      try {
        // Get Shopify token
        const shopifyToken = await shopifyPasswordProxy.getShopifyToken(req.user.id);
        
        // Update Shopify customer profile
        await shopifyClient.updateCustomer(shopifyToken, {
          firstName,
          lastName,
          phone: phoneNumber
        });
      } catch (shopifyError) {
        console.error('Error updating Shopify profile:', shopifyError);
        // Continue with our own system's update even if Shopify update fails
      }
    }
    
    res.status(200).json({ 
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

// Change password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Find user in database
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Update password in our database
    user.password = newPassword;
    await user.save();
    
    // Update password in Shopify using the proxy
    try {
      await shopifyPasswordProxy.updateShopifyPassword(user._id, newPassword);
    } catch (shopifyError) {
      console.error('Error updating Shopify password:', shopifyError);
      // Continue with our own password change even if Shopify update fails
    }
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Request password reset
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    // Always return success even if email not found (for security)
    if (!user) {
      return res.status(200).json({ 
        message: 'If an account exists with that email, a password reset link has been sent' 
      });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token and save to user record
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Set token expiration (1 hour)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
    await user.save();
    
    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    // In a real application, you would send an email with the reset URL
    // For demonstration, we're just logging it
    console.log(`Password reset link: ${resetUrl}`);
    
    // Check if we have a stored Shopify password
    const hasStoredPassword = await shopifyPasswordProxy.hasStoredShopifyPassword(user._id);
    
    // If we don't have the encrypted Shopify password, trigger Shopify's own reset flow
    if (!hasStoredPassword) {
      try {
        await shopifyClient.customerRecover(email);
        console.log(`Shopify password recovery email sent to ${email}`);
      } catch (shopifyError) {
        console.error('Error triggering Shopify password recovery:', shopifyError);
        // Continue with our own reset flow even if Shopify recovery fails
      }
    }
    
    res.status(200).json({ 
      message: 'If an account exists with that email, a password reset link has been sent' 
    });
  } catch (error) {
    next(error);
  }
};

// Reset password with token
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    
    // Hash the token from the URL
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // Find user with the hashed token and check if token is still valid
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }
    
    // Update password in our database
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();
    
    // Check if we have a stored Shopify password
    const hasStoredPassword = await shopifyPasswordProxy.hasStoredShopifyPassword(user._id);
    
    // Update Shopify password if we have the encrypted original password
    if (hasStoredPassword) {
      try {
        // This uses the stored password to get a token and update the password
        await shopifyPasswordProxy.resetShopifyPasswordWithStored(user._id, newPassword);
      } catch (shopifyError) {
        console.error('Error resetting Shopify password:', shopifyError);
        // Continue with our own reset even if Shopify reset fails
      }
    }
    
    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    next(error);
  }
};