const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, mobile, occupation, professionalInfo, reraId } = req.body;

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

  // Prepare user data
  const userData = {
    name,
    email,
    password,
    role: role || 'buyer',
    mobile: mobile || '',
    occupation: occupation || ''
  };

  // Add professional info for professional roles
  if (['agent', 'developer'].includes(role) && professionalInfo) {
    userData.professionalInfo = professionalInfo;
  }

  // Add RERA ID for agent/developer
  if (['agent', 'developer'].includes(role) && reraId) {
    userData.reraId = reraId;
  }

  // Create user
  const user = await User.create(userData);

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
      occupation: user.occupation,
      professionalInfo: user.professionalInfo,
      reraId: user.reraId,
      subscriptionStatus: user.subscriptionStatus
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

  // Ensure user has subscription status (migrate if needed)
  if (!user.subscriptionStatus) {
    user.subscriptionStatus = 'free';
    await user.save();
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
      role: user.role,
      occupation: user.occupation,
      professionalInfo: user.professionalInfo,
      reraId: user.reraId,
      subscriptionStatus: user.subscriptionStatus
    }
  });
});

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password');

  // Ensure user has subscription status (migrate if needed)
  if (!user.subscriptionStatus) {
    user.subscriptionStatus = 'free';
    await user.save();
  }

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        occupation: user.occupation,
        professionalInfo: user.professionalInfo,
        reraId: user.reraId,
        subscriptionStatus: user.subscriptionStatus,
        favorites: user.favorites || [],
        recentlyViewed: user.recentlyViewed || []
      }
    }
  });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const { name, email, mobile, role, reraId, professionalInfo } = req.body;
  const userId = req.user.id;

  const updateFields = {};
  if (name) updateFields.name = name;
  if (email) updateFields.email = email;
  if (mobile) updateFields.mobile = mobile;
  if (role) updateFields.role = role;
  if (reraId !== undefined) updateFields.reraId = reraId;
  if (professionalInfo) updateFields.professionalInfo = professionalInfo;

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
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Ensure favorites array exists
  if (!Array.isArray(user.favorites)) {
    user.favorites = [];
  }

  // Normalize ObjectId comparison by using string values
  const propertyId = req.params.propertyId.toString();
  const initialFavoritesCount = user.favorites.length;
  
  // Remove the property from favorites (if it exists)
  user.favorites = user.favorites.filter(
    id => id.toString() !== propertyId
  );
  
  // Check if property was actually removed
  const wasRemoved = user.favorites.length < initialFavoritesCount;
  
  await user.save();
  
  res.status(200).json({
    success: true,
    wasRemoved,
    message: wasRemoved ? 'Property removed from favorites' : 'Property was not in favorites',
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


// @desc    Check if property is in favorites
// @route   GET /api/v1/auth/favorites/:propertyId/status
// @access  Private
exports.checkFavoriteStatus = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Normalize ObjectId comparison by using string values
  const propertyId = req.params.propertyId.toString();
  const favorites = (user.favorites || []).map(id => id.toString());
  const isFavorite = favorites.includes(propertyId);
  
  res.status(200).json({
    success: true,
    isFavorite
  });
});

// @desc    Add/remove property from favorites
// @route   PUT /api/v1/auth/favorites/:propertyId
// @access  Private
exports.toggleFavorite = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Ensure favorites array exists
  if (!Array.isArray(user.favorites)) {
    user.favorites = [];
  }

  // Normalize ObjectId comparison by using string values
  const propertyId = req.params.propertyId.toString();
  const favorites = user.favorites;
  const index = favorites.findIndex(id => id.toString() === propertyId);

  let isFavorite;
  if (index === -1) {
    // Add to favorites (Mongoose will cast string to ObjectId)
    user.favorites.push(propertyId);
    isFavorite = true;
  } else {
    // Remove from favorites
    user.favorites.splice(index, 1);
    isFavorite = false;
  }
  
  await user.save();
  
  res.status(200).json({
    success: true,
    isFavorite,
    favorites: user.favorites
  });
});

// @desc    Add/remove project from favorites
// @route   PUT /api/v1/auth/project-favorites/:projectId
// @access  Private
exports.toggleProjectFavorite = asyncHandler(async (req, res, next) => {
  console.log('🔧 toggleProjectFavorite called with:', {
    projectId: req.params.projectId,
    userId: req.user?.id,
    method: req.method,
    url: req.url
  });

  const user = await User.findById(req.user.id);
  
  if (!user) {
    console.error('❌ User not found:', req.user.id);
    return next(new ErrorResponse('User not found', 404));
  }

  // Validate projectId format
  const projectId = req.params.projectId;
  if (!projectId || !projectId.match(/^[0-9a-fA-F]{24}$/)) {
    console.error('❌ Invalid project ID format:', projectId);
    return next(new ErrorResponse('Invalid project ID format', 400));
  }

  // Check if project exists
  const Project = require('../models/Project');
  const project = await Project.findById(projectId);
  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  // Ensure projectFavorites array exists
  if (!Array.isArray(user.projectFavorites)) {
    user.projectFavorites = [];
  }

  // Normalize ObjectId comparison by using string values
  const projectIdStr = projectId.toString();
  const projectFavorites = user.projectFavorites;
  const index = projectFavorites.findIndex(id => id.toString() === projectIdStr);

  let isFavorite;
  if (index === -1) {
    // Add to favorites (Mongoose will cast string to ObjectId)
    user.projectFavorites.push(projectId);
    isFavorite = true;
  } else {
    // Remove from favorites
    user.projectFavorites.splice(index, 1);
    isFavorite = false;
  }
  
  try {
    await user.save();
  } catch (error) {
    console.error('Error saving user favorites:', error);
    return next(new ErrorResponse('Failed to update favorites', 500));
  }
  
  res.status(200).json({
    success: true,
    isFavorite,
    projectFavorites: user.projectFavorites
  });
});

// @desc    Check if project is in favorites
// @route   GET /api/v1/auth/project-favorites/:projectId/status
// @access  Private
exports.checkProjectFavoriteStatus = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Normalize ObjectId comparison by using string values
  const projectId = req.params.projectId.toString();
  const projectFavorites = (user.projectFavorites || []).map(id => id.toString());
  const isFavorite = projectFavorites.includes(projectId);
  
  res.status(200).json({
    success: true,
    isFavorite
  });
});

// @desc    Get user project favorites
// @route   GET /api/v1/auth/project-favorites
// @access  Private
exports.getProjectFavorites = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: 'projectFavorites',
    select: 'name description type status startingPrice priceRange location images developer'
  });
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user.projectFavorites
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