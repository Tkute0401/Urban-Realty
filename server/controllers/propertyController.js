
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Property = require('../models/Property');
const User = require('../models/User');
const geocoder = require('../utils/geocoder');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// @desc    Get all properties
// @route   GET /api/v1/properties
// @access  Public
exports.getProperties = asyncHandler(async (req, res, next) => {
  // Advanced filtering, sorting, pagination
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
  removeFields.forEach(param => delete reqQuery[param]);

  // Search functionality
  if (req.query.search) {
    reqQuery.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
      { 'address.city': { $regex: req.query.search, $options: 'i' } },
      { 'address.state': { $regex: req.query.search, $options: 'i' } },
      { buildingName: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  // Status filtering - fix the issue with empty strings
  if (req.query.status) {
    // Ensure status is a valid value
    const validStatuses = ['For Sale', 'For Rent', 'Sold', 'Rented'];
    if (validStatuses.includes(req.query.status)) {
      reqQuery.status = req.query.status;
    } else {
      return next(new ErrorResponse('Invalid status value', 400));
    }
  }

  // Price range filtering
  if (req.query.priceMin || req.query.priceMax) {
    reqQuery.price = {};
    if (req.query.priceMin) reqQuery.price.$gte = parseInt(req.query.priceMin);
    if (req.query.priceMax) reqQuery.price.$lte = parseInt(req.query.priceMax);
  }

  // Property type filtering
  if (req.query.propertyType) {
    reqQuery.type = req.query.propertyType;
  }

  // Bedrooms filtering
  if (req.query.bedrooms) {
    if (req.query.bedrooms.endsWith('+')) {
      const minBedrooms = parseInt(req.query.bedrooms);
      reqQuery.bedrooms = { $gte: minBedrooms };
    } else {
      reqQuery.bedrooms = parseInt(req.query.bedrooms);
    }
  }

  // Bathrooms filtering
  if (req.query.bathrooms) {
    if (req.query.bathrooms.endsWith('+')) {
      const minBathrooms = parseFloat(req.query.bathrooms);
      reqQuery.bathrooms = { $gte: minBathrooms };
    } else {
      reqQuery.bathrooms = parseFloat(req.query.bathrooms);
    }
  }

  // Amenities filtering
  if (req.query.amenities) {
    reqQuery.amenities = { $all: Array.isArray(req.query.amenities) ? req.query.amenities : [req.query.amenities] };
  }

  // Area filtering
  if (req.query.minArea || req.query.maxArea) {
    reqQuery.area = {};
    if (req.query.minArea) reqQuery.area.$gte = parseInt(req.query.minArea);
    if (reqQuery.maxArea) reqQuery.area.$lte = parseInt(req.query.maxArea);
  }

  // Create query string
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Property.find(JSON.parse(queryStr)).populate('agent', 'name email phone mobile');

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Property.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const properties = await query;

  // Pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = { page: page + 1, limit };
  }
  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit };
  }

  res.status(200).json({
    success: true,
    count: properties.length,
    pagination,
    data: properties
  });
});

// @desc    Get single property
// @route   GET /api/v1/properties/:id
// @access  Public
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

// @desc    Create new property
// @route   POST /api/v1/properties
// @access  Private (Agent/Admin)
exports.createProperty = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.agent = req.user.id;

  // Check for published property by same agent
  const publishedProperty = await Property.findOne({ agent: req.user.id });

  // If agent is not admin, they can only add one property
  if (publishedProperty && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `Agent with ID ${req.user.id} has already published a property`,
        400
      )
    );
  }

  // Process images
  const images = req.files?.length > 0 
    ? await uploadImagesToCloudinary(req.files)
    : [];

  // Create property
  const property = await Property.create({
    ...req.body,
    images
  });

  res.status(201).json({ 
    success: true, 
    data: property 
  });
});

// @desc    Update property
// @route   PUT /api/v1/properties/:id
// @access  Private (Agent/Admin)
exports.updateProperty = asyncHandler(async (req, res, next) => {
  let property = await Property.findById(req.params.id);

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is property agent or admin
  if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this property`,
        401
      )
    );
  }

  // Process new images
  let newImages = [];
  if (req.files?.length > 0) {
    newImages = await uploadImagesToCloudinary(req.files);
  }

  // Process existing images
  let existingImages = [];
  if (req.body.existingImages) {
    try {
      existingImages = JSON.parse(req.body.existingImages);
    } catch (err) {
      return next(new ErrorResponse('Invalid existing images data', 400));
    }
  }

  // Update property
  property = await Property.findByIdAndUpdate(req.params.id, {
    ...req.body,
    images: [...existingImages, ...newImages]
  }, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ 
    success: true, 
    data: property 
  });
});

// @desc    Delete property
// @route   DELETE /api/v1/properties/:id
// @access  Private (Agent/Admin)
exports.deleteProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is property agent or admin
  if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this property`,
        401
      )
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

// @desc    Get properties within a radius
// @route   GET /api/v1/properties/radius/:zipcode/:distance
// @access  Public
exports.getPropertiesInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  if (!loc || loc.length === 0) {
    return next(new ErrorResponse('Could not geocode the provided zipcode', 400));
  }

  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians (distance in miles)
  const radius = distance / 3963;

  const properties = await Property.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] }
    }
  }).populate('agent', 'name email phone mobile');

  res.status(200).json({
    success: true,
    count: properties.length,
    data: properties
  });
});

// @desc    Upload photo for property
// @route   PUT /api/v1/properties/:id/photo
// @access  Private (Agent/Admin)
exports.uploadPropertyPhoto = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    return next(new ErrorResponse(`Property not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is property agent or admin
  if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this property`, 401));
  }

  if (!req.files?.file) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Validate file
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD / 1000000}MB`, 400));
  }

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'real-estate/properties',
      width: 1200,
      height: 800,
      crop: 'fill',
      quality: 'auto:good'
    });

    property.images.push({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height
    });

    await property.save();
    fs.unlinkSync(file.path);

    res.status(200).json({
      success: true,
      data: result.secure_url
    });
  } catch (err) {
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    return next(new ErrorResponse('Problem with file upload', 500));
  }
});

// @desc    Upload video for property
// @route   PUT /api/v1/properties/:id/video
// @access  Private (Agent/Admin)
exports.uploadPropertyVideo = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    return next(new ErrorResponse(`Property not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is property agent or admin
  if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this property`, 401));
  }

  if (!req.files?.file) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Validate file
  if (!file.mimetype.startsWith('video')) {
    return next(new ErrorResponse(`Please upload a video file`, 400));
  }

  if (file.size > process.env.MAX_VIDEO_UPLOAD) {
    return next(new ErrorResponse(`Please upload a video less than ${process.env.MAX_VIDEO_UPLOAD / 1000000}MB`, 400));
  }

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: 'video',
      folder: 'real-estate/properties/videos',
      quality: 'auto:good',
      chunk_size: 6000000 // 6MB chunks for large videos
    });

    property.videos = property.videos || [];
    property.videos.push({
      url: result.secure_url,
      publicId: result.public_id,
      duration: result.duration,
      format: result.format
    });

    await property.save();
    fs.unlinkSync(file.path);

    res.status(200).json({
      success: true,
      data: result.secure_url
    });
  } catch (err) {
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    return next(new ErrorResponse('Problem with video upload', 500));
  }
});

// @desc    Get featured properties
// @route   GET /api/v1/properties/featured
// @access  Public
exports.getFeaturedProperties = asyncHandler(async (req, res, next) => {
  const featuredProperties = await Property.find({ featured: true })
    .limit(8)
    .populate('agent', 'name email phone mobile')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: featuredProperties.length,
    data: featuredProperties
  });
});

// @desc    Create property inquiry
// @route   POST /api/v1/properties/:id/inquiries
// @access  Public
exports.createInquiry = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id).populate('agent');
  if (!property) {
    return next(new ErrorResponse(`Property not found with id of ${req.params.id}`, 404));
  }

  const { name, email, phone, message } = req.body;

  const inquiry = await Inquiry.create({
    property: req.params.id,
    from: { name, email, phone },
    to: {
      name: property.agent.name,
      email: property.agent.email,
      phone: property.agent.mobile || property.agent.phone
    },
    message
  });

  // TODO: Send email notification to agent

  res.status(201).json({
    success: true,
    data: inquiry
  });
});

// Helper function to upload images to Cloudinary
const uploadImagesToCloudinary = async (files) => {
  const images = [];
  
  for (const file of files) {
    try {
      if (!fs.existsSync(file.path)) {
        console.error('File does not exist:', file.path);
        continue;
      }

      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'real-estate/properties',
        width: 1200,
        height: 800,
        crop: 'fill',
        quality: 'auto:good'
      });
      
      images.push({
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height
      });
      
      fs.unlinkSync(file.path);
    } catch (err) {
      console.error('Error uploading image:', err);
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      throw err;
    }
  }
  
  return images;
};

// Helper function to upload videos to Cloudinary
const uploadVideosToCloudinary = async (files) => {
  const videos = [];
  
  for (const file of files) {
    try {
      if (!fs.existsSync(file.path)) {
        console.error('File does not exist:', file.path);
        continue;
      }

      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: 'video',
        folder: 'real-estate/properties/videos',
        quality: 'auto:good',
        chunk_size: 6000000
      });
      
      videos.push({
        url: result.secure_url,
        publicId: result.public_id,
        duration: result.duration,
        format: result.format
      });
      
      fs.unlinkSync(file.path);
    } catch (err) {
      console.error('Error uploading video:', err);
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      throw err;
    }
  }
  
  return videos;
};

