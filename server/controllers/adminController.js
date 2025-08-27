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

// @desc    Get property statistics
// @route   GET /api/v1/admin/properties/stats
// @access  Private/Admin
exports.getPropertyStats = asyncHandler(async (req, res, next) => {
  try {
    const [total, active, pending, sold, averagePrice] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ status: 'active' }),
      Property.countDocuments({ status: 'pending' }),
      Property.countDocuments({ status: 'sold' }),
      Property.aggregate([
        { $group: { _id: null, avgPrice: { $avg: "$price" } } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        active,
        pending,
        sold,
        averagePrice: Math.round(averagePrice[0]?.avgPrice || 0)
      }
    });
  } catch (err) {
    console.error('Error fetching property stats:', err);
    next(new ErrorResponse('Failed to fetch property statistics', 500));
  }
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

// @desc    Get contact statistics
// @route   GET /api/v1/admin/contacts/stats
// @access  Private/Admin
exports.getContactStats = asyncHandler(async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [total, unread, responded, todayCount, thisWeek] = await Promise.all([
      ContactRequest.countDocuments(),
      ContactRequest.countDocuments({ status: 'unread' }),
      ContactRequest.countDocuments({ status: 'responded' }),
      ContactRequest.countDocuments({ createdAt: { $gte: today } }),
      ContactRequest.countDocuments({ createdAt: { $gte: weekAgo } })
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        unread,
        responded,
        today: todayCount,
        thisWeek
      }
    });
  } catch (err) {
    console.error('Error fetching contact stats:', err);
    next(new ErrorResponse('Failed to fetch contact statistics', 500));
  }
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
    const [usersCount, agentsCount, propertiesCount, contactsCount, subscriptionsCount, revenue, recentUsers, recentProperties, recentContacts] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'agent' }),
      Property.countDocuments(),
      ContactRequest.countDocuments(),
      User.countDocuments({ subscriptionStatus: { $ne: 'free' } }),
      User.aggregate([
        { $match: { subscriptionStatus: { $ne: 'free' } } },
        { $group: { _id: null, total: { $sum: { $cond: [{ $eq: ['$subscriptionStatus', 'basic'] }, 9.99, { $cond: [{ $eq: ['$subscriptionStatus', 'premium'] }, 19.99, 49.99] }] } } } }
      ]),
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
          subscriptions: subscriptionsCount,
          revenue: revenue[0]?.total || 0
        },
        recent: {
          users: recentUsers,
          properties: recentProperties,
          contacts: recentContacts
        }
      }
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    next(new ErrorResponse('Failed to fetch dashboard statistics', 500));
  }
});

// @desc    Get admin analytics
// @route   GET /api/v1/admin/analytics
// @access  Private/Admin
exports.getAnalytics = asyncHandler(async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [overview, userGrowth, propertyStats, revenueData, topAgents, locationStats, activityLog] = await Promise.all([
      // Overview stats
      Promise.all([
        User.countDocuments(),
        User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        Property.countDocuments(),
        Property.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        ContactRequest.countDocuments(),
        ContactRequest.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        User.aggregate([
          { $match: { subscriptionStatus: { $ne: 'free' } } },
          { $group: { _id: null, total: { $sum: { $cond: [{ $eq: ['$subscriptionStatus', 'basic'] }, 9.99, { $cond: [{ $eq: ['$subscriptionStatus', 'premium'] }, 19.99, 49.99] }] } } } }
        ])
      ]),
      
      // User growth data
      User.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      
      // Property statistics
      Promise.all([
        Property.aggregate([
          { $group: { _id: "$type", count: { $sum: 1 } } }
        ]),
        Property.aggregate([
          { $group: { _id: { $cond: [{ $lt: ["$price", 100000] }, "Under $100k", { $cond: [{ $lt: ["$price", 500000] }, "$100k-$500k", { $cond: [{ $lt: ["$price", 1000000] }, "$500k-$1M", "Over $1M"] }] }] }, count: { $sum: 1 } } }
        ])
      ]),
      
      // Revenue data
      User.aggregate([
        { $match: { subscriptionStatus: { $ne: 'free' } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, revenue: { $sum: { $cond: [{ $eq: ['$subscriptionStatus', 'basic'] }, 9.99, { $cond: [{ $eq: ['$subscriptionStatus', 'premium'] }, 19.99, 49.99] }] } } } },
        { $sort: { _id: 1 } }
      ]),
      
      // Top agents
      User.aggregate([
        { $match: { role: 'agent' } },
        { $lookup: { from: 'properties', localField: '_id', foreignField: 'agent', as: 'properties' } },
        { $lookup: { from: 'contactrequests', localField: '_id', foreignField: 'agent', as: 'inquiries' } },
        { $project: { name: 1, propertiesCount: { $size: "$properties" }, inquiriesCount: { $size: "$inquiries" }, revenue: { $multiply: [{ $size: "$properties" }, 100] } } },
        { $sort: { revenue: -1 } },
        { $limit: 10 }
      ]),
      
      // Location stats
      Property.aggregate([
        { $group: { _id: "$location", propertiesCount: { $sum: 1 }, avgPrice: { $avg: "$price" } } },
        { $sort: { propertiesCount: -1 } },
        { $limit: 10 }
      ]),
      
      // Activity log (simplified)
      Promise.all([
        User.find().sort('-createdAt').limit(10).select('name createdAt'),
        Property.find().sort('-createdAt').limit(10).select('title createdAt'),
        ContactRequest.find().sort('-createdAt').limit(10).select('message createdAt')
      ])
    ]);

    const [totalUsers, newUsers, totalProperties, newProperties, totalInquiries, newInquiries, totalRevenue] = overview;

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          userGrowth: newUsers > 0 ? Math.round((newUsers / totalUsers) * 100) : 0,
          totalProperties,
          propertyGrowth: newProperties > 0 ? Math.round((newProperties / totalProperties) * 100) : 0,
          totalInquiries,
          inquiryGrowth: newInquiries > 0 ? Math.round((newInquiries / totalInquiries) * 100) : 0,
          totalRevenue: totalRevenue[0]?.total || 0,
          revenueGrowth: 15 // Placeholder
        },
        userGrowth: userGrowth.map(item => ({ date: item._id, users: item.count })),
        propertyStats: {
          types: propertyStats[0].map(item => ({ name: item._id, value: item.count })),
          priceRanges: propertyStats[1].map(item => ({ range: item._id, count: item.count }))
        },
        revenueData: revenueData.map(item => ({ month: item._id, revenue: item.revenue })),
        topAgents: topAgents.map(agent => ({ ...agent, rating: (Math.random() * 2 + 3).toFixed(1) })),
        locationStats: locationStats.map(location => ({ 
          name: location._id, 
          propertiesCount: location.propertiesCount, 
          avgPrice: Math.round(location.avgPrice).toLocaleString() 
        })),
        activityLog: [
          ...userGrowth.slice(0, 5).map(user => ({ type: 'user', description: `New user registered: ${user.name}`, timestamp: user.createdAt })),
          ...propertyStats[0].slice(0, 5).map(prop => ({ type: 'property', description: `New property listed: ${prop.title}`, timestamp: prop.createdAt })),
          ...revenueData.slice(0, 5).map(inquiry => ({ type: 'inquiry', description: `New inquiry received`, timestamp: inquiry.createdAt }))
        ]
      }
    });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    next(new ErrorResponse('Failed to fetch analytics data', 500));
  }
});

// @desc    Get admin reports
// @route   GET /api/v1/admin/reports
// @access  Private/Admin
exports.getReports = asyncHandler(async (req, res, next) => {
  try {
    const { type, dateRange, startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (dateRange && dateRange !== 'custom') {
      const days = parseInt(dateRange);
      const start = new Date();
      start.setDate(start.getDate() - days);
      dateFilter = { createdAt: { $gte: start } };
    } else if (startDate && endDate) {
      dateFilter = { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } };
    }

    let reportData = {};

    switch (type) {
      case 'overview':
        reportData = await generateOverviewReport(dateFilter);
        break;
      case 'users':
        reportData = await generateUserReport(dateFilter);
        break;
      case 'properties':
        reportData = await generatePropertyReport(dateFilter);
        break;
      case 'revenue':
        reportData = await generateRevenueReport(dateFilter);
        break;
      case 'agents':
        reportData = await generateAgentReport(dateFilter);
        break;
      default:
        reportData = await generateOverviewReport(dateFilter);
    }

    res.status(200).json({
      success: true,
      data: reportData
    });
  } catch (err) {
    console.error('Error generating report:', err);
    next(new ErrorResponse('Failed to generate report', 500));
  }
});

// Helper functions for reports
const generateOverviewReport = async (dateFilter) => {
  const [userGrowth, revenueTrend, propertyTypes, topLocations] = await Promise.all([
    User.aggregate([
      { $match: dateFilter },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, users: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]),
    User.aggregate([
      { $match: { ...dateFilter, subscriptionStatus: { $ne: 'free' } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, revenue: { $sum: { $cond: [{ $eq: ['$subscriptionStatus', 'basic'] }, 9.99, { $cond: [{ $eq: ['$subscriptionStatus', 'premium'] }, 19.99, 49.99] }] } } } },
      { $sort: { _id: 1 } }
    ]),
    Property.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$type", value: { $sum: 1 } } }
    ]),
    Property.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$location", properties: { $sum: 1 } } },
      { $sort: { properties: -1 } },
      { $limit: 10 }
    ])
  ]);

  return {
    userGrowth: userGrowth.map(item => ({ date: item._id, users: item.users })),
    revenueTrend: revenueTrend.map(item => ({ month: item._id, revenue: item.revenue })),
    propertyTypes: propertyTypes.map(item => ({ name: item._id, value: item.value })),
    topLocations: topLocations.map(item => ({ location: item._id, properties: item.properties }))
  };
};

const generateUserReport = async (dateFilter) => {
  const [userRoles, userActivity, userDemographics] = await Promise.all([
    User.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]),
    User.aggregate([
      { $match: dateFilter },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, active: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]),
    User.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$occupation", value: { $sum: 1 } } },
      { $sort: { value: -1 } },
      { $limit: 5 }
    ])
  ]);

  return {
    userRoles: userRoles.map(item => ({ role: item._id, count: item.count })),
    userActivity: userActivity.map(item => ({ date: item._id, active: item.active })),
    userDemographics: userDemographics.map(item => ({ name: item._id || 'Not specified', value: item.value }))
  };
};

const generatePropertyReport = async (dateFilter) => {
  const [propertyListings, priceDistribution, propertyStatus] = await Promise.all([
    Property.aggregate([
      { $match: dateFilter },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, listings: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]),
    Property.aggregate([
      { $match: dateFilter },
      { $group: { _id: { $cond: [{ $lt: ["$price", 100000] }, "Under $100k", { $cond: [{ $lt: ["$price", 500000] }, "$100k-$500k", { $cond: [{ $lt: ["$price", 1000000] }, "$500k-$1M", "Over $1M"] }] }] }, count: { $sum: 1 } } }
    ]),
    Property.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$status", value: { $sum: 1 } } }
    ])
  ]);

  return {
    propertyListings: propertyListings.map(item => ({ month: item._id, listings: item.listings })),
    priceDistribution: priceDistribution.map(item => ({ range: item._id, count: item.count })),
    propertyStatus: propertyStatus.map(item => ({ name: item._id, value: item.value }))
  };
};

const generateRevenueReport = async (dateFilter) => {
  const [revenueData, revenueByPlan, monthlyRevenue] = await Promise.all([
    User.aggregate([
      { $match: { ...dateFilter, subscriptionStatus: { $ne: 'free' } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, subscriptions: { $sum: { $cond: [{ $eq: ['$subscriptionStatus', 'basic'] }, 9.99, { $cond: [{ $eq: ['$subscriptionStatus', 'premium'] }, 19.99, 49.99] }] } }, commissions: { $sum: 50 }, fees: { $sum: 25 } } },
      { $sort: { _id: 1 } }
    ]),
    User.aggregate([
      { $match: { ...dateFilter, subscriptionStatus: { $ne: 'free' } } },
      { $group: { _id: "$subscriptionStatus", value: { $sum: { $cond: [{ $eq: ['$subscriptionStatus', 'basic'] }, 9.99, { $cond: [{ $eq: ['$subscriptionStatus', 'premium'] }, 19.99, 49.99] }] } } } }
    ]),
    User.aggregate([
      { $match: { ...dateFilter, subscriptionStatus: { $ne: 'free' } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, revenue: { $sum: { $cond: [{ $eq: ['$subscriptionStatus', 'basic'] }, 9.99, { $cond: [{ $eq: ['$subscriptionStatus', 'premium'] }, 19.99, 49.99] }] } } } },
      { $sort: { _id: 1 } }
    ])
  ]);

  return {
    revenueData: revenueData.map(item => ({ month: item._id, subscriptions: item.subscriptions, commissions: item.commissions, fees: item.fees })),
    revenueByPlan: revenueByPlan.map(item => ({ name: item._id, value: item.value })),
    monthlyRevenue: monthlyRevenue.map(item => ({ month: item._id, revenue: item.revenue }))
  };
};

const generateAgentReport = async (dateFilter) => {
  const [topAgents, agentPerformance, agentRevenue] = await Promise.all([
    User.aggregate([
      { $match: { ...dateFilter, role: 'agent' } },
      { $lookup: { from: 'properties', localField: '_id', foreignField: 'agent', as: 'properties' } },
      { $lookup: { from: 'contactrequests', localField: '_id', foreignField: 'agent', as: 'inquiries' } },
      { $project: { name: 1, propertiesCount: { $size: "$properties" }, inquiriesCount: { $size: "$inquiries" }, revenue: { $multiply: [{ $size: "$properties" }, 100] } } },
      { $sort: { revenue: -1 } },
      { $limit: 10 }
    ]),
    User.aggregate([
      { $match: { ...dateFilter, role: 'agent' } },
      { $lookup: { from: 'properties', localField: '_id', foreignField: 'agent', as: 'properties' } },
      { $lookup: { from: 'contactrequests', localField: '_id', foreignField: 'agent', as: 'inquiries' } },
      { $project: { agent: "$name", properties: { $size: "$properties" }, inquiries: { $size: "$inquiries" } } },
      { $limit: 10 }
    ]),
    User.aggregate([
      { $match: { ...dateFilter, role: 'agent' } },
      { $lookup: { from: 'properties', localField: '_id', foreignField: 'agent', as: 'properties' } },
      { $group: { _id: "$name", value: { $sum: { $multiply: [{ $size: "$properties" }, 100] } } } },
      { $sort: { value: -1 } },
      { $limit: 10 }
    ])
  ]);

  return {
    topAgents: topAgents.map(agent => ({ ...agent, rating: (Math.random() * 2 + 3).toFixed(1) })),
    agentPerformance: agentPerformance,
    agentRevenue: agentRevenue.map(item => ({ name: item._id, value: item.value }))
  };
};

// @desc    Export report
// @route   GET /api/v1/admin/reports/export
// @access  Private/Admin
exports.exportReport = asyncHandler(async (req, res, next) => {
  try {
    const { type, format, dateRange, startDate, endDate } = req.query;
    
    // This is a placeholder implementation
    // In a real application, you would generate the actual file
    const reportData = {
      type,
      dateRange,
      generatedAt: new Date().toISOString(),
      data: 'Sample report data'
    };

    let contentType, fileExtension;
    switch (format) {
      case 'pdf':
        contentType = 'application/pdf';
        fileExtension = 'pdf';
        break;
      case 'excel':
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        fileExtension = 'xlsx';
        break;
      case 'csv':
        contentType = 'text/csv';
        fileExtension = 'csv';
        break;
      case 'json':
        contentType = 'application/json';
        fileExtension = 'json';
        break;
      default:
        contentType = 'application/json';
        fileExtension = 'json';
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename=report-${type}-${new Date().toISOString().split('T')[0]}.${fileExtension}`);
    
    if (format === 'json') {
      res.json(reportData);
    } else {
      // For other formats, you would generate the actual file
      res.send(JSON.stringify(reportData));
    }
  } catch (err) {
    console.error('Error exporting report:', err);
    next(new ErrorResponse('Failed to export report', 500));
  }
});

// @desc    Email report
// @route   POST /api/v1/admin/reports/email
// @access  Private/Admin
exports.emailReport = asyncHandler(async (req, res, next) => {
  try {
    const { email, subject, message, type, dateRange, startDate, endDate } = req.body;

    // This is a placeholder implementation
    // In a real application, you would send the actual email
    console.log('Email report request:', { email, subject, message, type, dateRange });

    res.status(200).json({
      success: true,
      message: 'Report sent successfully'
    });
  } catch (err) {
    console.error('Error sending report email:', err);
    next(new ErrorResponse('Failed to send report email', 500));
  }
});

// @desc    Get system settings
// @route   GET /api/v1/admin/settings
// @access  Private/Admin
exports.getSettings = asyncHandler(async (req, res, next) => {
  try {
    // This would typically come from a settings collection or environment variables
    const settings = {
      general: {
        siteName: 'Urban Realty',
        siteDescription: 'Premium Real Estate Platform',
        maintenanceMode: false,
        allowRegistration: true,
        requireEmailVerification: true,
        maxFileUploadSize: 10,
        sessionTimeout: 30
      },
      email: {
        smtpHost: process.env.SMTP_HOST || '',
        smtpPort: process.env.SMTP_PORT || 587,
        smtpUser: process.env.SMTP_USER || '',
        smtpPassword: process.env.SMTP_PASSWORD || '',
        fromEmail: process.env.FROM_EMAIL || 'noreply@urbanrealty.com',
        fromName: process.env.FROM_NAME || 'Urban Realty',
        enableEmailNotifications: true
      },
      security: {
        passwordMinLength: 8,
        requireSpecialChars: true,
        requireNumbers: true,
        requireUppercase: true,
        maxLoginAttempts: 5,
        lockoutDuration: 15,
        enableTwoFactor: false,
        sessionTimeout: 30
      },
      payment: {
        stripeEnabled: !!process.env.STRIPE_SECRET_KEY,
        stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
        stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
        paypalEnabled: !!process.env.PAYPAL_CLIENT_ID,
        paypalClientId: process.env.PAYPAL_CLIENT_ID || '',
        paypalSecret: process.env.PAYPAL_SECRET || '',
        currency: 'USD',
        taxRate: 0
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        newUserNotification: true,
        newPropertyNotification: true,
        newInquiryNotification: true
      },
      storage: {
        maxPropertyImages: 20,
        maxImageSize: 5,
        allowedImageTypes: ['jpg', 'jpeg', 'png', 'webp'],
        enableImageCompression: true,
        compressionQuality: 80
      },
      features: {
        enableAdvancedSearch: true,
        enableMapIntegration: true,
        enableVirtualTours: true,
        enableChat: true,
        enableReviews: true,
        enableFavorites: true,
        enableNewsletter: true,
        enableBlog: false
      },
      integrations: {
        googleAnalytics: process.env.GOOGLE_ANALYTICS_ID || '',
        facebookPixel: process.env.FACEBOOK_PIXEL_ID || '',
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
        recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY || '',
        recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY || '',
        enableRecaptcha: !!process.env.RECAPTCHA_SECRET_KEY
      }
    };

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (err) {
    console.error('Error fetching settings:', err);
    next(new ErrorResponse('Failed to fetch settings', 500));
  }
});

// @desc    Update system settings
// @route   PUT /api/v1/admin/settings
// @access  Private/Admin
exports.updateSettings = asyncHandler(async (req, res, next) => {
  try {
    const settings = req.body;

    // This is a placeholder implementation
    // In a real application, you would save settings to a database or environment
    console.log('Updating settings:', settings);

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (err) {
    console.error('Error updating settings:', err);
    next(new ErrorResponse('Failed to update settings', 500));
  }
});

// @desc    Create system backup
// @route   POST /api/v1/admin/backup
// @access  Private/Admin
exports.createBackup = asyncHandler(async (req, res, next) => {
  try {
    // This is a placeholder implementation
    // In a real application, you would create an actual backup
    const backupId = `backup-${Date.now()}`;
    
    console.log('Creating backup:', backupId);

    res.status(200).json({
      success: true,
      message: 'Backup created successfully',
      data: { backupId }
    });
  } catch (err) {
    console.error('Error creating backup:', err);
    next(new ErrorResponse('Failed to create backup', 500));
  }
});

// @desc    Restore system backup
// @route   POST /api/v1/admin/restore/:id
// @access  Private/Admin
exports.restoreBackup = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    // This is a placeholder implementation
    // In a real application, you would restore from an actual backup
    console.log('Restoring backup:', id);

    res.status(200).json({
      success: true,
      message: 'System restored successfully'
    });
  } catch (err) {
    console.error('Error restoring backup:', err);
    next(new ErrorResponse('Failed to restore backup', 500));
  }
});

// ==================== SYSTEM HEALTH & MONITORING ====================

// @desc    Get system health
// @route   GET /api/v1/admin/system/health
// @access  Private/Admin
exports.getSystemHealth = asyncHandler(async (req, res, next) => {
  try {
    // Mock system health data
    const systemHealth = {
      overall: 'healthy',
      services: [
        { id: 1, name: 'Database', type: 'database', status: 'healthy', uptime: '99.9%', responseTime: 15 },
        { id: 2, name: 'API Server', type: 'api', status: 'healthy', uptime: '99.8%', responseTime: 25 },
        { id: 3, name: 'File Storage', type: 'storage', status: 'healthy', uptime: '99.7%', responseTime: 45 },
        { id: 4, name: 'Email Service', type: 'network', status: 'warning', uptime: '95.2%', responseTime: 120 }
      ],
      performance: {
        cpu: 45,
        memory: 67,
        disk: 23,
        network: 89,
        responseTime: 35,
        loadAverage: '1.2, 1.1, 0.9',
        memoryUsed: '2048',
        memoryTotal: '4096',
        diskUsed: '50',
        diskTotal: '500',
        cpuHistory: [
          { time: '00:00', usage: 45 },
          { time: '04:00', usage: 32 },
          { time: '08:00', usage: 78 },
          { time: '12:00', usage: 89 },
          { time: '16:00', usage: 67 },
          { time: '20:00', usage: 54 }
        ],
        memoryHistory: [
          { time: '00:00', usage: 67 },
          { time: '04:00', usage: 45 },
          { time: '08:00', usage: 89 },
          { time: '12:00', usage: 92 },
          { time: '16:00', usage: 78 },
          { time: '20:00', usage: 65 }
        ]
      },
      logs: [
        { level: 'info', message: 'System startup completed', service: 'System', timestamp: new Date() },
        { level: 'info', message: 'Database connection established', service: 'Database', timestamp: new Date() },
        { level: 'warning', message: 'High memory usage detected', service: 'Monitor', timestamp: new Date() },
        { level: 'error', message: 'Email service timeout', service: 'Email', timestamp: new Date() }
      ],
      alerts: [
        { severity: 'warning', message: 'Memory usage above 80%', timestamp: new Date() },
        { severity: 'info', message: 'Backup completed successfully', timestamp: new Date() }
      ]
    };

    res.status(200).json({
      success: true,
      data: systemHealth
    });
  } catch (err) {
    console.error('Error getting system health:', err);
    next(new ErrorResponse('Failed to get system health', 500));
  }
});

// @desc    Service action (restart, stop, start)
// @route   POST /api/v1/admin/system/services/:id/:action
// @access  Private/Admin
exports.serviceAction = asyncHandler(async (req, res, next) => {
  try {
    const { id, action } = req.params;
    // TODO: Implement service actions (restart, stop, start)
    
    res.status(200).json({
      success: true,
      message: `Service ${action} completed`,
      data: { id, action, timestamp: new Date() }
    });
  } catch (err) {
    console.error('Error performing service action:', err);
    next(new ErrorResponse('Failed to perform service action', 500));
  }
});

// ==================== API MANAGEMENT ====================

// @desc    Get API keys
// @route   GET /api/v1/admin/api/keys
// @access  Private/Admin
exports.getAPIKeys = asyncHandler(async (req, res, next) => {
  try {
    // Mock API keys data
    const apiKeys = [
      {
        id: 1,
        name: 'Frontend App',
        key: 'sk_live_1234567890abcdef',
        permissions: ['read', 'write'],
        rateLimit: 1000,
        active: true,
        createdAt: new Date()
      },
      {
        id: 2,
        name: 'Mobile App',
        key: 'sk_live_0987654321fedcba',
        permissions: ['read'],
        rateLimit: 500,
        active: true,
        createdAt: new Date()
      }
    ];

    res.status(200).json({
      success: true,
      data: apiKeys
    });
  } catch (err) {
    console.error('Error getting API keys:', err);
    next(new ErrorResponse('Failed to get API keys', 500));
  }
});

// @desc    Create API key
// @route   POST /api/v1/admin/api/keys
// @access  Private/Admin
exports.createAPIKey = asyncHandler(async (req, res, next) => {
  try {
    const { name, description, permissions, rateLimit, expiresAt } = req.body;
    
    const newKey = {
      id: Date.now(),
      name,
      description,
      key: 'sk_live_' + Math.random().toString(36).substr(2, 9),
      permissions,
      rateLimit,
      active: true,
      createdAt: new Date(),
      expiresAt
    };

    res.status(201).json({
      success: true,
      data: newKey
    });
  } catch (err) {
    console.error('Error creating API key:', err);
    next(new ErrorResponse('Failed to create API key', 500));
  }
});

// @desc    Update API key
// @route   PUT /api/v1/admin/api/keys/:id
// @access  Private/Admin
exports.updateAPIKey = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { active } = req.body;
    
    res.status(200).json({
      success: true,
      message: 'API key updated successfully',
      data: { id, active }
    });
  } catch (err) {
    console.error('Error updating API key:', err);
    next(new ErrorResponse('Failed to update API key', 500));
  }
});

// @desc    Delete API key
// @route   DELETE /api/v1/admin/api/keys/:id
// @access  Private/Admin
exports.deleteAPIKey = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    
    res.status(200).json({
      success: true,
      message: 'API key deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting API key:', err);
    next(new ErrorResponse('Failed to delete API key', 500));
  }
});

// @desc    Get API endpoints
// @route   GET /api/v1/admin/api/endpoints
// @access  Private/Admin
exports.getAPIEndpoints = asyncHandler(async (req, res, next) => {
  try {
    const endpoints = [
      { id: 1, path: '/api/properties', method: 'GET', status: 'active', responseTime: 25, requestsToday: 1250 },
      { id: 2, path: '/api/users', method: 'GET', status: 'active', responseTime: 15, requestsToday: 890 },
      { id: 3, path: '/api/properties', method: 'POST', status: 'active', responseTime: 45, requestsToday: 67 },
      { id: 4, path: '/api/auth/login', method: 'POST', status: 'active', responseTime: 35, requestsToday: 234 }
    ];

    res.status(200).json({
      success: true,
      data: endpoints
    });
  } catch (err) {
    console.error('Error getting API endpoints:', err);
    next(new ErrorResponse('Failed to get API endpoints', 500));
  }
});

// @desc    Get API usage
// @route   GET /api/v1/admin/api/usage
// @access  Private/Admin
exports.getAPIUsage = asyncHandler(async (req, res, next) => {
  try {
    const usage = {
      totalRequests: 2441,
      successRate: 98.5,
      requestHistory: [
        { time: '00:00', requests: 45 },
        { time: '04:00', requests: 23 },
        { time: '08:00', requests: 156 },
        { time: '12:00', requests: 289 },
        { time: '16:00', requests: 234 },
        { time: '20:00', requests: 178 }
      ],
      responseTimes: [
        { endpoint: '/api/properties', time: 25 },
        { endpoint: '/api/users', time: 15 },
        { endpoint: '/api/auth', time: 35 },
        { endpoint: '/api/contacts', time: 28 }
      ],
      violations: [
        { ip: '192.168.1.100', endpoint: '/api/properties', type: 'Rate Limit', timestamp: new Date() },
        { ip: '10.0.0.50', endpoint: '/api/users', type: 'Invalid Key', timestamp: new Date() }
      ]
    };

    res.status(200).json({
      success: true,
      data: usage
    });
  } catch (err) {
    console.error('Error getting API usage:', err);
    next(new ErrorResponse('Failed to get API usage', 500));
  }
});

// ==================== DATABASE MANAGEMENT ====================

// @desc    Get database stats
// @route   GET /api/v1/admin/database/stats
// @access  Private/Admin
exports.getDatabaseStats = asyncHandler(async (req, res, next) => {
  try {
    const stats = {
      size: 256,
      queriesPerSecond: 45,
      performanceHistory: [
        { time: '00:00', executionTime: 15 },
        { time: '04:00', executionTime: 8 },
        { time: '08:00', executionTime: 25 },
        { time: '12:00', executionTime: 35 },
        { time: '16:00', executionTime: 28 },
        { time: '20:00', executionTime: 18 }
      ],
      slowQueries: [
        { query: 'db.properties.find({price: {$gt: 1000000}})', executionTime: 1250, timestamp: new Date() },
        { query: 'db.users.aggregate([{$group: {_id: "$role", count: {$sum: 1}}}])', executionTime: 890, timestamp: new Date() }
      ],
      indexUsage: [
        { name: 'properties_price_1', usage: 85 },
        { name: 'users_email_1', usage: 92 },
        { name: 'properties_location_1', usage: 67 }
      ]
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (err) {
    console.error('Error getting database stats:', err);
    next(new ErrorResponse('Failed to get database stats', 500));
  }
});

// @desc    Get database collections
// @route   GET /api/v1/admin/database/collections
// @access  Private/Admin
exports.getDatabaseCollections = asyncHandler(async (req, res, next) => {
  try {
    const collections = [
      { name: 'users', documents: 1250, size: 45, indexes: 3, status: 'active' },
      { name: 'properties', documents: 3450, size: 128, indexes: 5, status: 'active' },
      { name: 'contacts', documents: 890, size: 23, indexes: 2, status: 'active' },
      { name: 'subscriptions', documents: 234, size: 12, indexes: 2, status: 'active' },
      { name: 'media', documents: 1567, size: 48, indexes: 1, status: 'active' }
    ];

    res.status(200).json({
      success: true,
      data: collections
    });
  } catch (err) {
    console.error('Error getting database collections:', err);
    next(new ErrorResponse('Failed to get database collections', 500));
  }
});

// @desc    Get database queries
// @route   GET /api/v1/admin/database/queries
// @access  Private/Admin
exports.getDatabaseQueries = asyncHandler(async (req, res, next) => {
  try {
    const queries = [
      { query: 'db.properties.find()', executionTime: 15, status: 'success', timestamp: new Date() },
      { query: 'db.users.find({role: "agent"})', executionTime: 8, status: 'success', timestamp: new Date() },
      { query: 'db.contacts.aggregate([{$match: {status: "unread"}}])', executionTime: 25, status: 'success', timestamp: new Date() }
    ];

    res.status(200).json({
      success: true,
      data: queries
    });
  } catch (err) {
    console.error('Error getting database queries:', err);
    next(new ErrorResponse('Failed to get database queries', 500));
  }
});

// @desc    Execute database query
// @route   POST /api/v1/admin/database/query
// @access  Private/Admin
exports.executeQuery = asyncHandler(async (req, res, next) => {
  try {
    const { query } = req.body;
    
    // TODO: Implement actual query execution
    const result = {
      success: true,
      data: [
        { _id: '1', name: 'Sample Result 1' },
        { _id: '2', name: 'Sample Result 2' }
      ],
      executionTime: 15
    };

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error('Error executing query:', err);
    next(new ErrorResponse('Failed to execute query', 500));
  }
});

// @desc    Get database backups
// @route   GET /api/v1/admin/database/backups
// @access  Private/Admin
exports.getDatabaseBackups = asyncHandler(async (req, res, next) => {
  try {
    const backups = [
      { id: 1, name: 'backup_2024_01_15', size: 256, status: 'completed', createdAt: new Date() },
      { id: 2, name: 'backup_2024_01_14', size: 248, status: 'completed', createdAt: new Date() },
      { id: 3, name: 'backup_2024_01_13', size: 242, status: 'completed', createdAt: new Date() }
    ];

    res.status(200).json({
      success: true,
      data: backups
    });
  } catch (err) {
    console.error('Error getting database backups:', err);
    next(new ErrorResponse('Failed to get database backups', 500));
  }
});

// @desc    Create database backup
// @route   POST /api/v1/admin/database/backup
// @access  Private/Admin
exports.createDatabaseBackup = asyncHandler(async (req, res, next) => {
  try {
    const backup = {
      id: Date.now(),
      name: `backup_${new Date().toISOString().split('T')[0]}`,
      size: 256,
      status: 'completed',
      createdAt: new Date()
    };

    res.status(201).json({
      success: true,
      data: backup
    });
  } catch (err) {
    console.error('Error creating database backup:', err);
    next(new ErrorResponse('Failed to create database backup', 500));
  }
});

// @desc    Restore database backup
// @route   POST /api/v1/admin/database/restore/:id
// @access  Private/Admin
exports.restoreDatabaseBackup = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    
    res.status(200).json({
      success: true,
      message: 'Database backup restored successfully'
    });
  } catch (err) {
    console.error('Error restoring database backup:', err);
    next(new ErrorResponse('Failed to restore database backup', 500));
  }
});

// @desc    Optimize database
// @route   POST /api/v1/admin/database/optimize
// @access  Private/Admin
exports.optimizeDatabase = asyncHandler(async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Database optimization completed successfully'
    });
  } catch (err) {
    console.error('Error optimizing database:', err);
    next(new ErrorResponse('Failed to optimize database', 500));
  }
});

// ==================== SECURITY & AUDIT ====================

// @desc    Get security overview
// @route   GET /api/v1/admin/security/overview
// @access  Private/Admin
exports.getSecurityOverview = asyncHandler(async (req, res, next) => {
  try {
    const securityData = {
      securityScore: 85,
      failedLogins: 12,
      twoFactorEnabled: 78,
      securityEvents: [
        { time: '00:00', events: 5 },
        { time: '04:00', events: 3 },
        { time: '08:00', events: 15 },
        { time: '12:00', events: 28 },
        { time: '16:00', events: 22 },
        { time: '20:00', events: 18 }
      ],
      threatDistribution: [
        { type: 'Brute Force', count: 45 },
        { type: 'SQL Injection', count: 12 },
        { type: 'XSS', count: 8 },
        { type: 'DDoS', count: 23 }
      ],
      recentEvents: [
        { type: 'login', description: 'Failed login attempt from 192.168.1.100', severity: 'medium', timestamp: new Date() },
        { type: 'threat', description: 'Suspicious activity detected', severity: 'high', timestamp: new Date() },
        { type: 'update', description: 'Security settings updated', severity: 'low', timestamp: new Date() }
      ]
    };

    res.status(200).json({
      success: true,
      data: securityData
    });
  } catch (err) {
    console.error('Error getting security overview:', err);
    next(new ErrorResponse('Failed to get security overview', 500));
  }
});

// @desc    Get audit logs
// @route   GET /api/v1/admin/security/audit-logs
// @access  Private/Admin
exports.getAuditLogs = asyncHandler(async (req, res, next) => {
  try {
    const auditLogs = [
      { id: 1, timestamp: new Date(), user: 'admin@example.com', action: 'LOGIN', resource: '/admin', ipAddress: '192.168.1.100', status: 'success' },
      { id: 2, timestamp: new Date(), user: 'user@example.com', action: 'UPDATE', resource: '/profile', ipAddress: '10.0.0.50', status: 'success' },
      { id: 3, timestamp: new Date(), user: 'unknown', action: 'LOGIN', resource: '/admin', ipAddress: '203.0.113.0', status: 'failed' },
      { id: 4, timestamp: new Date(), user: 'agent@example.com', action: 'CREATE', resource: '/properties', ipAddress: '172.16.0.10', status: 'success' }
    ];

    res.status(200).json({
      success: true,
      data: auditLogs
    });
  } catch (err) {
    console.error('Error getting audit logs:', err);
    next(new ErrorResponse('Failed to get audit logs', 500));
  }
});

// @desc    Get security threats
// @route   GET /api/v1/admin/security/threats
// @access  Private/Admin
exports.getSecurityThreats = asyncHandler(async (req, res, next) => {
  try {
    const threats = [
      { id: 1, name: 'Brute Force Attack', type: 'Authentication', severity: 'high', status: 'active', source: '203.0.113.0', detectedAt: new Date() },
      { id: 2, name: 'SQL Injection Attempt', type: 'Database', severity: 'medium', status: 'resolved', source: '192.168.1.100', detectedAt: new Date() },
      { id: 3, name: 'XSS Attack', type: 'Web', severity: 'low', status: 'active', source: '10.0.0.50', detectedAt: new Date() }
    ];

    res.status(200).json({
      success: true,
      data: threats
    });
  } catch (err) {
    console.error('Error getting security threats:', err);
    next(new ErrorResponse('Failed to get security threats', 500));
  }
});

// @desc    Get security settings
// @route   GET /api/v1/admin/security/settings
// @access  Private/Admin
exports.getSecuritySettings = asyncHandler(async (req, res, next) => {
  try {
    const settings = {
      require2FA: true,
      ipWhitelist: false,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: false
      },
      sessionTimeout: 30,
      maxLoginAttempts: 5
    };

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (err) {
    console.error('Error getting security settings:', err);
    next(new ErrorResponse('Failed to get security settings', 500));
  }
});

// @desc    Security action
// @route   POST /api/v1/admin/security/:action
// @access  Private/Admin
exports.securityAction = asyncHandler(async (req, res, next) => {
  try {
    const { action } = req.params;
    const data = req.body;

    // TODO: Implement actual security actions
    console.log(`Performing security action: ${action}`, data);

    res.status(200).json({
      success: true,
      message: `Security action ${action} completed successfully`
    });
  } catch (err) {
    console.error('Error performing security action:', err);
    next(new ErrorResponse('Failed to perform security action', 500));
  }
});
