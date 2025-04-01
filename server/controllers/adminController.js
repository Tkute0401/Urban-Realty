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