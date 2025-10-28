
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Property = require('../models/Property');
const User = require('../models/User');
const Developer = require('../models/Developer');
const geocoder = require('../utils/hybridGeocoder');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Helper function to calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

// Debug model imports
console.log('🔧 Property Controller - Model imports:', {
  Property: Property ? 'Loaded' : 'Failed',
  User: User ? 'Loaded' : 'Failed',
  Developer: Developer ? 'Loaded' : 'Failed'
});
console.log('🔧 Property model details:', {
  modelName: Property ? Property.modelName : 'N/A',
  schema: Property ? 'Schema loaded' : 'No schema',
  collection: Property ? Property.collection.name : 'N/A'
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// @desc    Get all properties with filtering
// @route   GET /api/v1/properties
// @access  Public
exports.getProperties = asyncHandler(async (req, res, next) => {
  try {
    // 1. Initial query setup
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search', 'minArea', 'maxArea', 'bedrooms', 'bathrooms'];
    excludedFields.forEach(el => delete queryObj[el]);
    
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    // 3. Parse the base query
    let query = Property.find(JSON.parse(queryStr));
    
    // 4. Handle bedrooms and bathrooms with >= operator
    if (req.query.bedrooms) {
      query = query.where('bedrooms').gte(Number(req.query.bedrooms));
    }
    if (req.query.bathrooms) {
      query = query.where('bathrooms').gte(Number(req.query.bathrooms));
    }

    // 5. Handle area filtering separately
    if (req.query.minArea || req.query.maxArea) {
      const areaFilter = {};
      if (req.query.minArea) areaFilter.$gte = Number(req.query.minArea);
      if (req.query.maxArea) areaFilter.$lte = Number(req.query.maxArea);
      query = query.where('area', areaFilter);
    }

    // 6. Handle search
    if (req.query.search) {
      query = query.or([
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { 'address.city': { $regex: req.query.search, $options: 'i' } },
        { 'address.state': { $regex: req.query.search, $options: 'i' } }
      ]);
    }

    // 7. Handle status filtering
    if (req.query.status) {
      const validStatuses = ['For Sale', 'For Rent', 'Sold', 'Rented'];
      if (!validStatuses.includes(req.query.status)) {
        return next(new ErrorResponse(`Invalid status value. Must be one of: ${validStatuses.join(', ')}`, 400));
      }
    }

    // 8. Populate related data
    query = query.populate('agent', 'name email phone')
                .populate('developer', 'name logo');

    // 9. Handle location-based sorting
    let userLocation = null;
    if (req.query.userLat && req.query.userLng) {
      userLocation = {
        type: 'Point',
        coordinates: [parseFloat(req.query.userLng), parseFloat(req.query.userLat)]
      };
    }

    // 10. Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else if (userLocation) {
      // Sort by distance if user location is provided
      query = query.sort({ 'location.coordinates': 1 });
    } else {
      query = query.sort('-createdAt');
    }

    // 11. Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 12. Pagination - need to count with the same filters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const skip = (page - 1) * limit;
    
    // Build count query with all filters
    let countQueryObj = { ...req.query };
    excludedFields.forEach(el => delete countQueryObj[el]);
    let countQueryStr = JSON.stringify(countQueryObj);
    countQueryStr = countQueryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    const countQuery = Property.find(JSON.parse(countQueryStr));
    
    // Apply the same filters to count
    if (req.query.bedrooms) countQuery.where('bedrooms').gte(Number(req.query.bedrooms));
    if (req.query.bathrooms) countQuery.where('bathrooms').gte(Number(req.query.bathrooms));
    if (req.query.search) {
      countQuery.or([
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { 'address.city': { $regex: req.query.search, $options: 'i' } },
        { 'address.state': { $regex: req.query.search, $options: 'i' } }
      ]);
    }
    if (req.query.minArea || req.query.maxArea) {
      const areaFilter = {};
      if (req.query.minArea) areaFilter.$gte = Number(req.query.minArea);
      if (req.query.maxArea) areaFilter.$lte = Number(req.query.maxArea);
      countQuery.where('area', areaFilter);
    }
    
    const total = await countQuery.countDocuments();

    query = query.skip(skip).limit(limit);

    // 13. Execute query
    const properties = await query;

    // 14. Calculate distances if user location is provided
    let propertiesWithDistance = properties;
    if (userLocation) {
      propertiesWithDistance = properties.map(property => {
        if (property.location && property.location.coordinates) {
          const distance = calculateDistance(
            userLocation.coordinates[1], // user lat
            userLocation.coordinates[0], // user lng
            property.location.coordinates[1], // property lat
            property.location.coordinates[0]  // property lng
          );
          return {
            ...property.toObject(),
            distance: Math.round(distance * 100) / 100 // Round to 2 decimal places
          };
        }
        return {
          ...property.toObject(),
          distance: null
        };
      });

      // Sort by distance if user location is provided and no explicit sort
      if (!req.query.sort) {
        propertiesWithDistance.sort((a, b) => {
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return a.distance - b.distance;
        });
      }
    }

    // 15. Send response
    res.status(200).json({
      success: true,
      count: propertiesWithDistance.length,
      pagination: {
        currentPage: page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalResults: total
      },
      userLocation: userLocation ? {
        latitude: userLocation.coordinates[1],
        longitude: userLocation.coordinates[0]
      } : null,
      data: propertiesWithDistance
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
  try {
    console.log('🏠 Getting property with ID:', req.params.id);
    console.log('🔧 Database state:', require('mongoose').connection.readyState);
    console.log('🔧 Request details:', {
      method: req.method,
      url: req.url,
      params: req.params,
      query: req.query,
      headers: req.headers
    });
    
    // Validate property ID format
    if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('❌ Invalid property ID format:', req.params.id);
      return next(new ErrorResponse('Invalid property ID format', 400));
    }
    
    // Find property and populate agent details
    console.log('🔍 Searching for property in database...');
    let property;
    try {
      console.log('🔧 Executing Property.findById with ID:', req.params.id);
      console.log('🔧 Property model available:', Property ? 'Yes' : 'No');
      console.log('🔧 Property model name:', Property ? Property.modelName : 'N/A');
      property = await Property.findById(req.params.id)
        .populate('agent', 'name email phone mobile')
        .populate('developer', 'name logo');
      console.log('🔧 Query executed successfully');
    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      console.error('❌ Database error details:', {
        message: dbError.message,
        name: dbError.name,
        code: dbError.code,
        stack: dbError.stack
      });
      return next(new ErrorResponse('Database error occurred', 500));
    }
    
    console.log('✅ Property found:', property ? 'Yes' : 'No');
    if (property) {
      console.log('🔧 Property details:', {
        id: property._id,
        title: property.title,
        agent: property.agent ? 'Populated' : 'Not populated',
        developer: property.developer ? 'Populated' : 'Not populated',
        type: property.type,
        status: property.status,
        price: property.price
      });
    }
    
    if (!property) {
      console.log('❌ Property not found with ID:', req.params.id);
      console.log('🔧 Database state when property not found:', require('mongoose').connection.readyState);
      return next(
        new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
      );
    }

  // Find similar properties within 20km radius
  let similarProperties = [];
  if (property.location?.coordinates && property.location.coordinates.length === 2) {
    console.log('🔍 Finding similar properties...');
    const radius = 80 / 6378.1; // Convert km to radians
    
    try {
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
      console.log('✅ Similar properties found:', similarProperties.length);
    } catch (similarError) {
      console.error('❌ Error finding similar properties:', similarError);
      similarProperties = [];
    }
    
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
    console.log('🔍 Tracking recently viewed property for user:', req.user.id);
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
          console.log('✅ Updated recently viewed property');
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
          console.log('✅ Added new recently viewed property');
        }
        
        await user.save();
        console.log('✅ User recently viewed updated');
      }
    } catch (err) {
      console.error('❌ Error tracking recently viewed property:', err);
      // Don't fail the request if tracking fails
    }
  }

  // Increment view count for the property
  try {
    property.views = (property.views || 0) + 1;
    await property.save();
    console.log('✅ View count incremented');
  } catch (err) {
    console.error('❌ Error incrementing property views:', err);
    // Don't fail the request if view count fails
  }

    console.log('📤 Sending response...');
    const responseData = { 
      success: true, 
      data: { 
        ...property.toObject(), 
        similarProperties 
      } 
    };
    console.log('🔧 Response data size:', JSON.stringify(responseData).length, 'bytes');
    console.log('🔧 Response data keys:', Object.keys(responseData.data));
    console.log('🔧 Property data keys:', Object.keys(property.toObject()));
    res.status(200).json(responseData);
  } catch (error) {
    console.error('❌ Error in getProperty:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    console.error('❌ Request details:', {
      id: req.params.id,
      method: req.method,
      url: req.url,
      headers: req.headers
    });
    console.error('❌ Database state:', require('mongoose').connection.readyState);
    console.error('❌ Property model available:', Property ? 'Yes' : 'No');
    return next(new ErrorResponse('Error fetching property details', 500));
  }
});


// @desc    Create new property
// @route   POST /api/v1/properties
// @access  Private (Agent/Admin)
exports.createProperty = asyncHandler(async (req, res, next) => {
  try {
    console.log('🏠 Creating property - received files:', {
      images: req.files?.images?.length || 0,
      floorPlans: req.files?.floorPlans?.length || 0,
      brochure: req.files?.brochure?.length || 0,
      virtualTour: req.files?.virtualTour?.length || 0,
      allFileFields: Object.keys(req.files || {})
    });

    // Add user to req.body as the agent
    req.body.agent = req.user.id;

    // Parse FormData fields that come as arrays/objects
    // Handle amenities array
    if (req.body.amenities) {
      if (typeof req.body.amenities === 'string') {
        req.body.amenities = req.body.amenities.split(',').map(a => a.trim()).filter(a => a);
      }
    } else {
      req.body.amenities = [];
    }

    // Handle highlights array
    if (req.body.highlights) {
      if (typeof req.body.highlights === 'string') {
        req.body.highlights = req.body.highlights.split(',').map(h => h.trim()).filter(h => h);
      }
    } else {
      req.body.highlights = [];
    }

    // Handle nearbyLocalities object
    if (!req.body.nearbyLocalities) {
      req.body.nearbyLocalities = {
        hasSchool: false,
        school: '',
        hasHospital: false,
        hospital: '',
        hasMall: false,
        mall: '',
        hasPark: false,
        park: '',
        hasTransport: false,
        transport: ''
      };
    }

    // Handle projectDetails object
    if (!req.body.projectDetails) {
      req.body.projectDetails = {
        projectArea: '',
        totalUnits: '',
        launchDate: null,
        reraId: '',
        configurations: ''
      };
    }

    // Handle approvals array
    if (!req.body.approvals) {
      req.body.approvals = [];
    }

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
    console.log('🏠 Processed images:', images.length);

    // Process floor plan images
    const floorPlanImages = req.files?.floorPlans?.length > 0
      ? await uploadImagesToCloudinary(req.files.floorPlans, 'properties/floor-plans')
      : [];
    console.log('🏠 Processed floor plans:', floorPlanImages.length);

    // Process brochure if uploaded
    let brochure = null;
    if (req.files?.brochure?.length > 0) {
      brochure = await uploadFileToCloudinary(req.files.brochure[0], 'properties/brochures');
    }
    console.log('🏠 Processed brochure:', brochure ? 'Yes' : 'No');

    // Process virtual tour if uploaded
    let virtualTour = null;
    if (req.files?.virtualTour?.length > 0) {
      virtualTour = await uploadVideoToCloudinary(req.files.virtualTour[0], 'properties/virtual-tours');
    }
    console.log('🏠 Processed virtual tour:', virtualTour ? 'Yes' : 'No');


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

    // Create property in database using safe pattern
    const property = new Property(propertyData);
    await property.save();

    // Try to geocode the address if provided
    if (req.body.address) {
      try {
        // First try with simplified address (city + state + country) for better success rate
        let addressString = [
          req.body.address.city,
          req.body.address.state,
          req.body.address.country || 'India'
        ].filter(Boolean).join(', ');

        console.log('🗺️ Attempting geocoding with simplified address:', addressString);
        let loc = await geocoder.geocode(addressString);
        
        // If simplified address fails, try with more details
        if (!loc || loc.length === 0) {
          console.log('🗺️ Simplified geocoding failed, trying with full address...');
          addressString = [
            req.body.address.line1,
            req.body.address.street,
            req.body.address.city,
            req.body.address.state,
            req.body.address.zipCode,
            req.body.address.country || 'India'
          ].filter(Boolean).join(', ');
          
          console.log('🗺️ Attempting geocoding with full address:', addressString);
          loc = await geocoder.geocode(addressString);
        }
        
        if (loc && loc.length > 0) {
          console.log('✅ Geocoding successful:', {
            coordinates: [loc[0].longitude, loc[0].latitude],
            formattedAddress: loc[0].formattedAddress
          });
          
          property.location = {
            type: 'Point',
            coordinates: [loc[0].longitude, loc[0].latitude],
            formattedAddress: loc[0].formattedAddress,
            street: loc[0].streetName || req.body.address.street,
            city: loc[0].city || req.body.address.city,
            state: loc[0].stateCode || req.body.address.state,
            zipCode: loc[0].zipcode || req.body.address.zipCode,
            country: loc[0].countryCode || req.body.address.country || 'India'
          };
          await property.save();
        } else {
          console.warn('⚠️ Geocoding failed - no results returned for address:', addressString);
        }
      } catch (err) {
        console.error('❌ Geocoding failed:', err.message);
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

  await Property.findByIdAndDelete(req.params.id);

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
const uploadImagesToCloudinary = async (files, folder = 'real-estate/properties') => {
  const images = [];
  
  for (const file of files) {
    try {
      if (!fs.existsSync(file.path)) {
        console.error('File does not exist:', file.path);
        continue;
      }

      const result = await cloudinary.uploader.upload(file.path, {
        folder: folder,
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

// Helper function to upload single file to Cloudinary
const uploadFileToCloudinary = async (file, folder = 'properties/documents') => {
  try {
    if (!fs.existsSync(file.path)) {
      console.error('File does not exist:', file.path);
      return null;
    }

    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: 'auto', // Auto-detect file type
      folder: `real-estate/${folder}`,
      quality: 'auto:good'
    });
    
    // Delete local file
    fs.unlinkSync(file.path);
    
    return result;
  } catch (err) {
    console.error('Error uploading file:', err);
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    throw err;
  }
};

// Helper function to upload single video to Cloudinary
const uploadVideoToCloudinary = async (file, folder = 'properties/videos') => {
  try {
    if (!fs.existsSync(file.path)) {
      console.error('File does not exist:', file.path);
      return null;
    }

    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: 'video',
      folder: `real-estate/${folder}`,
      quality: 'auto:good',
      chunk_size: 6000000
    });
    
    // Delete local file
    fs.unlinkSync(file.path);
    
    return result;
  } catch (err) {
    console.error('Error uploading video:', err);
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    throw err;
  }
};

// @desc    Get search suggestions and autocomplete
// @route   GET /api/v1/properties/search-suggestions
// @access  Public
exports.getSearchSuggestions = asyncHandler(async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(200).json({
        success: true,
        suggestions: []
      });
    }

    const searchRegex = new RegExp(q, 'i');

    // Get unique suggestions from multiple fields
    const suggestions = await Property.aggregate([
      {
        $match: {
          $or: [
            { 'address.city': searchRegex },
            { 'address.state': searchRegex },
            { type: searchRegex },
            { title: searchRegex },
            { amenities: searchRegex }
          ]
        }
      },
      {
        $project: {
          city: '$address.city',
          state: '$address.state',
          type: '$type',
          amenities: '$amenities'
        }
      },
      {
        $group: {
          _id: null,
          cities: { $addToSet: '$city' },
          states: { $addToSet: '$state' },
          types: { $addToSet: '$type' },
          allAmenities: { $push: '$amenities' }
        }
      },
      {
        $project: {
          all: {
            $concatArrays: [
              { $filter: { input: '$cities', as: 'city', cond: { $ne: ['$$city', null] } } },
              { $filter: { input: '$states', as: 'state', cond: { $ne: ['$$state', null] } } },
              { $filter: { input: '$types', as: 'type', cond: { $ne: ['$$type', null] } } },
              { $reduce: { input: '$allAmenities', initialValue: [], in: { $concatArrays: ['$$value', { $filter: { input: '$$this', as: 'am', cond: { $ne: ['$$am', null] } } }] } } }
            ]
          }
        }
      },
      {
        $project: {
          suggestions: {
            $slice: ['$all', parseInt(limit)]
          }
        }
      }
    ]);

    const flatSuggestions = suggestions[0]?.suggestions || [];
    
    res.status(200).json({
      success: true,
      suggestions: flatSuggestions
    });
  } catch (error) {
    console.error('Error getting search suggestions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get search suggestions'
    });
  }
});

