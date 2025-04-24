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
    console.log('Decoded token:', decoded); // Add this line
    req.user = await User.findById(decoded.id);
    console.log('User found:', req.user); // Add this line
    next();
  } catch (err) {
    console.error('JWT Error:', err); // Add this line
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