const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Project = require('../models/Project');
const Developer = require('../models/Developer');
const { uploadImages, uploadVideos, uploadDocuments, deleteFiles } = require('../services/fileUploadService');

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

// @desc    Get all projects
// @route   GET /api/v1/projects
// @access  Public
exports.getProjects = asyncHandler(async (req, res, next) => {
  try {
    // Get projects from advancedResults middleware
    const projects = res.advancedResults.data;
    const pagination = res.advancedResults.pagination;

    // Handle location-based sorting
    let userLocation = null;
    if (req.query.userLat && req.query.userLng) {
      userLocation = {
        type: 'Point',
        coordinates: [parseFloat(req.query.userLng), parseFloat(req.query.userLat)]
      };
    }

    // Calculate distances if user location is provided
    let projectsWithDistance = projects;
    if (userLocation) {
      projectsWithDistance = projects.map(project => {
        if (project.location && project.location.coordinates) {
          const distance = calculateDistance(
            userLocation.coordinates[1], // user lat
            userLocation.coordinates[0], // user lng
            project.location.coordinates[1], // project lat
            project.location.coordinates[0]  // project lng
          );
          return {
            ...project.toObject(),
            distance: Math.round(distance * 100) / 100 // Round to 2 decimal places
          };
        }
        return {
          ...project.toObject(),
          distance: null
        };
      });

      // Sort by distance if user location is provided and no explicit sort
      if (!req.query.sort) {
        projectsWithDistance.sort((a, b) => {
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return a.distance - b.distance;
        });
      }
    }

    // Send response
    res.status(200).json({
      success: true,
      count: projectsWithDistance.length,
      pagination,
      userLocation: userLocation ? {
        latitude: userLocation.coordinates[1],
        longitude: userLocation.coordinates[0]
      } : null,
      data: projectsWithDistance
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get single project
// @route   GET /api/v1/projects/:id
// @access  Public
exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id).populate('developer', 'name logo website');

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  // Increment view count
  project.views += 1;
  await project.save();

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Get projects by developer
// @route   GET /api/v1/projects/developer/:developerId
// @access  Public
exports.getProjectsByDeveloper = asyncHandler(async (req, res, next) => {
  const projects = await Project.find({ developer: req.params.developerId })
    .populate('developer', 'name logo website')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects
  });
});

// @desc    Get my projects (for developer users)
// @route   GET /api/v1/projects/my-projects
// @access  Private (Developer)
exports.getMyProjects = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'developer') {
    return next(
      new ErrorResponse('Access denied. This endpoint is only for developer users.', 403)
    );
  }

  // Find developer profile for current user
  const developer = await Developer.findOne({ userId: req.user.id });
  
  if (!developer) {
    return res.status(200).json({
      success: true,
      count: 0,
      data: [],
      message: 'No developer profile found. Create one to add projects.'
    });
  }

  const projects = await Project.find({ developer: developer._id })
    .populate('developer', 'name logo website')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects
  });
});

// @desc    Create project
// @route   POST /api/v1/projects
// @access  Private (Developer/Admin)
exports.createProject = asyncHandler(async (req, res, next) => {
  // Check if brochures is in req.body and remove it (it should come from files)
  if (req.body.brochures) {
    delete req.body.brochures;
  }

  // Check if user is developer
  if (req.user.role === 'developer') {
    // Find developer profile for current user
    const developer = await Developer.findOne({ userId: req.user.id });
    
    if (!developer) {
      return next(
        new ErrorResponse('Developer profile not found. Please create your developer profile first.', 404)
      );
    }
    
    req.body.developer = developer._id;
  }

  // Log incoming data for debugging
  console.log('📦 Received project data:', {
    name: req.body.name,
    shortDescription: req.body.shortDescription,
    shortDescriptionLength: req.body.shortDescription?.length || 0,
    shortDescriptionPreview: req.body.shortDescription?.substring(0, 100) || 'N/A'
  });

  // Ensure req.body is clean and doesn't contain any file upload fields
  const cleanReqBody = { ...req.body };
  const fileUploadFields = ['images', 'floorPlans', 'brochures', 'virtualTours', 'logo', 'teamPhotos'];
  fileUploadFields.forEach(field => {
    if (cleanReqBody[field]) {
      delete cleanReqBody[field];
    }
  });

  // Process images if uploaded (to Cloudinary)
  let images = [];
  if (req.files?.images?.length > 0) {
    const uploadedImages = await uploadImages(req.files.images, 'projects');
    const mappedImages = uploadedImages.map(img => ({
      url: img.url,
      publicId: img.publicId,
      caption: img.caption || '',
      isPrimary: false
    }));
    // Set first image as primary
    if (mappedImages.length > 0) {
      mappedImages[0].isPrimary = true;
    }
    images = JSON.parse(JSON.stringify(mappedImages));
  }

  // Process floor plans if uploaded (to Cloudinary)
  let floorPlans = [];
  if (req.files?.floorPlans?.length > 0) {
    const uploadedFloorPlans = await uploadImages(req.files.floorPlans, 'projects/floor-plans');
    floorPlans = JSON.parse(JSON.stringify(uploadedFloorPlans.map(fp => ({
      url: fp.url,
      publicId: fp.publicId,
      unitType: fp.unitType || '',
      caption: fp.caption || ''
    }))));
  }

  // Process brochures if uploaded (to Railway's local storage)
  let brochures = [];
  if (req.files?.brochures?.length > 0) {
    try {
      const uploadedBrochures = await uploadDocuments(req.files.brochures, 'projects/brochures');
      brochures = uploadedBrochures.map(b => ({
        url: b.url ? String(b.url) : '',
        publicId: b.publicId ? String(b.publicId) : '',
        name: b.name ? String(b.name) : '',
        type: b.type ? String(b.type) : ''
      }));
    } catch (error) {
      console.error('Error processing brochures:', error);
      brochures = [];
    }
  }

  // Process virtual tours if uploaded (to Cloudinary)
  let virtualTours = [];
  if (req.files?.virtualTours?.length > 0) {
    const uploadedVirtualTours = await uploadVideos(req.files.virtualTours, 'projects/virtual-tours');
    virtualTours = JSON.parse(JSON.stringify(uploadedVirtualTours.map(vt => ({
      url: vt.url,
      type: 'video',
      thumbnail: vt.thumbnail || vt.url
    }))));
  }

  // Geocode location if address is provided
  let coordinates = null;
  if (req.body.location?.address) {
    try {
      const geocoder = require('../utils/hybridGeocoder');
      
      // First try with simplified address (city + state + country) for better success rate
      let addressString = [
        req.body.location.city,
        req.body.location.state,
        req.body.location.country || 'India'
      ].filter(Boolean).join(', ');

      console.log('🗺️ Project geocoding with simplified address:', addressString);
      let loc = await geocoder.geocode(addressString);
      
      // If simplified address fails, try with more details
      if (!loc || loc.length === 0) {
        console.log('🗺️ Simplified project geocoding failed, trying with full address...');
        addressString = [
          req.body.location.address,
          req.body.location.city,
          req.body.location.state,
          req.body.location.country || 'India'
        ].filter(Boolean).join(', ');
        
        console.log('🗺️ Project geocoding with full address:', addressString);
        loc = await geocoder.geocode(addressString);
      }
      
      if (loc && loc.length > 0) {
        console.log('✅ Project geocoding successful:', {
          coordinates: [loc[0].longitude, loc[0].latitude],
          formattedAddress: loc[0].formattedAddress
        });
        
        coordinates = {
          type: 'Point',
          coordinates: [loc[0].longitude, loc[0].latitude]
        };
      } else {
        console.warn('⚠️ Project geocoding failed - no results returned for address:', addressString);
        // Fallback to Delhi coordinates if geocoding fails
        coordinates = {
          type: 'Point',
          coordinates: [77.2090, 28.6139] // Default to Delhi coordinates
        };
      }
    } catch (error) {
      console.error('❌ Project geocoding error:', error.message);
      // Fallback to Delhi coordinates if geocoding fails
      coordinates = {
        type: 'Point',
        coordinates: [77.2090, 28.6139] // Default to Delhi coordinates
      };
    }
  }

  // Truncate shortDescription to 500 characters if it exists
  if (cleanReqBody.shortDescription && cleanReqBody.shortDescription.length > 500) {
    cleanReqBody.shortDescription = cleanReqBody.shortDescription.substring(0, 500);
  }

  // Create new project instance
  const project = new Project({
    name: cleanReqBody.name,
    description: cleanReqBody.description,
    shortDescription: cleanReqBody.shortDescription,
    type: cleanReqBody.type,
    status: cleanReqBody.status,
    totalUnits: cleanReqBody.totalUnits,
    totalArea: cleanReqBody.totalArea,
    unitTypes: cleanReqBody.unitTypes,
    configurations: cleanReqBody.configurations,
    location: cleanReqBody.location,
    launchDate: cleanReqBody.launchDate,
    possessionDate: cleanReqBody.possessionDate,
    constructionStartDate: cleanReqBody.constructionStartDate,
    estimatedCompletionDate: cleanReqBody.estimatedCompletionDate,
    pricePerSqFt: cleanReqBody.pricePerSqFt,
    startingPrice: cleanReqBody.startingPrice,
    priceRange: cleanReqBody.priceRange,
    amenities: cleanReqBody.amenities,
    features: cleanReqBody.features,
    keywords: cleanReqBody.keywords,
    metaDescription: cleanReqBody.metaDescription,
    reraNumber: cleanReqBody.reraNumber,
    approvals: cleanReqBody.approvals,
    paymentPlans: cleanReqBody.paymentPlans,
    contact: cleanReqBody.contact,
    isActive: cleanReqBody.isActive !== undefined ? cleanReqBody.isActive : true,
    isFeatured: cleanReqBody.isFeatured || false,
    isPublished: cleanReqBody.isPublished || false,
    developer: cleanReqBody.developer
  });

  // Assign arrays by pushing items individually
  if (images && images.length > 0) {
    images.forEach(img => project.images.push(img));
  }
  if (floorPlans && floorPlans.length > 0) {
    floorPlans.forEach(fp => project.floorPlans.push(fp));
  }
  if (brochures && brochures.length > 0) {
    brochures.forEach(b => project.brochures.push(b));
  }
  if (virtualTours && virtualTours.length > 0) {
    virtualTours.forEach(vt => project.virtualTours.push(vt));
  }

  // Add coordinates if they exist
  if (coordinates) {
    project.location.coordinates = coordinates;
  }

  // Save the project
  await project.save();

  // Populate developer information
  await project.populate('developer', 'name logo website');

  res.status(201).json({
    success: true,
    data: project
  });
});

// @desc    Update project
// @route   PUT /api/v1/projects/:id
// @access  Private (Developer/Admin)
exports.updateProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user is developer and owns this project
  if (req.user.role === 'developer') {
    const developer = await Developer.findOne({ userId: req.user.id });
    
    if (!developer || project.developer.toString() !== developer._id.toString()) {
      return next(
        new ErrorResponse('Not authorized to update this project', 403)
      );
    }
  }

  // Clean request body and remove file upload fields
  const cleanReqBody = { ...req.body };
  const fileUploadFields = ['images', 'floorPlans', 'brochures', 'virtualTours'];
  fileUploadFields.forEach(field => {
    if (cleanReqBody[field]) {
      delete cleanReqBody[field];
    }
  });

  // Process new images if uploaded
  if (req.files?.images?.length > 0) {
    const uploadedImages = await uploadImages(req.files.images, 'projects');
    const mappedImages = uploadedImages.map(img => ({
      url: img.url,
      publicId: img.publicId,
      caption: img.caption || '',
      isPrimary: false
    }));
    project.images = [...project.images, ...mappedImages];
  }

  // Process new floor plans if uploaded
  if (req.files?.floorPlans?.length > 0) {
    const uploadedFloorPlans = await uploadImages(req.files.floorPlans, 'projects/floor-plans');
    const mappedFloorPlans = uploadedFloorPlans.map(fp => ({
      url: fp.url,
      publicId: fp.publicId,
      unitType: fp.unitType || '',
      caption: fp.caption || ''
    }));
    project.floorPlans = [...project.floorPlans, ...mappedFloorPlans];
  }

  // Process new brochures if uploaded
  if (req.files?.brochures?.length > 0) {
    try {
      const uploadedBrochures = await uploadDocuments(req.files.brochures, 'projects/brochures');
      const mappedBrochures = uploadedBrochures.map(b => ({
        url: b.url ? String(b.url) : '',
        publicId: b.publicId ? String(b.publicId) : '',
        name: b.name ? String(b.name) : '',
        type: b.type ? String(b.type) : ''
      }));
      project.brochures = [...project.brochures, ...mappedBrochures];
    } catch (error) {
      console.error('Error uploading brochures:', error);
    }
  }

  // Process new virtual tours if uploaded
  if (req.files?.virtualTours?.length > 0) {
    try {
      const uploadedVirtualTours = await uploadDocuments(req.files.virtualTours, 'projects/virtual-tours');
      const mappedVirtualTours = uploadedVirtualTours.map(vt => ({
        url: vt.url ? String(vt.url) : '',
        type: vt.type ? String(vt.type) : 'video',
        thumbnail: vt.thumbnail ? String(vt.thumbnail) : ''
      }));
      project.virtualTours = [...project.virtualTours, ...mappedVirtualTours];
    } catch (error) {
      console.error('Error uploading virtual tours:', error);
    }
  }

  // Handle existing media preservation
  if (req.body.existingImages) {
    const existingImages = Array.isArray(req.body.existingImages) 
      ? req.body.existingImages.map(img => JSON.parse(img))
      : [JSON.parse(req.body.existingImages)];
    project.images = existingImages;
  }

  if (req.body.existingFloorPlans) {
    const existingFloorPlans = Array.isArray(req.body.existingFloorPlans) 
      ? req.body.existingFloorPlans.map(fp => JSON.parse(fp))
      : [JSON.parse(req.body.existingFloorPlans)];
    project.floorPlans = existingFloorPlans;
  }

  if (req.body.existingBrochures) {
    const existingBrochures = Array.isArray(req.body.existingBrochures) 
      ? req.body.existingBrochures.map(b => JSON.parse(b))
      : [JSON.parse(req.body.existingBrochures)];
    project.brochures = existingBrochures;
  }

  if (req.body.existingVirtualTours) {
    const existingVirtualTours = Array.isArray(req.body.existingVirtualTours) 
      ? req.body.existingVirtualTours.map(vt => JSON.parse(vt))
      : [JSON.parse(req.body.existingVirtualTours)];
    project.virtualTours = existingVirtualTours;
  }

  // Geocoding for address if provided
  if (cleanReqBody.location?.address) {
    try {
      const addressString = `${cleanReqBody.location.address}, ${cleanReqBody.location.city}, ${cleanReqBody.location.state} ${cleanReqBody.location.pincode}, India`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressString)}&limit=1&countrycodes=in`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const loc = data[0];
        cleanReqBody.location.coordinates = {
          type: 'Point',
          coordinates: [parseFloat(loc.lon), parseFloat(loc.lat)]
        };
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  }

  // Truncate shortDescription to 500 characters if it exists
  if (cleanReqBody.shortDescription && cleanReqBody.shortDescription.length > 500) {
    cleanReqBody.shortDescription = cleanReqBody.shortDescription.substring(0, 500);
  }

  // Update project fields
  Object.keys(cleanReqBody).forEach(key => {
    if (cleanReqBody[key] !== undefined) {
      project[key] = cleanReqBody[key];
    }
  });

  // Save the project
  await project.save();

  // Populate developer information
  await project.populate('developer', 'name logo website');

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Delete project
// @route   DELETE /api/v1/projects/:id
// @access  Private (Developer/Admin)
exports.deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user is developer and owns this project
  if (req.user.role === 'developer') {
    const developer = await Developer.findOne({ userId: req.user.id });
    
    if (!developer || project.developer.toString() !== developer._id.toString()) {
      return next(
        new ErrorResponse('Not authorized to delete this project', 403)
      );
    }
  }

  // Delete all files using the file upload service
  const allFiles = [
    ...(project.images || []),
    ...(project.floorPlans || []),
    ...(project.brochures || []),
    ...(project.virtualTours || [])
  ];

  if (allFiles.length > 0) {
    await deleteFiles(allFiles);
  }

  await Project.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});

