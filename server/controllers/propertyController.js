
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Property = require('../models/Property');
const User = require('../models/User');
const Developer = require('../models/Developer');
const UserInteraction = require('../models/UserInteraction');
const RecommendationService = require('../services/RecommendationService');
const TravelTimeService = require('../services/TravelTimeService');
const SearchRankingService = require('../services/SearchRankingService');
const SearchAnalyticsService = require('../services/SearchAnalyticsService');
const SearchPersonalizationService = require('../services/SearchPersonalizationService');
const { parseNaturalLanguageQuery, isNaturalLanguageQuery } = require('../utils/naturalLanguageParser');
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
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search', 'minArea', 'maxArea', 'bedrooms', 'bathrooms', 
      'constructionStatus', 'furnished', 'facing', 'floorRangeMin', 'floorRangeMax', 'parkingSpaces', 'verified',
      'nearSchools', 'nearHospitals', 'nearMalls', 'nearMetro', 'nearParks', 'hasVirtualTour', 'developer',
      'maxCommuteTime', 'commuteMode', 'affordable', 'monthlyIncome', 'possessionDate', 'ageOfProperty'];
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

    // 6. Handle search with natural language parsing
    let parsedFilters = {};
    if (req.query.search) {
      // Parse natural language query if it appears to be one
      if (isNaturalLanguageQuery(req.query.search)) {
        parsedFilters = parseNaturalLanguageQuery(req.query.search);
        // Merge parsed filters with existing query params (parsed filters take precedence)
        if (parsedFilters.bedrooms && !req.query.bedrooms) {
          req.query.bedrooms = parsedFilters.bedrooms;
        }
        if (parsedFilters.propertyType && !req.query.propertyType) {
          req.query.propertyType = parsedFilters.propertyType;
        }
        if (parsedFilters.priceMin && !req.query.priceMin) {
          req.query.priceMin = parsedFilters.priceMin;
        }
        if (parsedFilters.priceMax && !req.query.priceMax) {
          req.query.priceMax = parsedFilters.priceMax;
        }
        if (parsedFilters.city && !req.query.city) {
          req.query.city = parsedFilters.city;
        }
        if (parsedFilters.state && !req.query.state) {
          req.query.state = parsedFilters.state;
        }
      }

      // Enhanced search with more fields
      query = query.or([
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { 'address.city': { $regex: req.query.search, $options: 'i' } },
        { 'address.state': { $regex: req.query.search, $options: 'i' } },
        { 'address.locality': { $regex: req.query.search, $options: 'i' } },
        { buildingName: { $regex: req.query.search, $options: 'i' } },
        { type: { $regex: req.query.search, $options: 'i' } }
      ]);
    }

    // 7. Handle status filtering
    if (req.query.status) {
      const validStatuses = ['For Sale', 'For Rent', 'Sold', 'Rented'];
      if (!validStatuses.includes(req.query.status)) {
        return next(new ErrorResponse(`Invalid status value. Must be one of: ${validStatuses.join(', ')}`, 400));
      }
    }

    // 8. Handle construction status (array)
    if (req.query.constructionStatus) {
      const statusArray = Array.isArray(req.query.constructionStatus) 
        ? req.query.constructionStatus 
        : req.query.constructionStatus.split(',');
      query = query.where('constructionStatus').in(statusArray);
    }

    // 9. Handle furnished filter
    if (req.query.furnished !== undefined) {
      query = query.where('furnished').equals(req.query.furnished === 'true' || req.query.furnished === true);
    }

    // 10. Handle facing filter
    if (req.query.facing) {
      query = query.where('facing').equals(req.query.facing);
    }

    // 11. Handle floor range filter
    if (req.query.floorRangeMin || req.query.floorRangeMax) {
      const floorFilter = {};
      if (req.query.floorRangeMin) floorFilter['floorRange.min'] = { $gte: Number(req.query.floorRangeMin) };
      if (req.query.floorRangeMax) floorFilter['floorRange.max'] = { $lte: Number(req.query.floorRangeMax) };
      if (Object.keys(floorFilter).length > 0) {
        query = query.where(floorFilter);
      }
    }

    // 12. Handle parking spaces filter
    if (req.query.parkingSpaces) {
      query = query.where('parkingSpaces').gte(Number(req.query.parkingSpaces));
    }

    // 13. Handle verified filter
    if (req.query.verified !== undefined) {
      query = query.where('verified').equals(req.query.verified === 'true' || req.query.verified === true);
    }

    // 14. Handle virtual tour filter
    if (req.query.hasVirtualTour === 'true' || req.query.hasVirtualTour === true) {
      query = query.where('virtualTour').exists(true).ne(null);
    }

    // 15. Handle developer filter
    if (req.query.developer) {
      query = query.where('developer').equals(req.query.developer);
    }

    // 16. Handle proximity filters (using nearbyLocalities field)
    if (req.query.nearSchools === 'true' || req.query.nearSchools === true) {
      query = query.where('nearbyLocalities.hasSchool').equals(true);
    }
    if (req.query.nearHospitals === 'true' || req.query.nearHospitals === true) {
      query = query.where('nearbyLocalities.hasHospital').equals(true);
    }
    if (req.query.nearMalls === 'true' || req.query.nearMalls === true) {
      query = query.where('nearbyLocalities.hasMall').equals(true);
    }
    if (req.query.nearMetro === 'true' || req.query.nearMetro === true) {
      query = query.where('nearbyLocalities.hasTransport').equals(true);
    }
    if (req.query.nearParks === 'true' || req.query.nearParks === true) {
      query = query.where('nearbyLocalities.hasPark').equals(true);
    }

    // 17. Handle possession date filter
    if (req.query.possessionDate) {
      const targetDate = new Date(req.query.possessionDate);
      query = query.where('possessionDate').lte(targetDate);
    }

    // 18. Handle age of property filter
    if (req.query.ageOfProperty) {
      query = query.where('ageOfProperty').lte(Number(req.query.ageOfProperty));
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

    // 10. Sorting - check if relevance sorting is requested
    const useRelevanceSorting = req.query.sort === 'relevance' || 
                                (req.query.search && !req.query.sort && !userLocation);
    
    if (req.query.sort && req.query.sort !== 'relevance') {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else if (userLocation && !useRelevanceSorting) {
      // Sort by distance if user location is provided
      query = query.sort({ 'location.coordinates': 1 });
    } else if (!useRelevanceSorting) {
      query = query.sort('-createdAt');
    }
    // If relevance sorting, we'll sort after fetching results

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
        { 'address.state': { $regex: req.query.search, $options: 'i' } },
        { 'address.locality': { $regex: req.query.search, $options: 'i' } },
        { buildingName: { $regex: req.query.search, $options: 'i' } },
        { type: { $regex: req.query.search, $options: 'i' } }
      ]);
    }
    if (req.query.minArea || req.query.maxArea) {
      const areaFilter = {};
      if (req.query.minArea) areaFilter.$gte = Number(req.query.minArea);
      if (req.query.maxArea) areaFilter.$lte = Number(req.query.maxArea);
      countQuery.where('area', areaFilter);
    }
    // Apply new filters to count query
    if (req.query.constructionStatus) {
      const statusArray = Array.isArray(req.query.constructionStatus) 
        ? req.query.constructionStatus 
        : req.query.constructionStatus.split(',');
      countQuery.where('constructionStatus').in(statusArray);
    }
    if (req.query.furnished !== undefined) {
      countQuery.where('furnished').equals(req.query.furnished === 'true' || req.query.furnished === true);
    }
    if (req.query.facing) {
      countQuery.where('facing').equals(req.query.facing);
    }
    if (req.query.floorRangeMin || req.query.floorRangeMax) {
      const floorFilter = {};
      if (req.query.floorRangeMin) floorFilter['floorRange.min'] = { $gte: Number(req.query.floorRangeMin) };
      if (req.query.floorRangeMax) floorFilter['floorRange.max'] = { $lte: Number(req.query.floorRangeMax) };
      if (Object.keys(floorFilter).length > 0) {
        countQuery.where(floorFilter);
      }
    }
    if (req.query.parkingSpaces) {
      countQuery.where('parkingSpaces').gte(Number(req.query.parkingSpaces));
    }
    if (req.query.verified !== undefined) {
      countQuery.where('verified').equals(req.query.verified === 'true' || req.query.verified === true);
    }
    if (req.query.hasVirtualTour === 'true' || req.query.hasVirtualTour === true) {
      countQuery.where('virtualTour').exists(true).ne(null);
    }
    if (req.query.developer) {
      countQuery.where('developer').equals(req.query.developer);
    }
    if (req.query.nearSchools === 'true' || req.query.nearSchools === true) {
      countQuery.where('nearbyLocalities.hasSchool').equals(true);
    }
    if (req.query.nearHospitals === 'true' || req.query.nearHospitals === true) {
      countQuery.where('nearbyLocalities.hasHospital').equals(true);
    }
    if (req.query.nearMalls === 'true' || req.query.nearMalls === true) {
      countQuery.where('nearbyLocalities.hasMall').equals(true);
    }
    if (req.query.nearMetro === 'true' || req.query.nearMetro === true) {
      countQuery.where('nearbyLocalities.hasTransport').equals(true);
    }
    if (req.query.nearParks === 'true' || req.query.nearParks === true) {
      countQuery.where('nearbyLocalities.hasPark').equals(true);
    }
    if (req.query.possessionDate) {
      const targetDate = new Date(req.query.possessionDate);
      countQuery.where('possessionDate').lte(targetDate);
    }
    if (req.query.ageOfProperty) {
      countQuery.where('ageOfProperty').lte(Number(req.query.ageOfProperty));
    }
    
    const total = await countQuery.countDocuments();

    // For relevance sorting, we need to fetch more results to rank them properly
    const fetchLimit = useRelevanceSorting ? Math.min(limit * 3, 100) : limit;
    query = query.skip(skip).limit(fetchLimit);

    // 13. Execute query
    let properties = await query;

    // 13a. Apply relevance scoring and ranking if needed
    if (useRelevanceSorting && properties.length > 0) {
      const searchParams = {
        searchQuery: req.query.search || '',
        priceMin: req.query.priceMin ? parseFloat(req.query.priceMin) : null,
        priceMax: req.query.priceMax ? parseFloat(req.query.priceMax) : null,
        city: req.query.city || parsedFilters.city || null,
        state: req.query.state || parsedFilters.state || null,
        userLocation: userLocation ? {
          coordinates: userLocation.coordinates
        } : null,
        bedrooms: req.query.bedrooms || parsedFilters.bedrooms || null,
        bathrooms: req.query.bathrooms || null,
        propertyType: req.query.propertyType || parsedFilters.propertyType || null
      };

      // Rank properties by relevance
      properties = SearchRankingService.rankProperties(properties, searchParams);

      // Apply personalization if user is logged in
      if (req.user && req.user.id) {
        properties = await SearchPersonalizationService.personalizeResults(
          properties,
          req.user.id
        );
      }

      // Limit to requested page size after ranking
      properties = properties.slice(0, limit);
    }

    // 14. Calculate distances and travel times if user location is provided
    let propertiesWithDistance = properties;
    if (userLocation) {
      // Get user work location if available and commute filter is requested
      let userWorkLocation = null;
      if (req.user && req.query.maxCommuteTime) {
        const user = await User.findById(req.user.id).select('workLocation');
        if (user?.workLocation?.coordinates?.length === 2) {
          userWorkLocation = {
            lat: user.workLocation.coordinates[1],
            lng: user.workLocation.coordinates[0]
          };
        }
      }

      const commuteMode = req.query.commuteMode || 'driving';
      const maxCommuteTime = req.query.maxCommuteTime ? Number(req.query.maxCommuteTime) : null;

      propertiesWithDistance = await Promise.all(properties.map(async (property) => {
        const propertyObj = property.toObject();
        
        if (property.location && property.location.coordinates) {
          // Calculate straight-line distance
          const distance = calculateDistance(
            userLocation.coordinates[1], // user lat
            userLocation.coordinates[0], // user lng
            property.location.coordinates[1], // property lat
            property.location.coordinates[0]  // property lng
          );
          propertyObj.distance = Math.round(distance * 100) / 100;

          // Calculate travel time if work location is available
          if (userWorkLocation) {
            try {
              const travelTime = await TravelTimeService.calculateTravelTime(
                userWorkLocation.lat,
                userWorkLocation.lng,
                property.location.coordinates[1],
                property.location.coordinates[0],
                commuteMode
              );
              propertyObj.commuteTime = Math.round(travelTime.duration);
              propertyObj.commuteDistance = Math.round(travelTime.distance * 100) / 100;
              propertyObj.commuteMode = commuteMode;
            } catch (error) {
              console.error('Error calculating travel time:', error);
              propertyObj.commuteTime = null;
            }
          }
        } else {
          propertyObj.distance = null;
          propertyObj.commuteTime = null;
        }

        return propertyObj;
      }));

      // Filter by commute time if specified
      if (maxCommuteTime !== null && userWorkLocation) {
        propertiesWithDistance = propertiesWithDistance.filter(property => 
          property.commuteTime !== null && property.commuteTime <= maxCommuteTime
        );
      }

      // Sort by distance or commute time if user location is provided and no explicit sort
      if (!req.query.sort) {
        propertiesWithDistance.sort((a, b) => {
          // Prefer commute time if available, otherwise use distance
          if (a.commuteTime !== null && b.commuteTime !== null) {
            return a.commuteTime - b.commuteTime;
          }
          if (a.commuteTime !== null) return -1;
          if (b.commuteTime !== null) return 1;
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return a.distance - b.distance;
        });
      }
    }

    // 15. Log search analytics (async, don't wait)
    if (req.query.search || Object.keys(req.query).length > 0) {
      const sessionId = req.headers['x-session-id'] || 
                       req.cookies?.sessionId || 
                       SearchAnalyticsService.generateSessionId();
      
      SearchAnalyticsService.logSearch({
        query: req.query.search || '',
        userId: req.user?.id || null,
        sessionId,
        resultsCount: propertiesWithDistance.length,
        filters: {
          ...req.query,
          parsedFilters
        },
        userAgent: req.headers['user-agent'] || '',
        ipAddress: req.ip || req.connection.remoteAddress || ''
      }).catch(err => {
        console.error('Error logging search analytics:', err);
      });
    }

    // 16. Send response
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
      searchMetadata: req.query.search ? {
        originalQuery: req.query.search,
        parsedFilters: Object.keys(parsedFilters).length > 0 ? parsedFilters : null,
        isNaturalLanguage: isNaturalLanguageQuery(req.query.search),
        sortedBy: useRelevanceSorting ? 'relevance' : (req.query.sort || 'default')
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
    // Handle both /:id and /slug/:slug routes
    const identifier = req.params.slug || req.params.id;
    
    console.log('🏠 Getting property with ID/Slug:', identifier);
    console.log('🔧 Database state:', require('mongoose').connection.readyState);
    console.log('🔧 Request details:', {
      method: req.method,
      url: req.url,
      params: req.params,
      query: req.query,
      headers: req.headers
    });
    
    // Check if it's a MongoDB ObjectId or a slug
    const isObjectId = identifier && identifier.match(/^[0-9a-fA-F]{24}$/);
    
    // Find property and populate agent details
    console.log('🔍 Searching for property in database...');
    let property;
    try {
      if (isObjectId) {
        // It's an ObjectId, find by ID
        console.log('🔧 Executing Property.findById with ID:', identifier);
        property = await Property.findById(identifier)
          .populate('agent', 'name email phone mobile')
          .populate('developer', 'name logo');
      } else {
        // It's a slug, find by slug
        console.log('🔧 Executing Property.findOne with slug:', identifier);
        property = await Property.findOne({ slug: identifier })
          .populate('agent', 'name email phone mobile')
          .populate('developer', 'name logo');
        
        // If not found by slug, try by title (for backward compatibility)
        if (!property) {
          console.log('🔧 Property not found by slug, trying by title...');
          const titleSlug = identifier.replace(/-/g, ' ');
          property = await Property.findOne({ 
            $or: [
              { title: { $regex: new RegExp(titleSlug, 'i') } },
              { buildingName: { $regex: new RegExp(titleSlug, 'i') } }
            ]
          })
          .populate('agent', 'name email phone mobile')
          .populate('developer', 'name logo');
        }
      }
      
      console.log('🔧 Property model available:', Property ? 'Yes' : 'No');
      console.log('🔧 Property model name:', Property ? Property.modelName : 'N/A');
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

    // Process brochure - URL only
    let brochure = null;
    
    // Check if brochure URL is provided in req.body
    if (req.body.brochureUrl) {
      try {
        const url = String(req.body.brochureUrl).trim();
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
          // Extract filename from URL if possible
          let name = 'Brochure';
          try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const filename = pathname.split('/').pop() || 'Brochure';
            name = filename.split('?')[0]; // Remove query params
          } catch (e) {
            // If URL parsing fails, use default name
          }
          
          brochure = {
            url: url,
            publicId: req.body.brochurePublicId || '', // Optional
            name: name
          };
          console.log('🏠 Processed brochure URL:', url);
        }
      } catch (error) {
        console.error('Error processing brochure URL:', error);
      }
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
  if (req.files?.images?.length > 0) {
    newImages = await uploadImagesToCloudinary(req.files.images, 'properties');
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

  // Process new floor plan images
  let newFloorPlanImages = [];
  if (req.files?.floorPlans?.length > 0) {
    newFloorPlanImages = await uploadImagesToCloudinary(req.files.floorPlans, 'properties/floor-plans');
  }

  // Process existing floor plan images
  let existingFloorPlanImages = [];
  if (req.body.existingFloorPlans) {
    try {
      existingFloorPlanImages = JSON.parse(req.body.existingFloorPlans);
    } catch (err) {
      return next(new ErrorResponse('Invalid existing floor plans data', 400));
    }
  }

  // Process brochure - URL only
  let brochure = null;
  
  // Check if brochure URL is provided in req.body
  if (req.body.brochureUrl) {
    try {
      const url = String(req.body.brochureUrl).trim();
      if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
        // Extract filename from URL if possible
        let name = 'Brochure';
        try {
          const urlObj = new URL(url);
          const pathname = urlObj.pathname;
          const filename = pathname.split('/').pop() || 'Brochure';
          name = filename.split('?')[0]; // Remove query params
        } catch (e) {
          // If URL parsing fails, use default name
        }
        
        brochure = {
          url: url,
          publicId: req.body.brochurePublicId || '', // Optional
          name: name
        };
      }
    } catch (error) {
      console.error('Error processing brochure URL:', error);
    }
  }

  // Process virtual tour if uploaded
  let virtualTour = null;
  if (req.files?.virtualTour?.length > 0) {
    virtualTour = await uploadVideoToCloudinary(req.files.virtualTour[0], 'properties/virtual-tours');
  }

  // Prepare update data
  const updateData = {
    ...req.body,
    images: [...existingImages, ...newImages],
    floorPlanImages: [...existingFloorPlanImages, ...newFloorPlanImages]
  };
  
  // Add brochure if provided
  if (brochure) {
    updateData.brochure = brochure;
  }

  // Add virtual tour if provided
  if (virtualTour) {
    updateData.virtualTour = {
      url: virtualTour.secure_url,
      type: 'video' // Default type, can be changed based on file analysis
    };
  }
  
  // Remove brochureUrl and brochurePublicId from update data (they're not part of the schema)
  delete updateData.brochureUrl;
  delete updateData.brochurePublicId;
  delete updateData.existingImages;
  delete updateData.existingFloorPlans;

  // Update property
  property = await Property.findByIdAndUpdate(req.params.id, updateData, {
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

  // Calc radius using radians (distance in km, convert to radians)
  // Earth radius in km = 6371
  const radiusInKm = parseFloat(distance);
  const radius = radiusInKm / 6371;

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

// @desc    Get properties near a location (lat/lng) within radius
// @route   GET /api/v1/properties/nearby
// @access  Public
exports.getPropertiesNearby = asyncHandler(async (req, res, next) => {
  try {
    const { lat, lng, radius = 5, ...otherFilters } = req.query;

    if (!lat || !lng) {
      return next(new ErrorResponse('Latitude and longitude are required', 400));
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusInKm = parseFloat(radius);
    
    // Convert km to radians (Earth radius = 6371 km)
    const radiusInRadians = radiusInKm / 6371;

    // Build base query with other filters
    const query = Property.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radiusInRadians]
        }
      }
    });

    // Apply additional filters
    if (otherFilters.type) {
      query.where('type').equals(otherFilters.type);
    }
    if (otherFilters.status) {
      query.where('status').equals(otherFilters.status);
    }
    if (otherFilters.minPrice) {
      query.where('price').gte(Number(otherFilters.minPrice));
    }
    if (otherFilters.maxPrice) {
      query.where('price').lte(Number(otherFilters.maxPrice));
    }
    if (otherFilters.bedrooms) {
      query.where('bedrooms').gte(Number(otherFilters.bedrooms));
    }
    if (otherFilters.bathrooms) {
      query.where('bathrooms').gte(Number(otherFilters.bathrooms));
    }

    // Use $geoNear for distance calculation and sorting
    const properties = await Property.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          distanceField: 'distance',
          distanceMultiplier: 1, // Convert radians to km
          maxDistance: radiusInRadians,
          spherical: true,
          query: {
            ...(otherFilters.type && { type: otherFilters.type }),
            ...(otherFilters.status && { status: otherFilters.status }),
            ...(otherFilters.minPrice && { price: { $gte: Number(otherFilters.minPrice) } }),
            ...(otherFilters.maxPrice && { price: { $lte: Number(otherFilters.maxPrice) } }),
            ...(otherFilters.bedrooms && { bedrooms: { $gte: Number(otherFilters.bedrooms) } }),
            ...(otherFilters.bathrooms && { bathrooms: { $gte: Number(otherFilters.bathrooms) } })
          }
        }
      },
      {
        $limit: parseInt(otherFilters.limit) || 50
      }
    ]);

    // Populate agent and developer
    await Property.populate(properties, [
      { path: 'agent', select: 'name email phone mobile' },
      { path: 'developer', select: 'name logo' }
    ]);

    res.status(200).json({
      success: true,
      count: properties.length,
      center: { latitude, longitude },
      radius: radiusInKm,
      data: properties
    });
  } catch (err) {
    next(err);
  }
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

// @desc    Get property recommendations
// @route   GET /api/v1/properties/recommendations
// @access  Private
exports.getRecommendations = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(new ErrorResponse('User authentication required', 401));
    }

    const {
      limit = 10,
      type = 'hybrid', // 'collaborative', 'content', 'hybrid', 'trending', 'similar'
      propertyId, // For similar properties
      exclude = []
    } = req.query;

    let recommendations = [];

    if (type === 'similar' && propertyId) {
      // Get similar properties to a specific property
      const property = await Property.findById(propertyId);
      if (!property) {
        return next(new ErrorResponse('Property not found', 404));
      }

      recommendations = await Property.find({
        _id: { $ne: propertyId, $nin: exclude },
        type: property.type,
        status: { $in: ['For Sale', 'For Rent'] },
        location: {
          $geoWithin: {
            $centerSphere: [
              property.location.coordinates,
              10 / 6371 // 10km radius
            ]
          }
        }
      })
        .populate('agent', 'name email phone')
        .populate('developer', 'name logo')
        .limit(parseInt(limit))
        .lean();

      recommendations = recommendations.map(rec => ({
        ...rec,
        relevanceScore: 0.8,
        reasoning: `Similar ${property.type} in the same area`
      }));
    } else if (type === 'trending') {
      recommendations = await RecommendationService.getTrendingProperties(
        parseInt(limit),
        exclude
      );
    } else {
      recommendations = await RecommendationService.getPersonalizedRecommendations(
        userId,
        {
          limit: parseInt(limit),
          excludeProperties: exclude,
          type
        }
      );
    }

    res.status(200).json({
      success: true,
      count: recommendations.length,
      type,
      data: recommendations
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    next(error);
  }
});

// @desc    Track user interaction with property
// @route   POST /api/v1/properties/:id/interact
// @access  Private
exports.trackInteraction = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(new ErrorResponse('User authentication required', 401));
    }

    const { interactionType, duration, metadata } = req.body;
    const propertyId = req.params.id;

    // Validate interaction type
    const validTypes = ['view', 'favorite', 'contact', 'share', 'search'];
    if (!validTypes.includes(interactionType)) {
      return next(new ErrorResponse(`Invalid interaction type. Must be one of: ${validTypes.join(', ')}`, 400));
    }

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return next(new ErrorResponse('Property not found', 404));
    }

    // Create or update interaction
    const interaction = await UserInteraction.findOneAndUpdate(
      {
        user: userId,
        property: propertyId,
        interactionType
      },
      {
        user: userId,
        property: propertyId,
        interactionType,
        duration: duration || 0,
        metadata: metadata || {},
        createdAt: new Date()
      },
      {
        upsert: true,
        new: true
      }
    );

    res.status(200).json({
      success: true,
      data: interaction
    });
  } catch (error) {
    console.error('Error tracking interaction:', error);
    next(error);
  }
});

// @desc    Get search suggestions and autocomplete
// @route   GET /api/v1/properties/search-suggestions
// @access  Public
exports.getSearchSuggestions = asyncHandler(async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q || q.length < 2) {
      // Return trending/popular searches when query is empty or too short
      const trendingSearches = await SearchAnalyticsService.getTrendingSearches({ limit: 5, hours: 24 });
      return res.status(200).json({
        success: true,
        cities: [],
        states: [],
        types: [],
        amenities: [],
        neighborhoods: [],
        trending: trendingSearches.map(t => t.query)
      });
    }

    const searchRegex = new RegExp(q, 'i');
    const suggestionLimit = parseInt(limit);

    // Get categorized suggestions with property counts using aggregation
    const [citiesResult, statesResult, typesResult, amenitiesResult, neighborhoodsResult] = await Promise.all([
      // Cities with property counts
      Property.aggregate([
        {
          $match: {
            'address.city': searchRegex,
            status: { $in: ['For Sale', 'For Rent'] }
          }
        },
        {
          $group: {
            _id: '$address.city',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1, _id: 1 }
        },
        {
          $limit: suggestionLimit
        },
        {
          $project: {
            name: '$_id',
            count: 1,
            _id: 0
          }
        }
      ]),

      // States with property counts
      Property.aggregate([
        {
          $match: {
            'address.state': searchRegex,
            status: { $in: ['For Sale', 'For Rent'] }
          }
        },
        {
          $group: {
            _id: '$address.state',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1, _id: 1 }
        },
        {
          $limit: suggestionLimit
        },
        {
          $project: {
            name: '$_id',
            count: 1,
            _id: 0
          }
        }
      ]),

      // Property types with counts
      Property.aggregate([
        {
          $match: {
            type: searchRegex,
            status: { $in: ['For Sale', 'For Rent'] }
          }
        },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1, _id: 1 }
        },
        {
          $limit: suggestionLimit
        },
        {
          $project: {
            name: '$_id',
            count: 1,
            _id: 0
          }
        }
      ]),

      // Amenities with counts
      Property.aggregate([
        {
          $match: {
            amenities: searchRegex,
            status: { $in: ['For Sale', 'For Rent'] }
          }
        },
        {
          $unwind: '$amenities'
        },
        {
          $match: {
            amenities: searchRegex
          }
        },
        {
          $group: {
            _id: '$amenities',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1, _id: 1 }
        },
        {
          $limit: suggestionLimit
        },
        {
          $project: {
            name: '$_id',
            count: 1,
            _id: 0
          }
        }
      ]),

      // Neighborhoods/Localities with counts
      Property.aggregate([
        {
          $match: {
            'address.locality': searchRegex,
            status: { $in: ['For Sale', 'For Rent'] }
          }
        },
        {
          $group: {
            _id: '$address.locality',
            count: { $sum: 1 },
            city: { $first: '$address.city' }
          }
        },
        {
          $sort: { count: -1, _id: 1 }
        },
        {
          $limit: suggestionLimit
        },
        {
          $project: {
            name: '$_id',
            count: 1,
            city: 1,
            _id: 0
          }
        }
      ])
    ]);

    // Get popular searches that match the query
    const popularSearches = await SearchAnalyticsService.getPopularSearches({ 
      limit: 5, 
      days: 30,
      minResults: 1
    });
    const matchingPopular = popularSearches
      .filter(s => s.query.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 3)
      .map(s => s.query);

    // Format response with categorized suggestions
    res.status(200).json({
      success: true,
      cities: citiesResult.map(c => ({ name: c.name, count: c.count })),
      states: statesResult.map(s => ({ name: s.name, count: s.count })),
      types: typesResult.map(t => ({ name: t.name, count: t.count })),
      amenities: amenitiesResult.map(a => ({ name: a.name, count: a.count })),
      neighborhoods: neighborhoodsResult.map(n => ({ 
        name: n.name, 
        count: n.count,
        city: n.city 
      })),
      popular: matchingPopular
    });
  } catch (error) {
    console.error('Error getting search suggestions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get search suggestions',
      cities: [],
      states: [],
      types: [],
      amenities: [],
      neighborhoods: []
    });
  }
});

