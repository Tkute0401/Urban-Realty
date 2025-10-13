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
  
  const brochures = req.files?.brochures?.length > 0
    ? await uploadFileToCloudinary(req.files.brochures, 'projects/brochures')
    : [];
  console.log('🔧 Processed brochures:', brochures);
  console.log('🔧 brochures type:', typeof brochures);
  console.log('🔧 brochures is array:', Array.isArray(brochures));

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

  const projectData = {
    ...req.body,
    images,
    floorPlans,
    brochures: brochures || [],
    virtualTours: virtualTours || [],
    ...(coordinates && { 'location.coordinates': coordinates })
  };

  console.log('🔧 Final projectData before create:', JSON.stringify(projectData, null, 2));
  console.log('🔧 brochures type:', typeof projectData.brochures);
  console.log('🔧 brochures value:', projectData.brochures);
  console.log('🔧 brochures is array:', Array.isArray(projectData.brochures));
  console.log('🔧 brochures length:', projectData.brochures?.length);

  const project = await Project.create(projectData);

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
        resource_type: 'raw'
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
