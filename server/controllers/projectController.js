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
      // Extract only the string values we need
      brochures = uploadedBrochures.map(b => {
        const clean = {
          url: b.url ? String(b.url) : '',
          publicId: b.publicId ? String(b.publicId) : '',
          name: b.name ? String(b.name) : '',
          type: b.type ? String(b.type) : ''
        };
        console.log('📄 Individual brochure object:', typeof clean, JSON.stringify(clean));
        return clean;
      });
      console.log('📄 Final brochures array:', typeof brochures, Array.isArray(brochures), brochures.length);
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

  // Create new project instance
  const project = new Project({
    name: cleanReqBody.name,
    description: cleanReqBody.description,
    shortDescription: cleanReqBody.shortDescription,
    type: cleanReqBody.type,
    status: cleanReqBody.status,
    totalUnits: cleanReqBody.totalUnits,
    totalArea: cleanReqBody.totalArea,
    location: cleanReqBody.location,
    launchDate: cleanReqBody.launchDate,
    possessionDate: cleanReqBody.possessionDate,
    pricePerSqFt: cleanReqBody.pricePerSqFt,
    startingPrice: cleanReqBody.startingPrice,
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
    console.log('📄 Before pushing to project.brochures, count:', brochures.length);
    brochures.forEach((b, index) => {
      console.log(`📄 Pushing brochure ${index}:`, typeof b, JSON.stringify(b));
      project.brochures.push(b);
      console.log(`📄 After push ${index}, project.brochures length:`, project.brochures.length);
      console.log(`📄 Item in project.brochures[${index}]:`, typeof project.brochures[index], JSON.stringify(project.brochures[index]));
    });
  }
  if (virtualTours && virtualTours.length > 0) {
    virtualTours.forEach(vt => project.virtualTours.push(vt));
  }
  
  console.log('📄 Right before save, project.brochures:', typeof project.brochures, Array.isArray(project.brochures), project.brochures?.length);

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

