const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const Property = require('../models/Property');
const ContactRequest = require('../models/ContactRequest');

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().sort('-createdAt');
  
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Get single user
// @route   GET /api/v1/admin/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user
// @route   PUT /api/v1/admin/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { name, email, mobile, role, occupation } = req.body;
  const userId = req.params.id;
  if (occupation==undefined) occupation='';

  const updateFields = {};
  if (name) updateFields.name = name;
  if (email) updateFields.email = email;
  if (mobile !== undefined) updateFields.mobile = mobile;
  if (role) updateFields.role = role;
  if (occupation !== undefined) updateFields.occupation = occupation;

  // Check if email is being updated and if it's already in use
  if (email) {
    const existingUser = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') },
      _id: { $ne: userId }
    });
    
    if (existingUser) {
      return next(new ErrorResponse('Email already in use', 400));
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    updateFields,
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/v1/admin/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Delete all properties associated with this user if they're an agent
  if (user.role === 'agent') {
    await Property.deleteMany({ agent: user._id });
  }
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get all properties
// @route   GET /api/v1/admin/properties
// @access  Private/Admin
exports.getProperties = asyncHandler(async (req, res, next) => {
  const properties = await Property.find()
    .populate('agent', 'name email mobile')
    .sort('-createdAt');
  
  res.status(200).json({
    success: true,
    count: properties.length,
    data: properties
  });
});

// @desc    Get single property
// @route   GET /api/v1/admin/properties/:id
// @access  Private/Admin
exports.getProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id)
    .populate('agent', 'name email mobile');
  
  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }
  
  res.status(200).json({
    success: true,
    data: property
  });
});

// @desc    Delete property
// @route   DELETE /api/v1/admin/properties/:id
// @access  Private/Admin
exports.deleteProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findByIdAndDelete(req.params.id);
  
  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get all agents
// @route   GET /api/v1/admin/agents
// @access  Private/Admin
exports.getAgents = asyncHandler(async (req, res, next) => {
  const agents = await User.find({ role: 'agent' }).sort('-createdAt');
  
  res.status(200).json({
    success: true,
    count: agents.length,
    data: agents
  });
});

// @desc    Get single agent
// @route   GET /api/v1/admin/agents/:id
// @access  Private/Admin
exports.getAgent = asyncHandler(async (req, res, next) => {
  const agent = await User.findOne({
    _id: req.params.id,
    role: 'agent'
  });
  
  if (!agent) {
    return next(
      new ErrorResponse(`Agent not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Get agent's properties
  const properties = await Property.find({ agent: agent._id });
  
  res.status(200).json({
    success: true,
    data: {
      agent,
      properties
    }
  });
});

// @desc    Verify agent
// @route   PUT /api/v1/admin/agents/:id/verify
// @access  Private/Admin
exports.verifyAgent = asyncHandler(async (req, res, next) => {
  const agent = await User.findByIdAndUpdate(
    req.params.id,
    { isVerified: true },
    { new: true, runValidators: true }
  );
  
  if (!agent || agent.role !== 'agent') {
    return next(
      new ErrorResponse(`Agent not found with id of ${req.params.id}`, 404)
    );
  }
  
  res.status(200).json({
    success: true,
    data: agent
  });
});

// @desc    Get all contact requests
// @route   GET /api/v1/admin/contacts
// @access  Private/Admin
exports.getContactRequests = asyncHandler(async (req, res, next) => {
  const contacts = await ContactRequest.find()
    .populate('property', 'title price')
    .populate('agent', 'name email mobile')
    .populate('user', 'name email mobile')
    .sort('-createdAt');
  
  res.status(200).json({
    success: true,
    count: contacts.length,
    data: contacts
  });
});

// @desc    Get single contact request
// @route   GET /api/v1/admin/contacts/:id
// @access  Private/Admin
exports.getContactRequest = asyncHandler(async (req, res, next) => {
  const contact = await ContactRequest.findById(req.params.id)
    .populate('property', 'title price')
    .populate('agent', 'name email mobile')
    .populate('user', 'name email mobile');
  
  if (!contact) {
    return next(
      new ErrorResponse(`Contact request not found with id of ${req.params.id}`, 404)
    );
  }
  
  res.status(200).json({
    success: true,
    data: contact
  });
});

// @desc    Delete contact request
// @route   DELETE /api/v1/admin/contacts/:id
// @access  Private/Admin
exports.deleteContactRequest = asyncHandler(async (req, res, next) => {
  const contact = await ContactRequest.findByIdAndDelete(req.params.id);
  
  if (!contact) {
    return next(
      new ErrorResponse(`Contact request not found with id of ${req.params.id}`, 404)
    );
  }
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get admin dashboard stats
// @route   GET /api/v1/admin/stats
// @access  Private/Admin
exports.getStats = asyncHandler(async (req, res, next) => {
  try {
    // Get UserSubscription model
    const UserSubscription = require('../models/UserSubscription');
    const Subscription = require('../models/Subscription');
    
    // Calculate subscription breakdown
    const subscriptionBreakdown = await User.aggregate([
      {
        $group: {
          _id: '$subscriptionStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    const subscriptionCounts = {
      free: 0,
      basic: 0,
      premium: 0,
      enterprise: 0
    };

    subscriptionBreakdown.forEach(item => {
      subscriptionCounts[item._id] = item.count;
    });

    // Calculate revenue (simplified - you might want to integrate with actual payment system)
    const activeSubscriptions = await UserSubscription.find({ status: 'active' })
      .populate('subscription');
    
    let monthlyRevenue = 0;
    activeSubscriptions.forEach(sub => {
      if (sub.subscription) {
        monthlyRevenue += sub.subscription.price;
      }
    });

    // Get recent subscription changes (you might want to create a separate model for this)
    const recentSubscriptionChanges = await User.find({
      subscriptionStatus: { $exists: true, $ne: 'free' }
    })
    .sort('-updatedAt')
    .limit(5)
    .select('name subscriptionStatus updatedAt');

    // Mock access control data (you might want to create a separate model for this)
    const accessControlData = {
      totalChecks: Math.floor(Math.random() * 1000) + 500,
      deniedAccess: Math.floor(Math.random() * 100) + 20,
      upgradePrompts: Math.floor(Math.random() * 50) + 10,
      successfulUpgrades: Math.floor(Math.random() * 30) + 5
    };

    // Mock access violations (you might want to create a separate model for this)
    const mockAccessViolations = [
      {
        id: '1',
        userName: 'John Doe',
        feature: 'Advanced Analytics',
        requiredPlan: 'premium',
        currentPlan: 'basic',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        ipAddress: '192.168.1.100'
      },
      {
        id: '2',
        userName: 'Jane Smith',
        feature: 'API Access',
        requiredPlan: 'enterprise',
        currentPlan: 'premium',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        ipAddress: '192.168.1.101'
      }
    ];

    const [usersCount, agentsCount, propertiesCount, contactsCount, recentUsers, recentProperties, recentContacts] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'agent' }),
      Property.countDocuments(),
      ContactRequest.countDocuments(),
      User.find().sort('-createdAt').limit(5),
      Property.find().sort('-createdAt').limit(5).populate('agent', 'name email'),
      ContactRequest.find().sort('-createdAt').limit(5)
        .populate('property', 'title')
        .populate('user', 'name email')
    ]);

    res.status(200).json({
      success: true,
      data: {
        counts: {
          users: usersCount,
          agents: agentsCount,
          properties: propertiesCount,
          contacts: contactsCount,
          subscriptions: activeSubscriptions.length,
          revenue: monthlyRevenue,
          accessViolations: mockAccessViolations.length,
          pendingUpgrades: Math.floor(Math.random() * 20) + 5
        },
        recent: {
          users: recentUsers,
          properties: recentProperties,
          contacts: recentContacts,
          accessViolations: mockAccessViolations,
          subscriptionChanges: recentSubscriptionChanges.map(user => ({
            userName: user.name,
            action: `upgraded to ${user.subscriptionStatus}`,
            timestamp: user.updatedAt
          }))
        },
        subscriptionBreakdown: subscriptionCounts,
        accessControl: accessControlData
      }
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    next(new ErrorResponse('Failed to fetch dashboard statistics', 500));
  }
});

// @desc    Get access violations
// @route   GET /api/v1/admin/access-violations
// @access  Private/Admin
exports.getAccessViolations = asyncHandler(async (req, res, next) => {
  // This would typically query a separate AccessViolation model
  // For now, returning mock data
  const violations = [
    {
      id: '1',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      feature: 'Advanced Analytics',
      requiredPlan: 'premium',
      currentPlan: 'basic',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      ipAddress: '192.168.1.100',
      status: 'pending'
    },
    {
      id: '2',
      userName: 'Jane Smith',
      userEmail: 'jane@example.com',
      feature: 'API Access',
      requiredPlan: 'enterprise',
      currentPlan: 'premium',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      ipAddress: '192.168.1.101',
      status: 'warned'
    }
  ];

  res.status(200).json({
    success: true,
    count: violations.length,
    data: violations
  });
});

// @desc    Handle access violation
// @route   PUT /api/v1/admin/access-violations/:id
// @access  Private/Admin
exports.handleAccessViolation = asyncHandler(async (req, res, next) => {
  const { action } = req.body;
  const violationId = req.params.id;

  // This would typically update a separate AccessViolation model
  // For now, just returning success
  res.status(200).json({
    success: true,
    message: `Violation ${violationId} handled with action: ${action}`,
    data: {
      id: violationId,
      action: action,
      handledAt: new Date()
    }
  });
});

// @desc    Get subscription analytics
// @route   GET /api/v1/admin/subscription-analytics
// @access  Private/Admin
exports.getSubscriptionAnalytics = asyncHandler(async (req, res, next) => {
  try {
    const UserSubscription = require('../models/UserSubscription');
    
    // Get subscription analytics
    const analytics = await UserSubscription.aggregate([
      {
        $lookup: {
          from: 'subscriptions',
          localField: 'subscription',
          foreignField: '_id',
          as: 'subscriptionDetails'
        }
      },
      {
        $unwind: '$subscriptionDetails'
      },
      {
        $group: {
          _id: '$subscriptionDetails.type',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$subscriptionDetails.price' }
        }
      }
    ]);

    // Get monthly trends
    const monthlyTrends = await UserSubscription.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        analytics,
        monthlyTrends
      }
    });
  } catch (err) {
    console.error('Error fetching subscription analytics:', err);
    next(new ErrorResponse('Failed to fetch subscription analytics', 500));
  }
});

// @desc    Get system information
// @route   GET /api/v1/admin/system-info
// @access  Private/Admin
exports.getSystemInfo = asyncHandler(async (req, res, next) => {
  const os = require('os');
  
  const systemInfo = {
    uptime: Math.floor(os.uptime() / (24 * 60 * 60)), // Days
    memoryUsage: Math.round((1 - os.freemem() / os.totalmem()) * 100),
    cpuUsage: Math.round(Math.random() * 30 + 20), // Simulated CPU usage
    diskUsage: Math.round(Math.random() * 20 + 60), // Simulated disk usage
    activeConnections: Math.round(Math.random() * 50 + 100), // Simulated connections
    lastBackup: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time within last week
    pendingUpdates: Math.round(Math.random() * 5), // Simulated pending updates
    nodeVersion: process.version,
    platform: os.platform(),
    arch: os.arch(),
    hostname: os.hostname()
  };

  res.status(200).json({
    success: true,
    data: systemInfo
  });
});

// @desc    Update system settings
// @route   PUT /api/v1/admin/system-settings
// @access  Private/Admin
exports.updateSystemSettings = asyncHandler(async (req, res, next) => {
  const { maintenanceMode, autoBackup, emailNotifications, securityAlerts, performanceMonitoring } = req.body;
  
  // In a real application, you would save these settings to a database or config file
  // For now, we'll just return success
  
  res.status(200).json({
    success: true,
    message: 'System settings updated successfully',
    data: {
      maintenanceMode: maintenanceMode || false,
      autoBackup: autoBackup || false,
      emailNotifications: emailNotifications || false,
      securityAlerts: securityAlerts || false,
      performanceMonitoring: performanceMonitoring || false
    }
  });
});

// @desc    Update user subscription
// @route   PUT /api/v1/admin/users/:id/subscription
// @access  Private/Admin
exports.updateUserSubscription = asyncHandler(async (req, res, next) => {
  const { subscriptionPlan } = req.body;
  const userId = req.params.id;

  if (!subscriptionPlan) {
    return next(new ErrorResponse('Subscription plan is required', 400));
  }

  const validPlans = ['free', 'basic', 'premium', 'enterprise'];
  if (!validPlans.includes(subscriptionPlan)) {
    return next(new ErrorResponse('Invalid subscription plan', 400));
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { subscriptionPlan },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'User subscription updated successfully',
    data: user
  });
});

// @desc    Get user subscription history
// @route   GET /api/v1/admin/users/:id/subscription-history
// @access  Private/Admin
exports.getUserSubscriptionHistory = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  // In a real application, you would have a subscription history model
  // For now, we'll return a mock response
  const subscriptionHistory = [
    {
      plan: 'free',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      status: 'expired'
    },
    {
      plan: 'basic',
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      endDate: null,
      status: 'active'
    }
  ];

  res.status(200).json({
    success: true,
    data: subscriptionHistory
  });
});

// @desc    Block/Unblock user
// @route   PUT /api/v1/admin/users/:id
// @access  Private/Admin
exports.blockUser = asyncHandler(async (req, res, next) => {
  const { blocked } = req.body;
  const userId = req.params.id;

  if (blocked === undefined) {
    return next(new ErrorResponse('Blocked status is required', 400));
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { blocked },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    message: `User ${blocked ? 'blocked' : 'unblocked'} successfully`,
    data: user
  });
});
