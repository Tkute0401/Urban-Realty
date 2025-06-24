const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Developer = require('../models/Developer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// @desc    Get all developers
// @route   GET /api/v1/developers
// @access  Public
exports.getDevelopers = asyncHandler(async (req, res, next) => {
  console.log('GET /api/v1/developers', res);  
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
// @access  Private (Admin/Agent)
exports.createDeveloper = asyncHandler(async (req, res, next) => {
  const developer = await Developer.create(req.body);

  res.status(201).json({
    success: true,
    data: developer
  });
});

exports.updateDeveloper = asyncHandler(async (req, res, next) => {
  let developer = await Developer.findById(req.params.id);

  if (!developer) {
    return next(
      new ErrorResponse(`Developer not found with id of ${req.params.id}`, 404)
    );
  }

  // // Parse JSON strings if they exist
  // if (req.body.headquarters) {
  //   req.body.headquarters = JSON.parse(req.body.headquarters);
  // }
  // if (req.body.flagshipProjects) {
  //   req.body.flagshipProjects = JSON.parse(req.body.flagshipProjects);
  // }
  // if (req.body.team) {
  //   req.body.team = JSON.parse(req.body.team);
  // }
  // if (req.body.specializations) {
  //   req.body.specializations = JSON.parse(req.body.specializations);
  // }
  // if (req.body.contact) {
  //   req.body.contact = JSON.parse(req.body.contact);
  // }
  // if (req.body.socialMedia) {
  //   req.body.socialMedia = JSON.parse(req.body.socialMedia);
  // }
  // if (req.body.awards) {
  //   req.body.awards = JSON.parse(req.body.awards);
  // }

  const fieldsToUpdate = JSON.parse(req.body);

  developer = await Developer.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

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
  const developer = await Developer.findById(req.params.id);

  if (!developer) {
    return next(
      new ErrorResponse(`Developer not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD /
          1000000}MB`,
        400
      )
    );
  }

  // Upload to cloudinary
  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: 'real-estate/developers',
    width: 500,
    height: 500,
    crop: 'fill'
  });

  // Delete old logo if exists
  if (developer.logo?.publicId) {
    await cloudinary.uploader.destroy(developer.logo.publicId);
  }

  developer.logo = {
    url: result.secure_url,
    publicId: result.public_id
  };

  await developer.save();

  res.status(200).json({
    success: true,
    data: result.secure_url
  });
});