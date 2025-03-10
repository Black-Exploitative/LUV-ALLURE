// middleware/errorHandler.js - Error handling middleware
module.exports = (err, req, res, next) => {
    console.error(err.stack);
    
    // Default error object
    const error = {
      message: err.message || 'Something went wrong',
      status: err.status || 500
    };
    
    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      error.message = Object.values(err.errors).map(val => val.message).join(', ');
      error.status = 400;
    }
    
    // Handle duplicate key error
    if (err.code === 11000) {
      error.message = 'Duplicate field value entered';
      error.status = 400;
    }
    
    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
      error.message = 'Invalid token';
      error.status = 401;
    }
    
    // Handle JWT expiration
    if (err.name === 'TokenExpiredError') {
      error.message = 'Token expired';
      error.status = 401;
    }
    
    res.status(error.status).json({ 
      success: false,
      message: error.message 
    });
  };