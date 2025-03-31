const Property = require('../models/Property');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const mongoose = require('mongoose');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Helper functions
const parseAddress = (address) => {
  if (typeof address === 'string') {
    try {
      return JSON.parse(address);
    } catch (err) {
      throw new Error('Invalid address format. Address should be a valid JSON object');
    }
  }
  return address;
};

const validateAddress = (address) => {
  if (!address) throw new Error('Address is required');
  
  const requiredFields = ['street', 'city', 'state', 'country'];
  const missingFields = requiredFields.filter(field => !address[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing address fields: ${missingFields.join(', ')}`);
  }
  
  if (address.country === 'India' && !address.zipCode) {
    throw new Error('Zip code is required for Indian addresses');
  }
};

const geocodeWithRetry = async (addressString, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const loc = await geocoder.geocode(addressString);
      if (loc && loc.length > 0) return loc;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(res => setTimeout(res, delay));
    }
  }
  return null;
};

const processGeocodeResult = (geocodeResult) => {
  if (!geocodeResult || geocodeResult.length === 0) {
    throw new Error('No results found for this address');
  }

  const result = geocodeResult[0];
  
  return {
    type: 'Point',
    coordinates: [result.longitude, result.latitude],
    street: result.streetName || result.streetNumber || '',
    city: result.city || '',
    state: result.state || result.stateCode || '',
    zipCode: result.zipcode || '',
    country: result.country || result.countryCode || '',
    formattedAddress: result.formattedAddress || ''
  };
};

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

// @desc    Get all properties with agent mobile numbers
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

// @desc    Get single property with agent mobile
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
// @access  Private
exports.createProperty = asyncHandler(async (req, res, next) => {
  try {
    // Parse and validate address
    const address = parseAddress(req.body.address);
    validateAddress(address);

    // Geocode the address
    const addressString = `${address.street}, ${address.city}, ${address.state}, ${address.zipCode}, ${address.country}`;
    const geocodeResult = await geocodeWithRetry(addressString);
    
    if (!geocodeResult || geocodeResult.length === 0) {
      return next(new ErrorResponse('Could not geocode the address', 400));
    }

    const location = processGeocodeResult(geocodeResult);

    // Process images
    const images = req.files?.length > 0 
      ? await uploadImagesToCloudinary(req.files)
      : [];

    // Create property
    const property = await Property.create({
      ...req.body,
      address,
      location,
      images,
      agent: req.user.id
    });

    res.status(201).json({ 
      success: true, 
      data: property 
    });

  } catch (err) {
    // Clean up any uploaded files on error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }
    
    next(err);
  }
});

// @desc    Update property
// @route   PUT /api/v1/properties/:id
// @access  Private
exports.updateProperty = asyncHandler(async (req, res, next) => {
  try {
    const propertyId = req.params.id;
    
    if (!propertyId) {
      return next(new ErrorResponse('Property ID is required', 400));
    }

    // Find property with agent populated
    let property = await Property.findById(propertyId).populate('agent');
    if (!property) {
      return next(new ErrorResponse(`Property not found with id ${propertyId}`, 404));
    }

    // Verify ownership
    if (property.agent._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to update this property', 401));
    }

    // Process address updates
    if (req.body.address) {
      try {
        const parsedAddress = typeof req.body.address === 'string' 
          ? JSON.parse(req.body.address) 
          : req.body.address;

        // Validate required fields
        if (!parsedAddress.street || !parsedAddress.city || !parsedAddress.state) {
          throw new Error('Street, city and state are required');
        }

        // Update address fields
        property.address = {
          line1: parsedAddress.line1 || property.address.line1 || '',
          street: parsedAddress.street,
          city: parsedAddress.city,
          state: parsedAddress.state,
          zipCode: parsedAddress.zipCode || property.address.zipCode || '',
          country: parsedAddress.country || property.address.country || 'India'
        };

        // Geocode new address
        const addressString = `${property.address.street}, ${property.address.city}, ${property.address.state}, ${property.address.zipCode}, ${property.address.country}`;
        const geocodeResult = await geocodeWithRetry(addressString);
        
        if (!geocodeResult || geocodeResult.length === 0) {
          throw new Error('Could not geocode the address');
        }

        // Update location with new coordinates
        property.location = processGeocodeResult(geocodeResult);

      } catch (err) {
        return next(new ErrorResponse(`Address error: ${err.message}`, 400));
      }
    }

    // Update other fields
    const updatableFields = [
      'title', 'description', 'type', 'status', 'price',
      'bedrooms', 'bathrooms', 'area', 'buildingName', 'floorNumber', 'featured'
    ];

    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        property[field] = req.body[field];
      }
    });

    // Update amenities
    if (req.body.amenities !== undefined) {
      property.amenities = Array.isArray(req.body.amenities) 
        ? req.body.amenities 
        : [req.body.amenities].filter(Boolean);
    }

    // Process existing images
    if (req.body.existingImages !== undefined) {
      try {
        property.images = Array.isArray(req.body.existingImages)
          ? req.body.existingImages.map(img => {
              const parsed = typeof img === 'string' ? JSON.parse(img) : img;
              return {
                url: parsed.url,
                publicId: parsed.publicId,
                _id: parsed._id || new mongoose.Types.ObjectId(),
                width: parsed.width,
                height: parsed.height
              };
            })
          : [];
      } catch (err) {
        return next(new ErrorResponse('Invalid image data format', 400));
      }
    }

    // Process new images
    if (req.files?.length > 0) {
      try {
        const newImages = await uploadImagesToCloudinary(req.files);
        property.images = [...property.images, ...newImages];
      } catch (err) {
        return next(new ErrorResponse('Failed to upload new images', 500));
      }
    }

    // Save the updated property
    const updatedProperty = await property.save();
    
    // Get fully populated property for response
    const populatedProperty = await Property.findById(updatedProperty._id)
      .populate('agent', 'name email phone mobile');

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: populatedProperty
    });

  } catch (err) {
    // Clean up uploaded files if error occurred
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    
    next(err);
  }
});

// @desc    Delete property
// @route   DELETE /api/v1/properties/:id
// @access  Private
exports.deleteProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }

  // // Authorization check
  // if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.user.id} is not authorized to delete this property  ${property.agent}`,
  //       401
  //     )
  //   );
  // }

  // Delete images from Cloudinary
  for (const image of property.images) {
    try {
      await cloudinary.uploader.destroy(image.publicId);
    } catch (err) {
      console.error('Error deleting image from Cloudinary:', err);
    }
  }

  await Property.deleteOne({ _id: req.params.id });

  res.status(200).json({ 
    success: true, 
    data: {},
    message: 'Property deleted successfully'
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
// @access  Private
exports.uploadPropertyPhoto = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    return next(new ErrorResponse(`Property not found with id of ${req.params.id}`, 404));
  }

  // Authorization check
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

// @desc    Get featured properties with agent mobile
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

// Error handling middleware for geocoding
exports.handleGeocoderError = (err, req, res, next) => {
  if (err.message.includes('Geocoding') || err.message.includes('Google Maps')) {
    return res.status(400).json({
      success: false,
      error: 'Could not process the provided address. Please check the address and try again.'
    });
  }
  next(err);
};