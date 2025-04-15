const ContactRequest = require('../models/ContactRequest');
const Property = require('../models/Property');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');

// @desc    Create contact request
// @route   POST /api/v1/contacts
// @access  Private
exports.createContactRequest = asyncHandler(async (req, res, next) => {
  const { propertyId, message, contactMethod } = req.body;

  // Get property
  const property = await Property.findById(propertyId);
  if (!property) {
    return next(new ErrorResponse('Property not found', 404));
  }

  // Get agent
  const agent = await User.findById(property.agent);
  if (!agent || agent.role !== 'agent') {
    return next(new ErrorResponse('Agent not found', 404));
  }

  // Check for existing request
  const existingRequest = await ContactRequest.findOne({
    property: propertyId,
    user: req.user.id
  });

  if (existingRequest) {
    return next(new ErrorResponse('You already have an active request for this property', 400));
  }

  // Create contact request
  const contactRequest = await ContactRequest.create({
    property: propertyId,
    agent: agent._id,
    user: req.user.id,
    message,
    contactMethod
  });

  // Send notification email to agent
  const contactUrl = `${req.protocol}://${req.get('host')}/api/v1/contacts/${contactRequest._id}`;
  await sendEmail({
    email: agent.email,
    subject: 'New Property Inquiry',
    message: `You have a new inquiry for your property. View details: ${contactUrl}`
  });

  res.status(201).json({
    success: true,
    data: contactRequest
  });
});

// @desc    Get user's contact requests
// @route   GET /api/v1/contacts/myrequests
// @access  Private
exports.getMyContactRequests = asyncHandler(async (req, res, next) => {
  let query;
  
  if (req.user.role === 'agent') {
    query = { agent: req.user.id };
  } else {
    query = { user: req.user.id };
  }

  const contactRequests = await ContactRequest.find(query)
    .populate('property')
    .populate('user')
    .populate('agent');

  res.status(200).json({
    success: true,
    count: contactRequests.length,
    data: contactRequests
  });
});

// @desc    Get single contact request
// @route   GET /api/v1/contacts/:id
// @access  Private
exports.getContactRequest = asyncHandler(async (req, res, next) => {
  const contactRequest = await ContactRequest.findById(req.params.id)
    .populate('property')
    .populate('user')
    .populate('agent');

  if (!contactRequest) {
    return next(new ErrorResponse('Contact request not found', 404));
  }

  // Check authorization
  if (
    req.user.role !== 'admin' && 
    contactRequest.user._id.toString() !== req.user.id && 
    contactRequest.agent._id.toString() !== req.user.id
  ) {
    return next(new ErrorResponse('Not authorized to access this request', 401));
  }

  res.status(200).json({
    success: true,
    data: contactRequest
  });
});

// @desc    Update contact request status
// @route   PUT /api/v1/contacts/:id
// @access  Private
exports.updateContactRequest = asyncHandler(async (req, res, next) => {
  let contactRequest = await ContactRequest.findById(req.params.id);

  if (!contactRequest) {
    return next(new ErrorResponse('Contact request not found', 404));
  }

  // Check authorization
  if (
    req.user.role !== 'admin' && 
    contactRequest.agent._id.toString() !== req.user.id
  ) {
    return next(new ErrorResponse('Not authorized to update this request', 401));
  }

  // Update status
  contactRequest.status = req.body.status || contactRequest.status;
  contactRequest = await contactRequest.save();

  res.status(200).json({
    success: true,
    data: contactRequest
  });
});

// @desc    Delete contact request
// @route   DELETE /api/v1/contacts/:id
// @access  Private
exports.deleteContactRequest = asyncHandler(async (req, res, next) => {
  const contactRequest = await ContactRequest.findById(req.params.id);

  if (!contactRequest) {
    return next(new ErrorResponse('Contact request not found', 404));
  }

  // Check authorization
  if (
    req.user.role !== 'admin' && 
    contactRequest.user._id.toString() !== req.user.id
  ) {
    return next(new ErrorResponse('Not authorized to delete this request', 401));
  }

  await contactRequest.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});