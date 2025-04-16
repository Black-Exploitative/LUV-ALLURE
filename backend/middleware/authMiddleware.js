// middleware/auth.js - Improved Authentication middleware
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed: No token provided' });
    }
    
    // Make sure JWT_SECRET is defined before using it
    const jwtSecret = process.env.JWT_SECRET || " ";
    
    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    
    // Add user to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Authentication failed: Invalid token' });
  }
};