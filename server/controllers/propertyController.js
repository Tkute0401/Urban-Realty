const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Property = require('../models/Property');
const User = require('../models/User');
const geocoder = require('../utils/geocoder');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const Inquiry = require('../models/Inquiry');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// @desc    Get all properties
// @route   GET /api/v1/properties
// @route   GET /api/v1/properties?search=query
// @route   GET /api/v1/properties?price=min-max
// @route   GET /api/v1/properties?bedrooms=num
// @route   GET /api/v1/properties?type=type
// @route   GET /api/v1/properties?status=status
// @route   GET /api/v1/properties?featured=true
// @route   GET /api/v1/properties?select=fields
// @route   GET /api/v1/properties?sort=sortBy
// @route   GET /api/v1/properties?page=num&limit=num
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

  // Price range filtering
  if (req.query.price) {
    const [min, max] = req.query.price.split('-');
    reqQuery.price = { $gte: parseInt(min), $lte: parseInt(max) };
  }

  // Numeric filters (bedrooms, bathrooms, area)
  const numericFilters = ['bedrooms', 'bathrooms', 'area'];
  numericFilters.forEach(field => {
    if (reqQuery[field]) {
      reqQuery[field] = parseInt(reqQuery[field]);
    }
  });

  // Type filter
  if (reqQuery.type) {
    reqQuery.type = { $in: reqQuery.type.split(',') };
  }

  // Status filter
  if (reqQuery.status) {
    reqQuery.status = { $in: reqQuery.status.split(',') };
  }

  // Featured filter
  if (reqQuery.featured) {
    reqQuery.featured = reqQuery.featured === 'true';
  }

  // Create query string
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Property.find(JSON.parse(queryStr))
    .populate('agent', 'name email phone photo')
    .populate('reviews');

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

  // Calculate average rating for each property
  for (let property of properties) {
    if (property.reviews && property.reviews.length > 0) {
      const avgRating = property.reviews.reduce((acc, review) => acc + review.rating, 0) / property.reviews.length;
      property.avgRating = parseFloat(avgRating.toFixed(1));
    } else {
      property.avgRating = 0;
    }
  }

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
    .populate('agent', 'name email phone photo')
    .populate({
      path: 'reviews',
      select: 'title text rating createdAt',
      populate: {
        path: 'user',
        select: 'name avatar'
      }
    });

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }

  // Calculate average rating
  if (property.reviews && property.reviews.length > 0) {
    const avgRating = property.reviews.reduce((acc, review) => acc + review.rating, 0) / property.reviews.length;
    property.avgRating = parseFloat(avgRating.toFixed(1));
  } else {
    property.avgRating = 0;
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

  // Check for published property by same agent (if not admin)
  if (req.user.role !== 'admin') {
    const publishedProperty = await Property.findOne({ agent: req.user.id });
    if (publishedProperty) {
      return next(
        new ErrorResponse(
          `Agent with ID ${req.user.id} has already published a property`,
          400
        )
      );
    }
  }

  // Process images
  const images = req.files?.length > 0 
    ? await uploadImagesToCloudinary(req.files)
    : [];

  // Create geocoded location
  let location = {};
  try {
    const loc = await geocoder.geocode(
      `${req.body.address.line1} ${req.body.address.street}, ${req.body.address.city}, ${req.body.address.state} ${req.body.address.zipCode}, ${req.body.address.country}`
    );
    if (loc && loc.length > 0) {
      location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode
      };
    }
  } catch (err) {
    console.error('Geocoding error:', err);
  }

  // Create property
  const property = await Property.create({
    ...req.body,
    images,
    location
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
  if (req.files?.images) {
    newImages = await uploadImagesToCloudinary(req.files.images);
  }

  // Process existing images
  let existingImages = [];
  if (req.body.existingImages) {
    try {
      if (Array.isArray(req.body.existingImages)) {
        existingImages = req.body.existingImages.map(img => {
          if (typeof img === 'string') {
            return JSON.parse(img);
          }
          return img;
        });
      } else if (typeof req.body.existingImages === 'string') {
        existingImages = [JSON.parse(req.body.existingImages)];
      }
    } catch (err) {
      return next(new ErrorResponse('Invalid existing images data', 400));
    }
  }

  // Parse amenities if they exist
  let amenities = [];
  if (req.body.amenities) {
    amenities = Array.isArray(req.body.amenities) 
      ? req.body.amenities 
      : [req.body.amenities];
  }

  // Parse address if it exists
  let address = property.address;
  if (req.body.address) {
    try {
      address = typeof req.body.address === 'string' 
        ? JSON.parse(req.body.address) 
        : req.body.address;
    } catch (err) {
      return next(new ErrorResponse('Invalid address data', 400));
    }
  }

  // Update geocoded location if address changed
  let location = property.location;
  if (req.body.address) {
    try {
      const loc = await geocoder.geocode(
        `${address.line1} ${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`
      );
      if (loc && loc.length > 0) {
        location = {
          type: 'Point',
          coordinates: [loc[0].longitude, loc[0].latitude],
          formattedAddress: loc[0].formattedAddress,
          street: loc[0].streetName,
          city: loc[0].city,
          state: loc[0].stateCode,
          zipcode: loc[0].zipcode,
          country: loc[0].countryCode
        };
      }
    } catch (err) {
      console.error('Geocoding error:', err);
    }
  }

  // Create update object
  const updateData = {
    ...req.body,
    address,
    amenities,
    location,
    images: [...existingImages, ...newImages]
  };

  // Remove fields that shouldn't be updated
  delete updateData.existingImages;
  delete updateData.images; // We'll handle this separately

  // Update property
  property = await Property.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  });

  // Handle images update separately to avoid overwriting
  if (newImages.length > 0 || existingImages.length !== property.images.length) {
    property.images = [...existingImages, ...newImages];
    await property.save();
  }

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

  // Delete associated reviews
  await Review.deleteMany({ property: property._id });

  await property.remove();

  res.status(200).json({ 
    success: true, 
    data: {} 
  });
});

// @desc    Get properties within a radius
// @route   GET /api/v1/properties/radius/:zipcode/:distance/:unit?
// @access  Public
exports.getPropertiesInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance, unit = 'mi' } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  if (!loc || loc.length === 0) {
    return next(new ErrorResponse('Could not geocode the provided zipcode', 400));
  }

  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Earth radius in miles = 3963
  // Earth radius in km = 6378
  const radius = unit === 'km' 
    ? distance / 6378 
    : distance / 3963;

  const properties = await Property.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] }
    }
  })
  .populate('agent', 'name email phone photo')
  .populate('reviews');

  // Calculate average rating for each property
  for (let property of properties) {
    if (property.reviews && property.reviews.length > 0) {
      const avgRating = property.reviews.reduce((acc, review) => acc + review.rating, 0) / property.reviews.length;
      property.avgRating = parseFloat(avgRating.toFixed(1));
    } else {
      property.avgRating = 0;
    }
  }

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

// @desc    Get featured properties
// @route   GET /api/v1/properties/featured
// @access  Public
exports.getFeaturedProperties = asyncHandler(async (req, res, next) => {
  const featuredProperties = await Property.find({ featured: true })
    .limit(8)
    .populate('agent', 'name email phone photo')
    .populate('reviews')
    .sort('-createdAt');

  // Calculate average rating for each property
  for (let property of featuredProperties) {
    if (property.reviews && property.reviews.length > 0) {
      const avgRating = property.reviews.reduce((acc, review) => acc + review.rating, 0) / property.reviews.length;
      property.avgRating = parseFloat(avgRating.toFixed(1));
    } else {
      property.avgRating = 0;
    }
  }

  res.status(200).json({
    success: true,
    count: featuredProperties.length,
    data: featuredProperties
  });
});

// @desc    Get properties by agent
// @route   GET /api/v1/properties/agent/:agentId
// @access  Public
exports.getPropertiesByAgent = asyncHandler(async (req, res, next) => {
  const properties = await Property.find({ agent: req.params.agentId })
    .populate('agent', 'name email phone photo')
    .populate('reviews');

  // Calculate average rating for each property
  for (let property of properties) {
    if (property.reviews && property.reviews.length > 0) {
      const avgRating = property.reviews.reduce((acc, review) => acc + review.rating, 0) / property.reviews.length;
      property.avgRating = parseFloat(avgRating.toFixed(1));
    } else {
      property.avgRating = 0;
    }
  }

  res.status(200).json({
    success: true,
    count: properties.length,
    data: properties
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

// @desc    Get property inquiries
// @route   GET /api/v1/properties/:id/inquiries
// @access  Private (Agent/Admin)
exports.getPropertyInquiries = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    return next(new ErrorResponse(`Property not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is property agent or admin
  if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to view these inquiries`, 401));
  }

  const inquiries = await Inquiry.find({ property: req.params.id })
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: inquiries.length,
    data: inquiries
  });
});

// Helper function to upload images to Cloudinary
const uploadImagesToCloudinary = async (files) => {
  const images = [];
  
  // Ensure files is always an array
  const filesArray = Array.isArray(files) ? files : [files];
  
  for (const file of filesArray) {
    try {
      if (!file.path || !fs.existsSync(file.path)) {
        console.error('File does not exist:', file.path);
        continue;
      }

      // Check file size
      const stats = fs.statSync(file.path);
      const fileSizeInBytes = stats.size;
      const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

      if (fileSizeInMB > 5) {
        console.error('File too large:', file.path);
        fs.unlinkSync(file.path);
        continue;
      }

      // Check file extension
      const ext = path.extname(file.originalname).toLowerCase();
      if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        console.error('Invalid file type:', file.path);
        fs.unlinkSync(file.path);
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
      if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
      throw err;
    }
  }
  
  return images;
};