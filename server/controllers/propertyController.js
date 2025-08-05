
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Property = require('../models/Property');
const User = require('../models/User');
const Developer = require('../models/Developer');
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

// @desc    Get all properties with filtering, sorting, and pagination
// @route   GET /api/v1/properties
// @access  Public
exports.getProperties = asyncHandler(async (req, res, next) => {
  try {
    // 1. FILTERING
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 1a. Handle special numeric filters
    const numericFilters = ['price', 'area', 'bedrooms', 'bathrooms'];
    let queryStr = JSON.stringify(queryObj);
    
    // Convert query operators (gt, gte, etc)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    // 1b. Handle area filtering separately
    if (req.query.minArea || req.query.maxArea) {
      const areaQuery = JSON.parse(queryStr).area || {};
      if (req.query.minArea) areaQuery.$gte = Number(req.query.minArea);
      if (req.query.maxArea) areaQuery.$lte = Number(req.query.maxArea);
      queryStr = JSON.stringify({ ...JSON.parse(queryStr), area: areaQuery });
    }

    // 1c. Handle search
    if (req.query.search) {
      const searchQuery = {
        $or: [
          { title: { $regex: req.query.search, $options: 'i' } },
          { description: { $regex: req.query.search, $options: 'i' } },
          { 'address.city': { $regex: req.query.search, $options: 'i' } },
          { 'address.state': { $regex: req.query.search, $options: 'i' } }
        ]
      };
      queryStr = JSON.stringify({ ...JSON.parse(queryStr), ...searchQuery });
    }

    // 1d. Handle status filtering
    if (req.query.status) {
      const validStatuses = ['For Sale', 'For Rent', 'Sold', 'Rented'];
      if (!validStatuses.includes(req.query.status)) {
        return next(new ErrorResponse(`Invalid status value. Must be one of: ${validStatuses.join(', ')}`, 400));
      }
    }

    // 2. BUILD QUERY
    let query = Property.find(JSON.parse(queryStr))
      .populate('agent', 'name email phone')
      .populate('developer', 'name logo');

    // 3. SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt'); // Default sort
    }

    // 4. FIELD LIMITING (Projection)
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v'); // Exclude version key by default
    }

    // 5. PAGINATION
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const skip = (page - 1) * limit;
    const total = await Property.countDocuments(JSON.parse(queryStr));

    query = query.skip(skip).limit(limit);

    // 6. EXECUTE QUERY
    const properties = await query;

    // 7. SEND RESPONSE
    res.status(200).json({
      success: true,
      count: properties.length,
      pagination: {
        currentPage: page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalResults: total
      },
      data: properties
    });

  } catch (err) {
    next(err);
  }
});

// @desc    Get featured properties
// @route   GET /api/v1/properties/agent/:agentId
// @access  Public
exports.getAgentProperties = asyncHandler(async (req, res, next) => {
  console.log('GET /api/v1/properties/agent',req.params.id);
  console.log('GET /api/v1/properties/agent', req.params);
  console.log('User ID:', req.params.id);
  console.error('User ID:', req.params.id);
  const userid = req.params.id;
  const properties = await Property.find({ agent: userid }).populate('agent');
  res.status(200).json({
    success: true,
    count: properties.length,
    data: properties
  });
});


// @desc    Get single property
// @route   GET /api/v1/properties/:id
// @access  Public
exports.getProperty = asyncHandler(async (req, res, next) => {
  // Find property and populate agent details
  const property = await Property.findById(req.params.id)
    .populate('agent', 'name email phone mobile');
  
  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }

  // Find similar properties within 20km radius
  let similarProperties = [];
  if (property.location?.coordinates && property.location.coordinates.length === 2) {
    const radius = 80 / 6378.1; // Convert km to radians
    
    similarProperties = await Property.find({
      _id: { $ne: property._id }, // Exclude current property
      location: {
        $geoWithin: { 
          $centerSphere: [
            property.location.coordinates, 
            radius
          ] 
        }
      },
      // type: property.type, // Same property type
      // bedrooms: property.bedrooms, // Same number of bedrooms
      // status: property.status // Same status (For Sale/For Rent)
    })
    .limit(3) // Limit to 3 similar properties
    .select('title price bedrooms bathrooms area type images address status')
    .lean(); // Convert to plain JS object
    
    // Calculate distance for each similar property
    similarProperties = similarProperties.map(similarProp => {
      if (similarProp.location?.coordinates) {
        const distance = calculateDistance(
          property.location.coordinates[1],
          property.location.coordinates[0],
          similarProp.location.coordinates[1],
          similarProp.location.coordinates[0]
        );
        return { ...similarProp, distance };
      }
      return similarProp;
    });
  }

  // If user is authenticated, track this view in their recently viewed
  if (req.user) {
    try {
      const user = await User.findById(req.user.id);
      
      if (user) {
        // Check if property already in recently viewed
        const existingIndex = user.recentlyViewed.findIndex(
          item => item.property.toString() === req.params.id
        );
        
        if (existingIndex !== -1) {
          // Update viewedAt if already exists
          user.recentlyViewed[existingIndex].viewedAt = Date.now();
        } else {
          // Add new entry
          user.recentlyViewed.push({
            property: req.params.id,
            viewedAt: Date.now()
          });
          
          // Keep only last 10 viewed properties (remove oldest if over limit)
          if (user.recentlyViewed.length > 10) {
            user.recentlyViewed.shift(); // Remove the oldest item
          }
        }
        
        await user.save();
      }
    } catch (err) {
      console.error('Error tracking recently viewed property:', err);
      // Don't fail the request if tracking fails
    }
  }

  // Increment view count for the property
  try {
    property.views = (property.views || 0) + 1;
    await property.save();
  } catch (err) {
    console.error('Error incrementing property views:', err);
    // Don't fail the request if view count fails
  }

  res.status(200).json({ 
    success: true, 
    data: {
      ...property.toObject(),
      similarProperties
    }
  });
});

// Helper function to calculate distance between two coordinates in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

// @desc    Create new property
// @route   POST /api/v1/properties
// @access  Private (Agent/Admin)
exports.createProperty = asyncHandler(async (req, res, next) => {
  try {
    // Add user to req.body as the agent
    req.body.agent = req.user.id;

    // Check if developer exists if provided
    if (req.body.developer) {
      const developer = await Developer.findById(req.body.developer);
      if (!developer) {
        return next(new ErrorResponse(`Developer not found with id of ${req.body.developer}`, 404));
      }
    }

    // Process main images
    const images = req.files?.images?.length > 0 
      ? await uploadImagesToCloudinary(req.files.images, 'properties')
      : [];

    // Process floor plan images
    const floorPlanImages = req.files?.floorPlans?.length > 0
      ? await uploadImagesToCloudinary(req.files.floorPlans, 'properties/floor-plans')
      : [];

    // Process brochure if uploaded
    let brochure = null;
    if (req.files?.brochure?.length > 0) {
      brochure = await uploadFileToCloudinary(req.files.brochure[0], 'properties/brochures');
    }

    // Process virtual tour if uploaded
    let virtualTour = null;
    if (req.files?.virtualTour?.length > 0) {
      virtualTour = await uploadVideoToCloudinary(req.files.virtualTour[0], 'properties/virtual-tours');
    }

    // Parse amenities if sent as string
    if (req.body.amenities && typeof req.body.amenities === 'string') {
      req.body.amenities = req.body.amenities.split(',');
    }

    // Parse highlights if sent as string
    if (req.body.highlights && typeof req.body.highlights === 'string') {
      req.body.highlights = req.body.highlights.split(',');
    }

    // Parse nearbyLocalities if sent as string
    if (req.body.nearbyLocalities && typeof req.body.nearbyLocalities === 'string') {
      try {
        req.body.nearbyLocalities = JSON.parse(req.body.nearbyLocalities);
      } catch (err) {
        return next(new ErrorResponse('Invalid nearby localities format', 400));
      }
    }

    // Parse projectDetails if sent as string
    if (req.body.projectDetails && typeof req.body.projectDetails === 'string') {
      try {
        req.body.projectDetails = JSON.parse(req.body.projectDetails);
      } catch (err) {
        return next(new ErrorResponse('Invalid project details format', 400));
      }
    }

    // Parse approvals if sent as string
    if (req.body.approvals && typeof req.body.approvals === 'string') {
      try {
        req.body.approvals = JSON.parse(req.body.approvals);
      } catch (err) {
        return next(new ErrorResponse('Invalid approvals format', 400));
      }
    }

    // Convert possession date to Date object if provided
    if (req.body.possessionDate) {
      req.body.possessionDate = new Date(req.body.possessionDate);
    }

    // Create property with default location
    const propertyData = {
      ...req.body,
      images,
      floorPlanImages,
      brochure: brochure ? {
        url: brochure.secure_url,
        publicId: brochure.public_id
      } : null,
      virtualTour: virtualTour ? {
        url: virtualTour.secure_url,
        type: 'video' // Default type, can be changed based on file analysis
      } : null,
      location: {
        type: 'Point',
        coordinates: [0, 0], // Default coordinates
        formattedAddress: '',
        street: req.body.address?.street || '',
        city: req.body.address?.city || '',
        state: req.body.address?.state || '',
        zipCode: req.body.address?.zipCode || '',
        country: req.body.address?.country || 'India'
      }
    };

    // Create property in database
    const property = await Property.create(propertyData);

    // Try to geocode the address if provided
    if (req.body.address) {
      try {
        const addressString = [
          req.body.address.line1,
          req.body.address.street,
          req.body.address.city,
          req.body.address.state,
          req.body.address.zipCode,
          req.body.address.country
        ].filter(Boolean).join(', ');

        const loc = await geocoder.geocode(addressString);
        
        if (loc && loc.length > 0) {
          property.location = {
            type: 'Point',
            coordinates: [loc[0].longitude, loc[0].latitude],
            formattedAddress: loc[0].formattedAddress,
            street: loc[0].streetName || req.body.address.street,
            city: loc[0].city || req.body.address.city,
            state: loc[0].stateCode || req.body.address.state,
            zipCode: loc[0].zipcode || req.body.address.zipCode,
            country: loc[0].countryCode || req.body.address.country
          };
          await property.save();
        }
      } catch (err) {
        console.error('Geocoding failed:', err);
        // Continue even if geocoding fails
      }
    }

    // Populate developer information in response
    await property.populate('developer', 'name logo website');
    await property.populate('agent', 'name email phone');

    res.status(201).json({ 
      success: true, 
      data: property 
    });
  } catch (err) {
    // Clean up uploaded files if error occurs
    if (req.files) {
      for (const field in req.files) {
        for (const file of req.files[field]) {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        }
      }
    }
    next(err);
  }
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

