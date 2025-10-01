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
    // Get real settings from environment variables and database
    const settings = {
      general: {
        siteName: process.env.SITE_NAME || 'Urban Realty',
        siteDescription: process.env.SITE_DESCRIPTION || 'Premium Real Estate Platform',
        maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
        allowRegistration: process.env.ALLOW_REGISTRATION !== 'false',
        requireEmailVerification: process.env.REQUIRE_EMAIL_VERIFICATION !== 'false',
        maxFileUploadSize: parseInt(process.env.MAX_FILE_UPLOAD_SIZE) || 10,
        sessionTimeout: parseInt(process.env.SESSION_TIMEOUT) || 30
      },
      email: {
        smtpHost: process.env.SMTP_HOST || '',
        smtpPort: parseInt(process.env.SMTP_PORT) || 587,
        smtpUser: process.env.SMTP_USER || '',
        smtpPassword: process.env.SMTP_PASSWORD || '',
        fromEmail: process.env.FROM_EMAIL || 'noreply@urbanrealty.com',
        fromName: process.env.FROM_NAME || 'Urban Realty',
        enableEmailNotifications: process.env.ENABLE_EMAIL_NOTIFICATIONS !== 'false'
      },
      security: {
        passwordMinLength: parseInt(process.env.PASSWORD_MIN_LENGTH) || 8,
        requireSpecialChars: process.env.REQUIRE_SPECIAL_CHARS !== 'false',
        requireNumbers: process.env.REQUIRE_NUMBERS !== 'false',
        requireUppercase: process.env.REQUIRE_UPPERCASE !== 'false',
        maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5,
        lockoutDuration: parseInt(process.env.LOCKOUT_DURATION) || 15,
        enableTwoFactor: process.env.ENABLE_TWO_FACTOR === 'true',
        sessionTimeout: parseInt(process.env.SESSION_TIMEOUT) || 30
      },
      payment: {
        stripeEnabled: !!process.env.STRIPE_PUBLISHABLE_KEY,
        stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
        stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
        paypalEnabled: !!process.env.PAYPAL_CLIENT_ID,
        paypalClientId: process.env.PAYPAL_CLIENT_ID || '',
        paypalSecret: process.env.PAYPAL_SECRET || '',
        currency: process.env.CURRENCY || 'USD',
        taxRate: parseFloat(process.env.TAX_RATE) || 0
      },
      notifications: {
        emailNotifications: process.env.ENABLE_EMAIL_NOTIFICATIONS !== 'false',
        pushNotifications: process.env.ENABLE_PUSH_NOTIFICATIONS !== 'false',
        smsNotifications: process.env.ENABLE_SMS_NOTIFICATIONS === 'true',
        newUserNotification: process.env.NEW_USER_NOTIFICATION !== 'false',
        newPropertyNotification: process.env.NEW_PROPERTY_NOTIFICATION !== 'false',
        newInquiryNotification: process.env.NEW_INQUIRY_NOTIFICATION !== 'false'
      },
      storage: {
        maxPropertyImages: parseInt(process.env.MAX_PROPERTY_IMAGES) || 20,
        maxImageSize: parseInt(process.env.MAX_IMAGE_SIZE) || 5,
        allowedImageTypes: (process.env.ALLOWED_IMAGE_TYPES || 'jpg,jpeg,png,webp').split(','),
        enableImageCompression: process.env.ENABLE_IMAGE_COMPRESSION !== 'false',
        compressionQuality: parseInt(process.env.COMPRESSION_QUALITY) || 80
      },
      features: {
        enableAdvancedSearch: process.env.ENABLE_ADVANCED_SEARCH !== 'false',
        enableMapIntegration: process.env.ENABLE_MAP_INTEGRATION !== 'false',
        enableVirtualTours: process.env.ENABLE_VIRTUAL_TOURS !== 'false',
        enableChat: process.env.ENABLE_CHAT !== 'false',
        enableReviews: process.env.ENABLE_REVIEWS !== 'false',
        enableFavorites: process.env.ENABLE_FAVORITES !== 'false',
        enableNewsletter: process.env.ENABLE_NEWSLETTER !== 'false',
        enableBlog: process.env.ENABLE_BLOG === 'true'
      },
      integrations: {
        googleAnalytics: process.env.GOOGLE_ANALYTICS_ID || '',
        facebookPixel: process.env.FACEBOOK_PIXEL_ID || '',
        mapplsApiKey: process.env.MAPPLS_API_KEY || '',
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

    // In a real application, you would save settings to a database or environment
    // For now, we'll log the changes and return success
    console.log('Updating settings:', settings);

    // Here you could:
    // 1. Save to a settings collection in MongoDB
    // 2. Update environment variables (requires server restart)
    // 3. Save to a configuration file
    // 4. Use a configuration management service

    // Example: Save to database (uncomment when you have a Settings model)
    // const Settings = require('../models/Settings');
    // await Settings.findOneAndUpdate({}, settings, { upsert: true, new: true });

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully. Some changes may require a server restart to take effect.',
      data: settings
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
    // In a real application, you would create an actual backup
    // For now, we'll simulate a backup creation process
    const backupId = `backup-${Date.now()}`;
    const backupDate = new Date();
    
    // Simulate backup process
    console.log('Creating backup:', backupId);
    
    // Here you could:
    // 1. Create a database dump
    // 2. Archive uploaded files
    // 3. Create configuration snapshots
    // 4. Upload to cloud storage (AWS S3, Google Cloud, etc.)
    
    const backupInfo = {
      id: backupId,
      createdAt: backupDate,
      size: '2.5 GB', // Simulated size
      type: 'full',
      status: 'completed',
      description: 'Complete system backup including database, files, and configurations',
      location: 'local-storage', // or 'cloud-storage'
      estimatedRestoreTime: '15-30 minutes'
    };

    res.status(200).json({
      success: true,
      message: 'Backup created successfully',
      data: backupInfo
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

    // In a real application, you would restore from an actual backup
    // For now, we'll simulate a restore process
    console.log('Restoring backup:', id);
    
    // Here you could:
    // 1. Validate backup integrity
    // 2. Stop running services
    // 3. Restore database from dump
    // 4. Restore files from archive
    // 5. Restore configurations
    // 6. Restart services
    
    const restoreInfo = {
      backupId: id,
      restoredAt: new Date(),
      status: 'completed',
      duration: '18 minutes',
      restoredItems: [
        'Database collections',
        'User uploads',
        'System configurations',
        'Application files'
      ],
      warnings: [],
      nextSteps: [
        'Verify system functionality',
        'Check data integrity',
        'Monitor system performance',
        'Update any external integrations if needed'
      ]
    };

    res.status(200).json({
      success: true,
      message: 'System restored successfully',
      data: restoreInfo
    });
  } catch (err) {
    console.error('Error restoring backup:', err);
    next(new ErrorResponse('Failed to restore backup', 500));
  }
});

// @desc    Get subscription analytics
// @route   GET /api/v1/admin/subscription-analytics
// @access  Private/Admin
exports.getSubscriptionAnalytics = asyncHandler(async (req, res, next) => {
  try {
    // Get subscription data from database
    const Subscription = require('../models/Subscription');
    const User = require('../models/User');

    // Get all subscriptions
    const subscriptions = await Subscription.find().populate('user plan');
    
    // Get all users
    const users = await User.find();

    // Calculate analytics
    const totalSubscribers = subscriptions.length;
    const activeSubscribers = subscriptions.filter(sub => sub.status === 'active').length;
    
    // Calculate monthly revenue (assuming monthly billing cycle)
    const monthlyRevenue = subscriptions
      .filter(sub => sub.status === 'active' && sub.billingCycle === 'monthly')
      .reduce((total, sub) => total + (sub.plan?.price || 0), 0);
    
    // Calculate yearly revenue
    const yearlyRevenue = subscriptions
      .filter(sub => sub.status === 'active' && sub.billingCycle === 'yearly')
      .reduce((total, sub) => total + (sub.plan?.price || 0), 0);
    
    // Convert yearly to monthly equivalent for comparison
    const yearlyMonthlyEquivalent = yearlyRevenue / 12;
    const totalMonthlyRevenue = monthlyRevenue + yearlyMonthlyEquivalent;
    
    // Calculate revenue growth (placeholder - in real app, compare with previous month)
    const revenueGrowth = 5.2; // Placeholder growth percentage
    
    // Get active plans count
    const activePlans = await Subscription.distinct('plan');
    const planTypes = activePlans.length;
    
    // Calculate churn rate (placeholder - in real app, calculate based on cancelled subscriptions)
    const churnRate = 2.1; // Placeholder churn percentage
    
    // Plan distribution
    const planDistribution = await Subscription.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$plan', count: { $sum: 1 } } },
      { $lookup: { from: 'subscriptions', localField: '_id', foreignField: 'plan', as: 'planDetails' } }
    ]);
    
    const totalActive = planDistribution.reduce((sum, plan) => sum + plan.count, 0);
    const planDistributionWithPercentage = planDistribution.map(plan => ({
      name: plan.planDetails[0]?.name || 'Unknown Plan',
      subscribers: plan.count,
      percentage: totalActive > 0 ? Math.round((plan.count / totalActive) * 100) : 0
    }));
    
    // Status distribution
    const statusDistribution = await Subscription.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const totalSubs = statusDistribution.reduce((sum, status) => sum + status.count, 0);
    const statusDistributionWithPercentage = statusDistribution.map(status => ({
      status: status._id,
      count: status.count,
      percentage: totalSubs > 0 ? Math.round((status.count / totalSubs) * 100) : 0
    }));
    
    // Recent subscriptions
    const recentSubscriptions = subscriptions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(sub => ({
        _id: sub._id,
        user: {
          name: sub.user?.name || 'Unknown User',
          email: sub.user?.email || 'No email'
        },
        plan: {
          name: sub.plan?.name || 'Unknown Plan'
        },
        amount: sub.plan?.price || 0,
        currency: 'USD',
        status: sub.status,
        createdAt: sub.createdAt
      }));

    const analytics = {
      totalSubscribers,
      activeSubscribers,
      monthlyRevenue: Math.round(totalMonthlyRevenue * 100) / 100,
      revenueGrowth,
      activePlans: planTypes,
      planTypes,
      churnRate,
      planDistribution: planDistributionWithPercentage,
      statusDistribution: statusDistributionWithPercentage,
      recentSubscriptions
    };

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (err) {
    console.error('Error fetching subscription analytics:', err);
    next(new ErrorResponse('Failed to fetch subscription analytics', 500));
  }
});

// @desc    Get all media
// @route   GET /api/v1/admin/media
// @access  Private/Admin
exports.getMedia = asyncHandler(async (req, res, next) => {
  try {
    const Media = require('../models/Media');
    const media = await Media.find()
      .populate('entity', 'title')
      .populate('uploadedBy', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: media.length,
      data: media
    });
  } catch (err) {
    console.error('Error fetching media:', err);
    next(new ErrorResponse('Failed to fetch media', 500));
  }
});