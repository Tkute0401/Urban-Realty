const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const UserType = require('../models/UserType');

// @desc    Get all user types
// @route   GET /api/v1/admin/user-types
// @access  Private/Admin
exports.getUserTypes = asyncHandler(async (req, res, next) => {
  const userTypes = await UserType.find().sort('name');
  
  res.status(200).json({
    success: true,
    count: userTypes.length,
    data: userTypes
  });
});

// @desc    Get single user type
// @route   GET /api/v1/admin/user-types/:id
// @access  Private/Admin
exports.getUserType = asyncHandler(async (req, res, next) => {
  const userType = await UserType.findById(req.params.id);
  
  if (!userType) {
    return next(
      new ErrorResponse(`User type not found with id of ${req.params.id}`, 404)
    );
  }
  
  res.status(200).json({
    success: true,
    data: userType
  });
});

// @desc    Create user type
// @route   POST /api/v1/admin/user-types
// @access  Private/Admin
exports.createUserType = asyncHandler(async (req, res, next) => {
  const userType = await UserType.create(req.body);
  
  res.status(201).json({
    success: true,
    data: userType
  });
});

// @desc    Update user type
// @route   PUT /api/v1/admin/user-types/:id
// @access  Private/Admin
exports.updateUserType = asyncHandler(async (req, res, next) => {
  let userType = await UserType.findById(req.params.id);
  
  if (!userType) {
    return next(
      new ErrorResponse(`User type not found with id of ${req.params.id}`, 404)
    );
  }
  
  userType = await UserType.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: userType
  });
});

// @desc    Delete user type
// @route   DELETE /api/v1/admin/user-types/:id
// @access  Private/Admin
exports.deleteUserType = asyncHandler(async (req, res, next) => {
  const userType = await UserType.findById(req.params.id);
  
  if (!userType) {
    return next(
      new ErrorResponse(`User type not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Check if this is the default type
  if (userType.isDefault) {
    return next(
      new ErrorResponse('Cannot delete the default user type', 400)
    );
  }
  
  // Check if any users are assigned to this type
  const usersWithType = await User.countDocuments({ userType: userType._id });
  if (usersWithType > 0) {
    return next(
      new ErrorResponse('Cannot delete user type that is assigned to users', 400)
    );
  }
  
  await userType.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});



