const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const Property = require('../models/Property');
const ContactRequest = require('../models/ContactRequest');
const UserSubscription = require('../models/UserSubscription');
const Subscription = require('../models/Subscription');

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
  const agents = await User.find({ role: 'agent' })
    .select('-password')
    .sort('-createdAt');
  
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
  }).select('-password');
  
  if (!agent) {
    return next(
      new ErrorResponse(`Agent not found with id of ${req.params.id}`, 404)
    );
  }
  
  res.status(200).json({
    success: true,
    data: agent
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
          contacts: contactsCount
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

// @desc    Get comprehensive admin dashboard stats
// @route   GET /api/v1/admin/dashboard-stats
// @access  Private/Admin
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  try {
    // Basic counts
    const [usersCount, agentsCount, propertiesCount, contactsCount, subscriptionsCount] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'agent' }),
      Property.countDocuments(),
      ContactRequest.countDocuments(),
      UserSubscription.countDocuments({ status: 'active' })
    ]);

    // Pending verifications
    const pendingVerifications = await User.countDocuments({ 
      role: 'agent', 
      isVerified: false 
    });

    // Active listings (properties that are not sold/rented)
    const activeListings = await Property.countDocuments({ 
      status: { $in: ['available', 'for-sale', 'for-rent'] } 
    });

    // Revenue calculation
    const activeSubscriptions = await UserSubscription.find({ 
      status: 'active', 
      paymentStatus: 'paid' 
    }).populate('subscription');
    
    const monthlyRevenue = activeSubscriptions.reduce((total, sub) => {
      if (sub.billingCycle === 'monthly') {
        return total + sub.amount;
      } else {
        return total + (sub.amount / 12); // Convert yearly to monthly
      }
    }, 0);

    // Recent data
    const [recentUsers, recentProperties, recentContacts] = await Promise.all([
      User.find().sort('-createdAt').limit(5).select('name email role createdAt'),
      Property.find().sort('-createdAt').limit(5).populate('agent', 'name email').select('title price status createdAt'),
      ContactRequest.find().sort('-createdAt').limit(5)
        .populate('property', 'title')
        .populate('user', 'name email')
        .select('message createdAt')
    ]);

    // Analytics data
    const userGrowth = await generateUserGrowthData();
    const revenueData = await generateRevenueData();
    const propertyTrends = await generatePropertyTrends();
    const subscriptionDistribution = await generateSubscriptionDistribution();

    res.status(200).json({
      success: true,
      data: {
        counts: {
          users: usersCount,
          agents: agentsCount,
          properties: propertiesCount,
          contacts: contactsCount,
          subscriptions: subscriptionsCount,
          revenue: Math.round(monthlyRevenue),
          pendingVerifications,
          activeListings
        },
        recent: {
          users: recentUsers,
          properties: recentProperties,
          contacts: recentContacts
        },
        analytics: {
          userGrowth,
          revenueData,
          propertyTrends,
          subscriptionDistribution
        }
      }
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    next(new ErrorResponse('Failed to fetch dashboard statistics', 500));
  }
});

// Helper function to generate user growth data
const generateUserGrowthData = async () => {
  const months = [];
  const currentDate = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = date.toLocaleString('default', { month: 'short' });
    
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const totalUsers = await User.countDocuments({ createdAt: { $lte: endOfMonth } });
    const newUsers = await User.countDocuments({ 
      createdAt: { $gte: startOfMonth, $lte: endOfMonth } 
    });
    
    const previousMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    const previousMonthEnd = new Date(date.getFullYear(), date.getMonth(), 0);
    const previousTotal = await User.countDocuments({ createdAt: { $lte: previousMonthEnd } });
    
    const growth = previousTotal > 0 ? ((totalUsers - previousTotal) / previousTotal) * 100 : 0;
    
    months.push({
      month: monthName,
      users: totalUsers,
      newUsers,
      growth: Math.round(growth * 10) / 10
    });
  }
  
  return months;
};

// Helper function to generate revenue data
const generateRevenueData = async () => {
  const months = [];
  const currentDate = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = date.toLocaleString('default', { month: 'short' });
    
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const monthlySubscriptions = await UserSubscription.find({
      status: 'active',
      paymentStatus: 'paid',
      lastBillingDate: { $gte: startOfMonth, $lte: endOfMonth }
    }).populate('subscription');
    
    const revenue = monthlySubscriptions.reduce((total, sub) => {
      if (sub.billingCycle === 'monthly') {
        return total + sub.amount;
      } else {
        return total + (sub.amount / 12); // Convert yearly to monthly
      }
    }, 0);
    
    // Calculate growth (simplified)
    const growth = i === 11 ? 0 : Math.random() * 20 + 5; // Sample growth data
    
    months.push({
      month: monthName,
      revenue: Math.round(revenue),
      growth: Math.round(growth * 10) / 10
    });
  }
  
  return months;
};

// Helper function to generate property trends
const generatePropertyTrends = async () => {
  const propertyTypes = await Property.aggregate([
    { $group: { _id: '$type', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  const monthlyListings = [];
  const currentDate = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = date.toLocaleString('default', { month: 'short' });
    
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const newListings = await Property.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });
    
    const soldProperties = await Property.countDocuments({
      status: 'sold',
      updatedAt: { $gte: startOfMonth, $lte: endOfMonth }
    });
    
    const activeProperties = await Property.countDocuments({
      status: { $in: ['available', 'for-sale', 'for-rent'] },
      createdAt: { $lte: endOfMonth }
    });
    
    monthlyListings.push({
      month: monthName,
      new: newListings,
      sold: soldProperties,
      active: activeProperties
    });
  }

  // Generate price range distribution
  const priceRanges = [
    { range: '$0-100k', count: Math.floor(Math.random() * 50) + 50, percentage: 28 },
    { range: '$100k-250k', count: Math.floor(Math.random() * 80) + 80, percentage: 40 },
    { range: '$250k-500k', count: Math.floor(Math.random() * 40) + 40, percentage: 22 },
    { range: '$500k-1M', count: Math.floor(Math.random() * 20) + 10, percentage: 7 },
    { range: '$1M+', count: Math.floor(Math.random() * 15) + 5, percentage: 3 }
  ];

  return {
    propertyTypes: propertyTypes.map((type, index) => ({
      name: type._id || 'Other',
      value: type.count,
      color: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'][index] || '#8884d8'
    })),
    monthlyListings,
    priceRanges
  };
};

// Helper function to generate subscription distribution
const generateSubscriptionDistribution = async () => {
  const subscriptions = await UserSubscription.aggregate([
    { $match: { status: 'active' } },
    { $group: { _id: '$subscription', count: { $sum: 1 } } },
    { $lookup: { from: 'subscriptions', localField: '_id', foreignField: '_id', as: 'plan' } },
    { $unwind: '$plan' }
  ]);

  return subscriptions.map((sub, index) => ({
    name: sub.plan.name,
    value: sub.count,
    color: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'][index] || '#8884d8'
  }));
};
