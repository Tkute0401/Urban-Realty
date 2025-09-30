const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get agent dashboard data
// @route   GET /api/v1/agent/dashboard
// @access  Private/Agent
exports.getDashboard = asyncHandler(async (req, res, next) => {
  try {
    // Get agent's properties, leads, and analytics
    const Property = require('../models/Property');
    const Contact = require('../models/Contact');
    
    const agentId = req.user.id;
    
    // Get agent's properties count
    const propertiesCount = await Property.countDocuments({ agent: agentId });
    
    // Get agent's leads count
    const leadsCount = await Contact.countDocuments({ agent: agentId });
    
    // Get recent leads
    const recentLeads = await Contact.find({ agent: agentId })
      .sort('-createdAt')
      .limit(5)
      .populate('property', 'title location');

    res.status(200).json({
      success: true,
      data: {
        propertiesCount,
        leadsCount,
        recentLeads,
        agent: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email
        }
      }
    });
  } catch (err) {
    console.error('Error fetching agent dashboard:', err);
    next(new ErrorResponse('Failed to fetch dashboard data', 500));
  }
});

// @desc    Get agent analytics
// @route   GET /api/v1/agent/analytics
// @access  Private/Agent
exports.getAnalytics = asyncHandler(async (req, res, next) => {
  try {
    const Property = require('../models/Property');
    const Contact = require('../models/Contact');
    
    const agentId = req.user.id;
    
    // Get analytics data
    const totalProperties = await Property.countDocuments({ agent: agentId });
    const totalLeads = await Contact.countDocuments({ agent: agentId });
    const monthlyLeads = await Contact.countDocuments({
      agent: agentId,
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalProperties,
        totalLeads,
        monthlyLeads
      }
    });
  } catch (err) {
    console.error('Error fetching agent analytics:', err);
    next(new ErrorResponse('Failed to fetch analytics data', 500));
  }
});

// @desc    Get agent leads
// @route   GET /api/v1/agent/leads
// @access  Private/Agent
exports.getLeads = asyncHandler(async (req, res, next) => {
  try {
    const Contact = require('../models/Contact');
    
    const agentId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const leads = await Contact.find({ agent: agentId })
      .populate('property', 'title location price')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments({ agent: agentId });

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching agent leads:', err);
    next(new ErrorResponse('Failed to fetch leads', 500));
  }
});

// @desc    Get agent properties
// @route   GET /api/v1/agent/properties
// @access  Private/Agent
exports.getProperties = asyncHandler(async (req, res, next) => {
  try {
    const Property = require('../models/Property');
    
    const agentId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const properties = await Property.find({ agent: agentId })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Property.countDocuments({ agent: agentId });

    res.status(200).json({
      success: true,
      data: properties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching agent properties:', err);
    next(new ErrorResponse('Failed to fetch properties', 500));
  }
});

// @desc    Get admin dashboard for specific agent
// @route   GET /api/v1/agent/:agentId/dashboard
// @access  Private/Admin
exports.getAdminDashboard = asyncHandler(async (req, res, next) => {
  try {
    const Property = require('../models/Property');
    const Contact = require('../models/Contact');
    const User = require('../models/User');
    
    const agentId = req.params.agentId;
    
    // Verify agent exists
    const agent = await User.findById(agentId);
    if (!agent || agent.role !== 'agent') {
      return next(new ErrorResponse('Agent not found', 404));
    }
    
    // Get agent's data
    const propertiesCount = await Property.countDocuments({ agent: agentId });
    const leadsCount = await Contact.countDocuments({ agent: agentId });
    
    res.status(200).json({
      success: true,
      data: {
        propertiesCount,
        leadsCount,
        agent: {
          id: agent._id,
          name: agent.name,
          email: agent.email
        }
      }
    });
  } catch (err) {
    console.error('Error fetching admin dashboard for agent:', err);
    next(new ErrorResponse('Failed to fetch agent dashboard', 500));
  }
});

// @desc    Get admin analytics for specific agent
// @route   GET /api/v1/agent/:agentId/analytics
// @access  Private/Admin
exports.getAdminAnalytics = asyncHandler(async (req, res, next) => {
  try {
    const Property = require('../models/Property');
    const Contact = require('../models/Contact');
    
    const agentId = req.params.agentId;
    
    const totalProperties = await Property.countDocuments({ agent: agentId });
    const totalLeads = await Contact.countDocuments({ agent: agentId });

    res.status(200).json({
      success: true,
      data: {
        totalProperties,
        totalLeads
      }
    });
  } catch (err) {
    console.error('Error fetching admin analytics for agent:', err);
    next(new ErrorResponse('Failed to fetch agent analytics', 500));
  }
});

// @desc    Get admin leads for specific agent
// @route   GET /api/v1/agent/:agentId/leads
// @access  Private/Admin
exports.getAdminLeads = asyncHandler(async (req, res, next) => {
  try {
    const Contact = require('../models/Contact');
    
    const agentId = req.params.agentId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const leads = await Contact.find({ agent: agentId })
      .populate('property', 'title location price')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments({ agent: agentId });

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching admin leads for agent:', err);
    next(new ErrorResponse('Failed to fetch agent leads', 500));
  }
});

// @desc    Get admin properties for specific agent
// @route   GET /api/v1/agent/:agentId/properties
// @access  Private/Admin
exports.getAdminProperties = asyncHandler(async (req, res, next) => {
  try {
    const Property = require('../models/Property');
    
    const agentId = req.params.agentId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const properties = await Property.find({ agent: agentId })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Property.countDocuments({ agent: agentId });

    res.status(200).json({
      success: true,
      data: properties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching admin properties for agent:', err);
    next(new ErrorResponse('Failed to fetch agent properties', 500));
  }
});
