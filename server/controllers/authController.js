const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, mobile, occupation } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return next(new ErrorResponse('Please provide name, email and password', 400));
  }

  // Check if user exists
  const existingUser = await User.findOne({ 
    email: { $regex: new RegExp(`^${email}$`, 'i') } 
  });

  if (existingUser) {
    return next(new ErrorResponse('Email already in use', 400));
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'buyer',
    mobile: mobile || '',
    occupation: occupation || ''
  });

  // Create token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      occupation: user.occupation
    }
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  const user = await User.findOne({ 
    email: { $regex: new RegExp(`^${email}$`, 'i') } 
  }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role
    }
  });
});

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password');

  res.status(200).json({
    success: true,
    data: user
  });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const { name, email, mobile, role } = req.body;
  const userId = req.user.id;

  const updateFields = {};
  if (name) updateFields.name = name;
  if (email) updateFields.email = email;
  if (mobile) updateFields.mobile = mobile;
  if (role) updateFields.role = role;

  if (email) {
    const existingUser = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') },
      _id: { $ne: userId }
    });
    
    if (existingUser) {
      return next(new ErrorResponse('Email already in use', 400));
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    updateFields,
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Add property to favorites
// @route   PUT /api/v1/users/favorites/:propertyId
// @access  Private
exports.addToFavorites = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user.favorites) {
    user.favorites = [];
  }
  // Check if property already in favorites
  if (user.favorites.includes(req.params.propertyId)) {
    return next(new ErrorResponse('Property already in favorites', 400));
  }
  
  user.favorites.push(req.params.propertyId);
  await user.save();
  
  res.status(200).json({
    success: true,
    data: user.favorites
  });
});

// @desc    Remove property from favorites
// @route   DELETE /api/v1/users/favorites/:propertyId
// @access  Private
exports.removeFromFavorites = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  // Check if property is in favorites
  if (!user.favorites.includes(req.params.propertyId)) {
    return next(new ErrorResponse('Property not in favorites', 400));
  }
  
  user.favorites = user.favorites.filter(
    id => id.toString() !== req.params.propertyId
  );
  await user.save();
  
  res.status(200).json({
    success: true,
    data: user.favorites
  });
});

// @desc    Get user favorites
// @route   GET /api/v1/users/favorites
// @access  Private
exports.getFavorites = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: 'favorites',
    select: 'title price type status bedrooms bathrooms area images address'
  });
  
  res.status(200).json({
    success: true,
    count: user.favorites.length,
    data: user.favorites
  });
});

// @desc    Add property to recently viewed
// @route   POST /api/v1/users/recently-viewed/:propertyId
// @access  Private
exports.addToRecentlyViewed = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  // Check if property already in recently viewed
  const existingIndex = user.recentlyViewed.findIndex(
    item => item.property.toString() === req.params.propertyId
  );
  
  if (existingIndex !== -1) {
    // Update viewedAt if already exists
    user.recentlyViewed[existingIndex].viewedAt = Date.now();
  } else {
    // Add new entry
    user.recentlyViewed.push({
      property: req.params.propertyId,
      viewedAt: Date.now()
    });
    
    // Keep only last 10 viewed properties
    if (user.recentlyViewed.length > 10) {
      user.recentlyViewed = user.recentlyViewed.slice(-10);
    }
  }
  
  await user.save();
  
  res.status(200).json({
    success: true,
    data: user.recentlyViewed
  });
});

// @desc    Get recently viewed properties
// @route   GET /api/v1/users/recently-viewed
// @access  Private
exports.getRecentlyViewed = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: 'recentlyViewed.property',
    select: 'title price type status bedrooms bathrooms area images address'
  });
  
  // Sort by viewedAt (newest first)
  const recentlyViewed = user.recentlyViewed
    .sort((a, b) => b.viewedAt - a.viewedAt)
    .map(item => item.property);
  
  res.status(200).json({
    success: true,
    count: recentlyViewed.length,
    data: recentlyViewed
  });
});