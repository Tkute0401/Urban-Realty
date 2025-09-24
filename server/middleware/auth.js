const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ JWT decoded successfully for user:', decoded.id);
    
    // Fetch the actual user from database to get correct role
    const user = await User.findById(decoded.id);
    if (!user) {
      console.error('❌ User not found in database:', decoded.id);
      return next(new ErrorResponse('User not found', 401));
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