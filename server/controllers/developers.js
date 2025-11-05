const fs = require('fs');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Developer = require('../models/Developer');
const Project = require('../models/Project');
const ContactRequest = require('../models/ContactRequest');
const { uploadImages, uploadDocuments, deleteFiles } = require('../services/fileUploadService');
const { HTTP_STATUS, createSuccessResponse, createErrorResponse } = require('../constants');

// @desc    Get developer profile for current user
// @route   GET /api/v1/developers/profile/me
// @access  Private (Developer)
exports.getMyDeveloperProfile = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'developer') {
    return next(
      new ErrorResponse('Access denied. This endpoint is only for developer users.', 403)
    );
  }

  const developer = await Developer.findOne({ userId: req.user.id });

  if (!developer) {
    return res.status(200).json({
      success: true,
      data: null,
      message: 'No developer profile found. Create one to get started.'
    });
  }

  res.status(200).json({
    success: true,
    data: developer
  });
});

// @desc    Get all developers
// @route   GET /api/v1/developers
// @access  Public
exports.getDevelopers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single developer
// @route   GET /api/v1/developers/:id
// @access  Public
exports.getDeveloper = asyncHandler(async (req, res, next) => {
  const developer = await Developer.findById(req.params.id);

  if (!developer) {
    return next(
      new ErrorResponse(`Developer not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: developer
  });
});

// @desc    Create developer
// @route   POST /api/v1/developers
// @access  Private (Admin/Agent/Developer)
exports.createDeveloper = asyncHandler(async (req, res, next) => {
  // If user is a developer, connect them to the developer entity
  if (req.user.role === 'developer') {
    req.body.userId = req.user.id;
  }

  const developer = await Developer.create(req.body);

  // If user is a developer, update their developerId
  if (req.user.role === 'developer') {
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user.id, { developerId: developer._id });
  }

  res.status(201).json({
    success: true,
    data: developer
  });
});

exports.updateDeveloper = asyncHandler(async (req, res, next) => {
  
  let developer = await Developer.findById(req.params.id);

  if (!developer) {
    return next(
      new ErrorResponse(`Developer not found with id of ${req.params.id}`, 404)
    );
  }

  // Remove fields that shouldn't be updated
  const fieldsToRemove = ['logo', 'teamPhotos', '_id', '__v'];
  fieldsToRemove.forEach(field => delete req.body[field]);

  // Handle nested objects
  const updateFields = {
    ...req.body,
    headquarters: req.body.headquarters || developer.headquarters,
    contact: req.body.contact || developer.contact,
    socialMedia: req.body.socialMedia || developer.socialMedia
  };

  developer = await Developer.findByIdAndUpdate(
    req.params.id,
    updateFields,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: developer
  });
});

// @desc    Delete developer
// @route   DELETE /api/v1/developers/:id
// @access  Private (Admin)
exports.deleteDeveloper = asyncHandler(async (req, res, next) => {
  const developer = await Developer.findById(req.params.id);

  if (!developer) {
    return next(
      new ErrorResponse(`Developer not found with id of ${req.params.id}`, 404)
    );
  }

  // Delete logo from Cloudinary if exists
  if (developer.logo?.publicId) {
    await cloudinary.uploader.destroy(developer.logo.publicId);
  }

  // Use deleteOne() instead of remove()
  await Developer.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Upload developer logo
// @route   PUT /api/v1/developers/:id/logo
// @access  Private (Admin/Agent)
exports.uploadDeveloperLogo = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const developer = await Developer.findById(req.params.id);
  if (!developer) {
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    return next(new ErrorResponse(`Developer not found with id of ${req.params.id}`, 404));
  }

  try {
    // Upload to Cloudinary using the new service
    const uploadedImages = await uploadImages([req.file], 'real-estate/developers');
    
    if (uploadedImages.length === 0) {
      throw new Error('Failed to upload image');
    }

    const result = uploadedImages[0];

    // Delete old logo if exists
    if (developer.logo?.publicId) {
      try {
        await deleteFiles([developer.logo]);
      } catch (err) {
        console.error('Error deleting old logo:', err);
      }
    }

    // Update developer
    developer.logo = {
      url: result.url,
      publicId: result.publicId
    };
    await developer.save();

    // Delete temp file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      data: developer.logo.url
    });
  } catch (err) {
    // Clean up temp file if error occurs
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(new ErrorResponse('Logo upload failed', 500));
  }
});

// @desc    Get developer dashboard data
// @route   GET /api/v1/developers/dashboard
// @access  Private (Developer)
exports.getDeveloperDashboard = asyncHandler(async (req, res, next) => {
  try {
    const { user } = req;
    const developerId = user._id.toString();

    // Get query parameters for filtering
    const { status = 'all', dateRange = '30', projectType = 'all' } = req.query;

    // Date filter calculation
    let dateFilter = {};
    if (dateRange !== 'all') {
      const days = parseInt(dateRange) || 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      dateFilter.createdAt = { $gte: startDate };
    }

    // Build project filter
    let projectFilter = { developers: developerId, ...dateFilter };
    if (status !== 'all') {
      projectFilter.status = status;
    }
    if (projectType !== 'all') {
      projectFilter.type = projectType;
    }

    // Get developer projects
    const projects = await Project.find(projectFilter)
      .populate('developers', 'name email')
      .sort('-createdAt');

    // Get inquiries for projects
    const projectIds = projects.map(p => p._id);
    const inquiries = await ContactRequest.find({
      project: { $in: projectIds },
      ...dateFilter
    }).sort('-createdAt');

    // Calculate stats
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const totalUnits = projects.reduce((sum, p) => sum + (p.units || 0), 0);
    const totalViews = projects.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalInquiries = inquiries.length;
    const conversionRate = totalViews > 0 ? ((totalInquiries / totalViews) * 100).toFixed(2) : 0;
    const avgResponseTime = inquiries.length > 0 ? 
      Math.round(inquiries.reduce((sum, i) => sum + (i.responseTime || 24), 0) / inquiries.length) : 0;

    // Get top performing project
    const topPerformingProject = projects.reduce((top, current) => {
      const currentScore = (current.views || 0) + (current.inquiries || 0) * 2;
      const topScore = (top.views || 0) + (top.inquiries || 0) * 2;
      return currentScore > topScore ? current : top;
    }, projects[0] || null);

    // Generate monthly data
    const monthlyData = generateMonthlyProjectData(projects);

    // Prepare dashboard data
    const dashboardData = {
      stats: {
        totalProjects,
        activeProjects,
        totalUnits,
        totalViews,
        totalInquiries,
        conversionRate: parseFloat(conversionRate),
        avgResponseTime
      },
      projects: projects.slice(0, 10), // Recent 10 projects
      inquiries: inquiries.slice(0, 10).map(inquiry => ({
        id: inquiry._id,
        user: {
          name: inquiry.user?.name || 'Unknown',
          email: inquiry.user?.email || '',
          mobile: inquiry.user?.mobile || inquiry.user?.phone || ''
        },
        project: {
          name: inquiry.project?.name || 'Project',
          type: inquiry.project?.type || 'residential'
        },
        status: inquiry.status,
        contactMethod: inquiry.contactMethod || 'email',
        message: inquiry.message || '',
        createdAt: inquiry.createdAt
      })),
      topPerformingProject,
      monthlyData,
      trends: {
        projects: totalProjects > 0 ? '+8%' : null,
        units: totalUnits > 0 ? '+12%' : null,
        views: totalViews > 0 ? '+15%' : null,
        inquiries: totalInquiries > 0 ? '+10%' : null
      }
    };

    res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(dashboardData, 'Developer dashboard data retrieved successfully')
    );
  } catch (error) {
    console.error('Developer dashboard error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      createErrorResponse('Failed to retrieve developer dashboard data')
    );
  }
});

// @desc    Get developer analytics data
// @route   GET /api/v1/developers/analytics
// @access  Private (Developer)
exports.getDeveloperAnalytics = asyncHandler(async (req, res, next) => {
  try {
    const { user } = req;
    const developerId = user._id.toString();

    // Get date range from query (default to last 30 days)
    const { timeframe = '30d' } = req.query;
    const dateFilter = getDateFilter(timeframe);

    // Get developer data
    const projects = await Project.find({ 
      developers: developerId,
      ...dateFilter 
    }).sort('-createdAt');

    const inquiries = await ContactRequest.find({
      project: { $in: projects.map(p => p._id) },
      ...dateFilter
    }).sort('-createdAt');

    // Analytics calculations
    const analytics = {
      overview: {
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'active').length,
        totalUnits: projects.reduce((sum, p) => sum + (p.units || 0), 0),
        totalViews: projects.reduce((sum, p) => sum + (p.views || 0), 0),
        totalInquiries: inquiries.length,
        conversionRate: projects.reduce((sum, p) => sum + (p.views || 0), 0) > 0 ? 
          ((inquiries.length / projects.reduce((sum, p) => sum + (p.views || 0), 0)) * 100).toFixed(2) : 0,
        avgResponseTime: inquiries.length > 0 ?
          Math.round(inquiries.reduce((sum, i) => sum + (i.responseTime || 24), 0) / inquiries.length) : 0
      },
      performance: {
        topPerformingProjects: projects
          .sort((a, b) => ((b.views || 0) + (b.inquiries || 0) * 2) - ((a.views || 0) + (a.inquiries || 0) * 2))
          .slice(0, 5),
        inquirySources: generateInquirySources(inquiries),
        inquiryStatusBreakdown: generateInquiryStatusBreakdown(inquiries)
      },
      monthlyData: generateMonthlyProjectData(projects),
      trends: {
        growthRate: calculateGrowthRate(projects, timeframe),
        viewsOverTime: generateViewsTrend(projects, timeframe),
        inquiriesOverTime: generateInquiriesTrend(inquiries, timeframe)
      },
      recentActivity: inquiries.slice(0, 10).map(inquiry => ({
        message: `New inquiry for ${inquiry.project?.name || 'project'}`,
        createdAt: inquiry.createdAt
      }))
    };

    res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(analytics, 'Developer analytics data retrieved successfully')
    );
  } catch (error) {
    console.error('Developer analytics error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      createErrorResponse('Failed to retrieve developer analytics data')
    );
  }
});

// @desc    Get developer inquiries
// @route   GET /api/v1/developers/inquiries
// @access  Private (Developer)
exports.getDeveloperInquiries = asyncHandler(async (req, res, next) => {
  try {
    const { user } = req;
    const developerId = user._id.toString();

    // Get developer's projects
    const projects = await Project.find({ developers: developerId });
    const projectIds = projects.map(p => p._id);

    // Get inquiries for these projects
    const inquiries = await ContactRequest.find({
      project: { $in: projectIds }
    })
    .populate('user', 'name email mobile phone')
    .populate('project', 'name type')
    .sort('-createdAt');

    res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(inquiries, 'Developer inquiries retrieved successfully')
    );
  } catch (error) {
    console.error('Developer inquiries error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      createErrorResponse('Failed to retrieve developer inquiries')
    );
  }
});

// @desc    Update developer inquiry
// @route   PUT /api/v1/developers/inquiries/:inquiryId
// @access  Private (Developer)
exports.updateDeveloperInquiry = asyncHandler(async (req, res, next) => {
  try {
    const { inquiryId } = req.params;
    const { status, response } = req.body;
    const { user } = req;

    // Verify the inquiry belongs to developer's project
    const inquiry = await ContactRequest.findById(inquiryId).populate('project');
    if (!inquiry) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Inquiry not found')
      );
    }

    // Check if user's developer profile is in the project's developers array
    const developer = await Developer.findOne({ userId: user._id });
    if (!developer || !inquiry.project.developers || 
        !inquiry.project.developers.some((dev) => {
          const devId = typeof dev === 'string' ? dev : (dev._id || dev);
          return devId.toString() === developer._id.toString();
        })) {
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        createErrorResponse('Access denied - inquiry does not belong to your projects')
      );
    }

    // Update inquiry
    const updatedInquiry = await ContactRequest.findByIdAndUpdate(
      inquiryId,
      { 
        status: status || inquiry.status,
        response: response || inquiry.response,
        responseTime: response ? new Date() : inquiry.responseTime
      },
      { new: true }
    ).populate('user', 'name email mobile phone')
     .populate('project', 'name type');

    res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(updatedInquiry, 'Inquiry updated successfully')
    );
  } catch (error) {
    console.error('Update inquiry error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      createErrorResponse('Failed to update inquiry')
    );
  }
});

// Helper functions
function getDateFilter(timeframe) {
  const now = new Date();
  let startDate;

  switch (timeframe) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '365d':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  return { createdAt: { $gte: startDate } };
}

function generateMonthlyProjectData(projects) {
  const monthlyData = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    const monthProjects = projects.filter(p => {
      const projectDate = new Date(p.createdAt);
      return projectDate.getMonth() === date.getMonth() && projectDate.getFullYear() === year;
    });
    
    monthlyData.push({
      month: `${month} ${year}`,
      views: monthProjects.reduce((sum, p) => sum + (p.views || 0), 0),
      inquiries: monthProjects.reduce((sum, p) => sum + (p.inquiries || 0), 0),
      projects: monthProjects.length
    });
  }
  
  return monthlyData;
}

function generateInquirySources(inquiries) {
  const sources = {};
  inquiries.forEach(inquiry => {
    const source = inquiry.contactMethod || 'email';
    sources[source] = (sources[source] || 0) + 1;
  });
  return sources;
}

function generateInquiryStatusBreakdown(inquiries) {
  const breakdown = {};
  inquiries.forEach(inquiry => {
    const status = inquiry.status || 'pending';
    breakdown[status] = (breakdown[status] || 0) + 1;
  });
  return breakdown;
}

function calculateGrowthRate(projects, timeframe) {
  // Simple growth rate calculation
  const currentPeriod = projects.length;
  const previousPeriod = Math.max(1, Math.floor(currentPeriod * 0.8)); // Mock previous period
  return ((currentPeriod - previousPeriod) / previousPeriod * 100).toFixed(1);
}

function generateViewsTrend(projects, timeframe) {
  // Mock trend data
  return projects.map(p => ({
    month: new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short' }),
    views: p.views || 0
  }));
}

function generateInquiriesTrend(inquiries, timeframe) {
  // Mock trend data
  return inquiries.map(i => ({
    month: new Date(i.createdAt).toLocaleDateString('en-US', { month: 'short' }),
    inquiries: 1
  }));
}