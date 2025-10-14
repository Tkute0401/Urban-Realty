const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Project = require('../models/Project');
const Developer = require('../models/Developer');
const { uploadImages, uploadVideos, uploadDocuments, deleteFiles } = require('../services/fileUploadService');

// @desc    Get all projects
// @route   GET /api/v1/projects
// @access  Public
exports.getProjects = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
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
  console.log('🔧 createProject called');
  console.log('🔧 Content-Type:', req.headers['content-type']);

  // Check if brochures is in req.body and remove it
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

  // Ensure req.body is clean and doesn't contain any file upload fields
  const cleanReqBody = { ...req.body };
  const fileUploadFields = ['images', 'floorPlans', 'brochures', 'virtualTours', 'logo', 'teamPhotos'];
  fileUploadFields.forEach(field => {
    if (cleanReqBody[field]) {
      delete cleanReqBody[field];
    }
  });

  // Process images if uploaded (to Cloudinary)
  const images = req.files?.images?.length > 0 
    ? await uploadImages(req.files.images, 'projects')
    : [];

  // Process floor plans if uploaded (to Cloudinary)
  const floorPlans = req.files?.floorPlans?.length > 0
    ? await uploadImages(req.files.floorPlans, 'projects/floor-plans')
    : [];

  // Process brochures if uploaded (to Railway's local storage)
  let brochures = [];
  if (req.files?.brochures?.length > 0) {
    try {
      brochures = await uploadDocuments(req.files.brochures, 'projects/brochures');
      console.log('🔧 Processed brochures count:', brochures.length);
      console.log('🔧 brochures type after uploadDocuments:', typeof brochures);
      console.log('🔧 brochures is array after uploadDocuments:', Array.isArray(brochures));
      console.log('🔧 brochures content after uploadDocuments:', brochures);
    } catch (error) {
      console.error('🔧 Error processing brochures:', error);
      brochures = [];
    }
  }

  // Process virtual tours if uploaded (to Cloudinary)
  const virtualTours = req.files?.virtualTours?.length > 0
    ? await uploadVideos(req.files.virtualTours, 'projects/virtual-tours')
    : [];

  // Set primary image if images exist
  if (images.length > 0) {
    images[0].isPrimary = true;
  }

  // Geocode location if address is provided
  let coordinates = null;
  if (req.body.location?.address) {
    try {
      // For now, we'll set a default coordinate or you can integrate with a geocoding service
      // You can replace this with actual geocoding API call
      coordinates = {
        type: 'Point',
        coordinates: [77.2090, 28.6139] // Default to Delhi coordinates
      };
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  }

  // Create projectData object, ensuring brochures is properly handled
  const projectData = {
    ...cleanReqBody,
    images,
    floorPlans,
    brochures: brochures, // Use the brochures array directly
    virtualTours: virtualTours || [],
    ...(coordinates && { 'location.coordinates': coordinates })
  };

  // Create a clean projectData object to avoid any string conversion issues
  const cleanProjectData = {
    name: projectData.name,
    description: projectData.description,
    shortDescription: projectData.shortDescription,
    type: projectData.type,
    status: projectData.status,
    totalUnits: projectData.totalUnits,
    totalArea: projectData.totalArea,
    location: projectData.location,
    launchDate: projectData.launchDate,
    possessionDate: projectData.possessionDate,
    pricePerSqFt: projectData.pricePerSqFt,
    startingPrice: projectData.startingPrice,
    developer: projectData.developer,
    images: projectData.images,
    floorPlans: projectData.floorPlans,
    brochures: brochures, // Use the brochures array directly
    virtualTours: projectData.virtualTours,
    'location.coordinates': projectData['location.coordinates']
  };

  console.log('🔧 About to create project with brochures count:', cleanProjectData.brochures?.length);
  console.log('🔧 brochures type before create:', typeof cleanProjectData.brochures);
  console.log('🔧 brochures is array before create:', Array.isArray(cleanProjectData.brochures));
  console.log('🔧 brochures content before create:', cleanProjectData.brochures);

  const project = await Project.create(cleanProjectData);

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

  // Process new images if uploaded
  if (req.files?.images?.length > 0) {
    const newImages = await uploadImagesToCloudinary(req.files.images, 'projects');
    project.images = [...project.images, ...newImages];
  }

  // Process new floor plans if uploaded
  if (req.files?.floorPlans?.length > 0) {
    const newFloorPlans = await uploadImagesToCloudinary(req.files.floorPlans, 'projects/floor-plans');
    project.floorPlans = [...project.floorPlans, ...newFloorPlans];
  }

  // Update other fields
  const fieldsToUpdate = { ...req.body };
  delete fieldsToUpdate.images;
  delete fieldsToUpdate.floorPlans;

  project = await Project.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  }).populate('developer', 'name logo website');

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

