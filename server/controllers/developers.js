const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Developer = require('../models/Developer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// @desc    Get developer profile for current user
// @route   GET /api/v1/developers/profile/me
// @access  Private (Developer)
exports.getMyDeveloperProfile = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'developer') {
    return next(
      new ErrorResponse('Access denied. This endpoint is only for developer users.', 403)
    );
  }

  const developer = await Developer.findOne({ userId: req.user.id });

  if (!developer) {
    return res.status(200).json({
      success: true,
      data: null,
      message: 'No developer profile found. Create one to get started.'
    });
  }

  res.status(200).json({
    success: true,
    data: developer
  });
});

// @desc    Get all developers
// @route   GET /api/v1/developers
// @access  Public
exports.getDevelopers = asyncHandler(async (req, res, next) => {
  console.log('GET /api/v1/developers', res);  
  console.log("chutiya madarchod",res.advancedResults)
  res.status(200).json(res.advancedResults);
});

// @desc    Get single developer
// @route   GET /api/v1/developers/:id
// @access  Public
exports.getDeveloper = asyncHandler(async (req, res, next) => {
  const developer = await Developer.findById(req.params.id);
  console.log('GET /api/v1/developers/:id', res);

  if (!developer) {
    return next(
      new ErrorResponse(`Developer not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: developer
  });
});

// @desc    Create developer
// @route   POST /api/v1/developers
// @access  Private (Admin/Agent/Developer)
exports.createDeveloper = asyncHandler(async (req, res, next) => {
  // If user is a developer, connect them to the developer entity
  if (req.user.role === 'developer') {
    req.body.userId = req.user.id;
  }

  const developer = await Developer.create(req.body);

  // If user is a developer, update their developerId
  if (req.user.role === 'developer') {
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user.id, { developerId: developer._id });
  }

  res.status(201).json({
    success: true,
    data: developer
  });
});

exports.updateDeveloper = asyncHandler(async (req, res, next) => {
  console.log("req.body", req.body);
  
  let developer = await Developer.findById(req.params.id);

  if (!developer) {
    return next(
      new ErrorResponse(`Developer not found with id of ${req.params.id}`, 404)
    );
  }

  // Remove fields that shouldn't be updated
  const fieldsToRemove = ['logo', 'teamPhotos', '_id', '__v'];
  fieldsToRemove.forEach(field => delete req.body[field]);

  // Handle nested objects
  const updateFields = {
    ...req.body,
    headquarters: req.body.headquarters || developer.headquarters,
    contact: req.body.contact || developer.contact,
    socialMedia: req.body.socialMedia || developer.socialMedia
  };

  developer = await Developer.findByIdAndUpdate(
    req.params.id,
    updateFields,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: developer
  });
});

// @desc    Delete developer
// @route   DELETE /api/v1/developers/:id
// @access  Private (Admin)
exports.deleteDeveloper = asyncHandler(async (req, res, next) => {
  const developer = await Developer.findById(req.params.id);

  if (!developer) {
    return next(
      new ErrorResponse(`Developer not found with id of ${req.params.id}`, 404)
    );
  }

  // Delete logo from Cloudinary if exists
  if (developer.logo?.publicId) {
    await cloudinary.uploader.destroy(developer.logo.publicId);
  }

  // Use deleteOne() instead of remove()
  await Developer.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Upload developer logo
// @route   PUT /api/v1/developers/:id/logo
// @access  Private (Admin/Agent)
exports.uploadDeveloperLogo = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const developer = await Developer.findById(req.params.id);
  if (!developer) {
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    return next(new ErrorResponse(`Developer not found with id of ${req.params.id}`, 404));
  }

  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'real-estate/developers',
      width: 500,
      height: 500,
      crop: 'fill',
      quality: 'auto:good'
    });

    // Delete old logo if exists
    if (developer.logo?.publicId) {
      try {
        await cloudinary.uploader.destroy(developer.logo.publicId);
      } catch (err) {
        console.error('Error deleting old logo:', err);
      }
    }

    // Update developer
    developer.logo = {
      url: result.secure_url,
      publicId: result.public_id
    };
    await developer.save();

    // Delete temp file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      data: developer.logo.url
    });
  } catch (err) {
    // Clean up temp file if error occurs
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(new ErrorResponse('Logo upload failed', 500));
  }
});