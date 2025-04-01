const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Property = require('../models/Property');
const User = require('../models/User');
const Inquiry = require('../models/Inquiry');
const cloudinary = require('cloudinary').v2;

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().select('-password');

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Get single user
// @route   GET /api/v1/admin/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Create user (Admin only)
// @route   POST /api/v1/admin/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc    Update user
// @route   PUT /api/v1/admin/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).select('-password');

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/v1/admin/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Update user role
// @route   PUT /api/v1/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;

  if (!['buyer', 'agent', 'admin'].includes(role)) {
    return next(new ErrorResponse('Invalid role specified', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  ).select('-password');

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Get all properties (Admin view)
// @route   GET /api/v1/admin/properties
// @access  Private/Admin
exports.getAllProperties = asyncHandler(async (req, res, next) => {
  const properties = await Property.find()
    .populate('agent', 'name email phone mobile')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: properties.length,
    data: properties
  });
});

// @desc    Get single property (Admin view)
// @route   GET /api/v1/admin/properties/:id
// @access  Private/Admin
exports.getProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id)
    .populate('agent', 'name email phone mobile');

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: property
  });
});

// @desc    Delete property (Admin only)
// @route   DELETE /api/v1/admin/properties/:id
// @access  Private/Admin
exports.deleteProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }

  // Delete images from Cloudinary
  for (const image of property.images) {
    try {
      await cloudinary.uploader.destroy(image.publicId);
    } catch (err) {
      console.error('Error deleting image from Cloudinary:', err);
    }
  }

  await property.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Toggle featured property
// @route   PATCH /api/v1/admin/properties/:id/featured
// @access  Private/Admin
exports.toggleFeatured = asyncHandler(async (req, res, next) => {
  const property = await Property.findByIdAndUpdate(
    req.params.id,
    { featured: req.body.featured },
    { new: true }
  ).populate('agent', 'name email phone mobile');

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: property
  });
});

// @desc    Get all inquiries
// @route   GET /api/v1/admin/inquiries
// @access  Private/Admin
exports.getInquiries = asyncHandler(async (req, res, next) => {
  const inquiries = await Inquiry.find()
    .populate('property', 'title')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: inquiries.length,
    data: inquiries
  });
});

// @desc    Get single inquiry
// @route   GET /api/v1/admin/inquiries/:id
// @access  Private/Admin
exports.getInquiry = asyncHandler(async (req, res, next) => {
  const inquiry = await Inquiry.findById(req.params.id)
    .populate('property', 'title');

  if (!inquiry) {
    return next(
      new ErrorResponse(`Inquiry not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: inquiry
  });
});

// @desc    Update inquiry status
// @route   PATCH /api/v1/admin/inquiries/:id/status
// @access  Private/Admin
exports.updateInquiryStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  if (!['pending', 'contacted', 'completed', 'rejected'].includes(status)) {
    return next(new ErrorResponse('Invalid status specified', 400));
  }

  const inquiry = await Inquiry.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  ).populate('property', 'title');

  res.status(200).json({
    success: true,
    data: inquiry
  });
});

// @desc    Delete inquiry
// @route   DELETE /api/v1/admin/inquiries/:id
// @access  Private/Admin
exports.deleteInquiry = asyncHandler(async (req, res, next) => {
  await Inquiry.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get dashboard statistics
// @route   GET /api/v1/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  const [
    totalUsers,
    totalAgents,
    totalProperties,
    totalInquiries,
    featuredProperties,
    recentInquiries
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'agent' }),
    Property.countDocuments(),
    Inquiry.countDocuments(),
    Property.find({ featured: true }).limit(5),
    Inquiry.find().sort('-createdAt').limit(5).populate('property', 'title')
  ]);

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalUsers,
        totalAgents,
        totalProperties,
        totalInquiries
      },
      featuredProperties,
      recentInquiries
    }
  });
});