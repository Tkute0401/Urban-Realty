const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Media = require('../models/Media');
const Property = require('../models/Property');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// @desc    Upload media (image/video)
// @route   POST /api/v1/media/:entityType/:entityId
// @access  Private
exports.uploadMedia = asyncHandler(async (req, res, next) => {
  if (!req.files?.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const file = req.files.file;
  const entityType = req.params.entityType;
  const entityId = req.params.entityId;

  // Validate entity exists
  let entity;
  if (entityType === 'property') {
    entity = await Property.findById(entityId);
    if (!entity) {
      return next(new ErrorResponse(`Property not found with id of ${entityId}`, 404));
    }
    // Verify ownership
    if (entity.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`Not authorized to upload media for this property`, 401));
    }
  }
  // Add other entity types as needed

  // Validate file type
  const isImage = file.mimetype.startsWith('image');
  const isVideo = file.mimetype.startsWith('video');
  
  if (!isImage && !isVideo) {
    return next(new ErrorResponse('Please upload an image or video file', 400));
  }

  // Validate file size
  const maxSize = isImage ? 
    process.env.MAX_IMAGE_UPLOAD : 
    process.env.MAX_VIDEO_UPLOAD;
  
  if (file.size > maxSize) {
    return next(new ErrorResponse(
      `Please upload a file less than ${maxSize / 1000000}MB`, 
      400
    ));
  }

  try {
    // Upload to Cloudinary
    const uploadOptions = {
      folder: `real-estate/${entityType}s`,
      resource_type: isVideo ? 'video' : 'image',
      quality: 'auto:good'
    };

    if (isImage) {
      uploadOptions.width = 1200;
      uploadOptions.height = 800;
      uploadOptions.crop = 'fill';
    }

    const result = await cloudinary.uploader.upload(file.path, uploadOptions);

    // Create media record
    const media = await Media.create({
      url: result.secure_url,
      publicId: result.public_id,
      mediaType: isVideo ? 'video' : 'image',
      width: result.width,
      height: result.height,
      duration: result.duration,
      format: result.format,
      uploadedBy: req.user.id,
      entityType,
      entityId
    });

    // Clean up temp file
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);

    res.status(201).json({
      success: true,
      data: media
    });
  } catch (err) {
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    return next(new ErrorResponse('Problem with file upload', 500));
  }
});

// @desc    Delete media
// @route   DELETE /api/v1/media/:id
// @access  Private
exports.deleteMedia = asyncHandler(async (req, res, next) => {
  const media = await Media.findById(req.params.id);
  
  if (!media) {
    return next(
      new ErrorResponse(`Media not found with id of ${req.params.id}`, 404)
    );
  }

  // Verify ownership
  if (media.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to delete this media`, 401));
  }

  // Delete from Cloudinary
  try {
    await cloudinary.uploader.destroy(media.publicId, {
      resource_type: media.mediaType === 'video' ? 'video' : 'image'
    });
  } catch (err) {
    console.error('Error deleting from Cloudinary:', err);
  }

  await media.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get media for entity
// @route   GET /api/v1/media/:entityType/:entityId
// @access  Public
exports.getEntityMedia = asyncHandler(async (req, res, next) => {
  const media = await Media.find({
    entityType: req.params.entityType,
    entityId: req.params.entityId
  }).sort('createdAt');

  res.status(200).json({
    success: true,
    count: media.length,
    data: media
  });
});

// @desc    Upload media for admin (standalone media not tied to entity)
// @route   POST /api/v1/admin/media/upload
// @access  Private/Admin
exports.uploadAdminMedia = asyncHandler(async (req, res, next) => {
  if (!req.file && !req.files?.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const file = req.file || req.files.file;
  const { title, description, tags, category, altText } = req.body;

  // Validate file type
  const isImage = file.mimetype.startsWith('image');
  const isVideo = file.mimetype.startsWith('video');
  const isDocument = file.mimetype.startsWith('application') || file.mimetype.includes('pdf') || file.mimetype.includes('document');
  
  if (!isImage && !isVideo && !isDocument) {
    return next(new ErrorResponse('Please upload an image, video, or document file', 400));
  }

  // Validate file size
  const maxSize = isImage ? 
    (process.env.MAX_IMAGE_UPLOAD || 5000000) : 
    (isVideo ? (process.env.MAX_VIDEO_UPLOAD || 50000000) : (process.env.MAX_DOCUMENT_UPLOAD || 10000000));
  
  if (file.size > maxSize) {
    return next(new ErrorResponse(
      `Please upload a file less than ${maxSize / 1000000}MB`, 
      400
    ));
  }

  try {
    // Upload to Cloudinary
    const uploadOptions = {
      folder: `real-estate/admin-media/${category || 'general'}`,
      resource_type: isVideo ? 'video' : (isDocument ? 'raw' : 'image'),
      quality: 'auto:good'
    };

    if (isImage) {
      uploadOptions.width = 1200;
      uploadOptions.height = 800;
      uploadOptions.crop = 'fill';
    }

    // Handle both multer and express-fileupload file objects
    const filePath = file.path || file.tempFilePath || (file.buffer ? null : file);
    
    let result;
    if (file.buffer) {
      // Upload from buffer (multer)
      result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
        uploadStream.end(file.buffer);
      });
    } else {
      // Upload from file path
      result = await cloudinary.uploader.upload(filePath, uploadOptions);
    }

    // Create media record
    const mediaData = {
      url: result.secure_url,
      publicId: result.public_id,
      mediaType: isVideo ? 'video' : (isDocument ? 'document' : 'image'),
      width: result.width,
      height: result.height,
      duration: result.duration,
      format: result.format,
      size: file.size,
      uploadedBy: req.user.id,
      title: title || file.name,
      description: description || '',
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      category: category || 'general',
      altText: altText || title || file.name
    };

    const media = await Media.create(mediaData);

    // Clean up temp file
    if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    if (file.tempFilePath && fs.existsSync(file.tempFilePath)) fs.unlinkSync(file.tempFilePath);

    res.status(201).json({
      success: true,
      data: media
    });
  } catch (err) {
    console.error('Error uploading media:', err);
    if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    if (file.tempFilePath && fs.existsSync(file.tempFilePath)) fs.unlinkSync(file.tempFilePath);
    return next(new ErrorResponse('Problem with file upload', 500));
  }
});

// @desc    Update media metadata
// @route   PUT /api/v1/admin/media/:id
// @access  Private/Admin
exports.updateMedia = asyncHandler(async (req, res, next) => {
  const media = await Media.findById(req.params.id);
  
  if (!media) {
    return next(
      new ErrorResponse(`Media not found with id of ${req.params.id}`, 404)
    );
  }

  // Update fields
  const { title, description, tags, category, altText } = req.body;
  
  if (title) media.title = title;
  if (description !== undefined) media.description = description;
  if (tags) media.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
  if (category) media.category = category;
  if (altText !== undefined) media.altText = altText;

  await media.save();

  res.status(200).json({
    success: true,
    data: media
  });
});