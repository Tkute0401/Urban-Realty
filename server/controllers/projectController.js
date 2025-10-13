const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Project = require('../models/Project');
const Developer = require('../models/Developer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

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
  console.log('🔧 req.body:', JSON.stringify(req.body, null, 2));
  console.log('🔧 req.files:', req.files);
  console.log('🔧 Content-Type:', req.headers['content-type']);

  // Check if brochures is in req.body and remove it
  if (req.body.brochures) {
    console.log('🔧 WARNING: brochures found in req.body, removing it');
    console.log('🔧 req.body.brochures type:', typeof req.body.brochures);
    console.log('🔧 req.body.brochures value:', req.body.brochures);
    delete req.body.brochures;
  }

  // Ensure req.body is clean and doesn't contain any file upload fields
  const cleanReqBody = { ...req.body };
  const fileUploadFields = ['images', 'floorPlans', 'brochures', 'virtualTours', 'logo', 'teamPhotos'];
  fileUploadFields.forEach(field => {
    if (cleanReqBody[field]) {
      console.log(`🔧 Removing ${field} from cleanReqBody`);
      delete cleanReqBody[field];
    }
  });
  
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

  // Process images if uploaded
  const images = req.files?.images?.length > 0 
    ? await uploadImagesToCloudinary(req.files.images, 'projects')
    : [];

  // Process floor plans if uploaded
  const floorPlans = req.files?.floorPlans?.length > 0
    ? await uploadImagesToCloudinary(req.files.floorPlans, 'projects/floor-plans')
    : [];

  // Process brochures if uploaded
  console.log('🔧 req.files.brochures:', req.files?.brochures);
  console.log('🔧 req.body.brochures:', req.body.brochures);
  
  let brochures = req.files?.brochures?.length > 0
    ? await uploadFileToCloudinary(req.files.brochures, 'projects/brochures')
    : [];
  console.log('🔧 Processed brochures:', brochures);
  console.log('🔧 brochures type:', typeof brochures);
  console.log('🔧 brochures is array:', Array.isArray(brochures));
  
  // Ensure brochures is always an array
  if (!Array.isArray(brochures)) {
    console.warn('🔧 brochures is not an array after processing, converting to empty array');
    brochures = [];
  }

  // Process virtual tours if uploaded
  const virtualTours = req.files?.virtualTours?.length > 0
    ? await uploadVideoToCloudinary(req.files.virtualTours, 'projects/virtual-tours')
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
    brochures: brochures || [],
    virtualTours: virtualTours || [],
    ...(coordinates && { 'location.coordinates': coordinates })
  };

  // Ensure brochures is always an array and not a string
  if (projectData.brochures && typeof projectData.brochures === 'string') {
    try {
      projectData.brochures = JSON.parse(projectData.brochures);
    } catch (error) {
      console.error('Error parsing brochures string:', error);
      projectData.brochures = [];
    }
  }

  // Double-check that brochures is an array
  if (!Array.isArray(projectData.brochures)) {
    console.warn('🔧 brochures is not an array, converting to empty array');
    projectData.brochures = [];
  }

  console.log('🔧 Final projectData before create:', JSON.stringify(projectData, null, 2));
  console.log('🔧 brochures type:', typeof projectData.brochures);
  console.log('🔧 brochures value:', projectData.brochures);
  console.log('🔧 brochures is array:', Array.isArray(projectData.brochures));
  console.log('🔧 brochures length:', projectData.brochures?.length);

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
    brochures: Array.isArray(projectData.brochures) ? projectData.brochures : [], // Force array
    virtualTours: projectData.virtualTours,
    'location.coordinates': projectData['location.coordinates']
  };

  console.log('🔧 Clean projectData brochures type:', typeof cleanProjectData.brochures);
  console.log('🔧 Clean projectData brochures is array:', Array.isArray(cleanProjectData.brochures));
  console.log('🔧 Clean projectData brochures value:', cleanProjectData.brochures);

  // Final safety check - ensure brochures is an array
  if (!Array.isArray(cleanProjectData.brochures)) {
    console.warn('🔧 FINAL CHECK: brochures is not an array, setting to empty array');
    cleanProjectData.brochures = [];
  }

  console.log('🔧 FINAL brochures check - type:', typeof cleanProjectData.brochures);
  console.log('🔧 FINAL brochures check - is array:', Array.isArray(cleanProjectData.brochures));
  console.log('🔧 FINAL brochures check - value:', cleanProjectData.brochures);

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

  // Delete images from Cloudinary
  if (project.images?.length > 0) {
    for (const image of project.images) {
      if (image.publicId) {
        await cloudinary.uploader.destroy(image.publicId);
      }
    }
  }

  // Delete floor plans from Cloudinary
  if (project.floorPlans?.length > 0) {
    for (const floorPlan of project.floorPlans) {
      if (floorPlan.publicId) {
        await cloudinary.uploader.destroy(floorPlan.publicId);
      }
    }
  }

  // Delete brochures from Cloudinary
  if (project.brochures?.length > 0) {
    for (const brochure of project.brochures) {
      if (brochure.publicId) {
        await cloudinary.uploader.destroy(brochure.publicId);
      }
    }
  }

  // Delete virtual tours from Cloudinary
  if (project.virtualTours?.length > 0) {
    for (const tour of project.virtualTours) {
      if (tour.publicId) {
        await cloudinary.uploader.destroy(tour.publicId);
      }
    }
  }

  await Project.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});

// Helper function to upload images to Cloudinary
const uploadImagesToCloudinary = async (files, folder) => {
  const uploadedImages = [];
  
  for (const file of files) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folder,
        access_mode: 'public', // Make images publicly accessible
        transformation: [
          { width: 1200, height: 800, crop: 'fill', quality: 'auto' },
          { format: 'auto' }
        ]
      });
      
      uploadedImages.push({
        url: result.secure_url,
        publicId: result.public_id
      });
      
      // Delete local file
      fs.unlinkSync(file.path);
    } catch (error) {
      console.error('Error uploading image:', error);
      // Delete local file even if upload failed
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }
  }
  
  return uploadedImages;
};

// Helper function to upload files to Cloudinary
const uploadFileToCloudinary = async (files, folder) => {
  const uploadedFiles = [];
  
  for (const file of files) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folder,
        resource_type: 'raw',
        access_mode: 'public' // Make files publicly accessible
      });
      
      uploadedFiles.push({
        url: result.secure_url,
        publicId: result.public_id,
        name: file.originalname,
        type: file.mimetype
      });
      
      // Delete local file
      fs.unlinkSync(file.path);
    } catch (error) {
      console.error('Error uploading file:', error);
      // Delete local file even if upload failed
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }
  }
  
  return uploadedFiles;
};

// Helper function to upload videos to Cloudinary
const uploadVideoToCloudinary = async (files, folder) => {
  const uploadedVideos = [];
  
  for (const file of files) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folder,
        resource_type: 'video',
        access_mode: 'public', // Make videos publicly accessible
        transformation: [
          { width: 1280, height: 720, crop: 'fill', quality: 'auto' }
        ]
      });
      
      uploadedVideos.push({
        url: result.secure_url,
        publicId: result.public_id,
        type: 'video',
        thumbnail: result.secure_url.replace('.mp4', '.jpg')
      });
      
      // Delete local file
      fs.unlinkSync(file.path);
    } catch (error) {
      console.error('Error uploading video:', error);
      // Delete local file even if upload failed
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }
  }
  
  return uploadedVideos;
};
