// server/controllers/inquiryController.js
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');
const User = require('../models/User');

// @desc    Create inquiry
// @route   POST /api/v1/inquiries
// @access  Public
exports.createInquiry = asyncHandler(async (req, res, next) => {
  const { name, email, phone, message, property, agent } = req.body;

  // Check if property exists
  const propertyExists = await Property.findById(property);
  if (!propertyExists) {
    return next(new ErrorResponse('Property not found', 404));
  }

  // Check if agent exists
  const agentExists = await User.findById(agent);
  if (!agentExists || agentExists.role !== 'agent') {
    return next(new ErrorResponse('Agent not found', 404));
  }

  const inquiry = await Inquiry.create({
    name,
    email,
    phone,
    message,
    property,
    agent
  });

  // Populate references for response
  await inquiry.populate('property', 'title');
  await inquiry.populate('agent', 'name');

  res.status(201).json({
    success: true,
    data: inquiry
  });
});

// @desc    Get logged in user's inquiries
// @route   GET /api/v1/inquiries/my-inquiries
// @access  Private
exports.getMyInquiries = asyncHandler(async (req, res, next) => {
  let query;
  
  if (req.user.role === 'agent') {
    query = { agent: req.user.id };
  } else {
    query = { email: req.user.email };
  }

  const inquiries = await Inquiry.find(query)
    .populate('property', 'title')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: inquiries.length,
    data: inquiries
  });
});

// @desc    Get single inquiry
// @route   GET /api/v1/inquiries/:id
// @access  Private
exports.getInquiry = asyncHandler(async (req, res, next) => {
  const inquiry = await Inquiry.findById(req.params.id)
    .populate('property', 'title')
    .populate('agent', 'name');

  if (!inquiry) {
    return next(new ErrorResponse('Inquiry not found', 404));
  }

  // Authorization check
  if (
    req.user.role !== 'admin' && 
    inquiry.agent._id.toString() !== req.user.id && 
    inquiry.email !== req.user.email
  ) {
    return next(new ErrorResponse('Not authorized to access this inquiry', 401));
  }

  // Mark as read if agent/admin is viewing
  if (req.user.role === 'agent' || req.user.role === 'admin') {
    inquiry.read = true;
    await inquiry.save();
  }

  res.status(200).json({
    success: true,
    data: inquiry
  });
});