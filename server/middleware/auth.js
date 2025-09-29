const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check for token in cookies (for web clients)
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    console.log('❌ No token found in request');
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ JWT decoded successfully for user:', decoded.id);
    
    // Check if JWT_SECRET is properly set
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET environment variable is not set');
      return next(new ErrorResponse('Server configuration error', 500));
    }
    
    // Fetch the actual user from database to get correct role
    const user = await User.findById(decoded.id);
    if (!user) {
      console.error('❌ User not found in database:', decoded.id);
      return next(new ErrorResponse('User not found', 401));
    }
    
    // Check if user is active
    if (!user.active) {
      console.error('❌ User account is deactivated:', decoded.id);
      return next(new ErrorResponse('Account deactivated', 401));
    }
    
    req.user = {
      _id: user._id,
      id: user._id,
      role: user.role,
      subscriptionStatus: user.subscriptionStatus || 'free',
      subscriptionExpiry: user.subscriptionExpiry || null,
      name: user.name,
      email: user.email
    };
    
    console.log('✅ User authenticated:', req.user.id, 'Role:', req.user.role);
    next();
  } catch (err) {
    console.error('❌ JWT Error:', err.message);
    console.error('❌ JWT Error details:', err);
    
    if (err.name === 'TokenExpiredError') {
      return next(new ErrorResponse('Token expired', 401));
    } else if (err.name === 'JsonWebTokenError') {
      return next(new ErrorResponse('Invalid token', 401));
    } else if (err.name === 'NotBeforeError') {
      return next(new ErrorResponse('Token not active', 401));
    }
    
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};
const authorize = (...roles) => {
  return (req, res, next) => {
    console.log('User role:', req.user?.role); // Add this line
    console.log('Required roles:', roles); // Add this line
    
    if (!roles.includes(req.user?.role)) {
      return next(
        new ErrorResponse(`User role ${req.user?.role} is not authorized`, 403)
      );
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
};