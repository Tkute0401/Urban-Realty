
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const ContactRequest = require('../models/ContactRequest');
const Property = require('../models/Property');
const User = require('../models/User');

// @desc    Create contact request
// @route   POST /api/v1/properties/:propertyId/contact
// @access  Private
exports.createContactRequest = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.propertyId);
  
  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.propertyId}`, 404)
    );
  }

  // Validate contact method
  const validMethods = ['email', 'phone', 'whatsapp'];
  if (!validMethods.includes(req.body.contactMethod)) {
    return next(
      new ErrorResponse(`Invalid contact method. Must be one of: ${validMethods.join(', ')}`, 400)
    );
  }

  // Set default message if not provided
  const message = req.body.message || `Contact request via ${req.body.contactMethod}`;

  // Check for existing request
  const existingRequest = await ContactRequest.findOne({
    property: property._id,
    user: req.user.id,
    isCurrent: true
  });

  let contactRequest;

  if (existingRequest) {
    // Create a new version
    contactRequest = await ContactRequest.create({
      property: property._id,
      agent: property.agent,
      user: req.user.id,
      message: message,
      contactMethod: req.body.contactMethod,
      version: existingRequest.version + 1,
      previousVersions: [...existingRequest.previousVersions, existingRequest._id]
    });

    // Mark the old one as not current
    existingRequest.isCurrent = false;
    await existingRequest.save();
  } else {
    // Create first request
    contactRequest = await ContactRequest.create({
      property: property._id,
      agent: property.agent,
      user: req.user.id,
      message: message,
      contactMethod: req.body.contactMethod
    });
  }

  res.status(201).json({
    success: true,
    data: contactRequest
  });
});

// @desc    Get contact requests for agent
// @route   GET /api/v1/contacts
// @access  Private/Agent
exports.getAgentContactRequests = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'agent') {
    return next(
      new ErrorResponse('Only agents can access contact requests', 403)
    );
  }

  const contacts = await ContactRequest.find({ 
    agent: req.user.id,
    isCurrent: true
  })
    .populate({
      path: 'previousVersions',
      select: 'message contactMethod status createdAt',
      options: { sort: { createdAt: -1 } }
    })
    .populate('property', 'title price')
    .populate('user', 'name email mobile')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: contacts.length,
    data: contacts
  });
});

// @desc    Update contact request status
// @route   PUT /api/v1/contacts/:id
// @access  Private/Agent
exports.updateContactRequest = asyncHandler(async (req, res, next) => {
  let contactRequest = await ContactRequest.findById(req.params.id);

  if (!contactRequest) {
    return next(
      new ErrorResponse(`Contact request not found with id of ${req.params.id}`, 404)
    );
  }

  // Verify agent owns this contact request
  if (contactRequest.agent.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('Not authorized to update this contact request', 401)
    );
  }

  contactRequest = await ContactRequest.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  )
  .populate({
    path: 'previousVersions',
    select: 'message contactMethod status createdAt',
    options: { sort: { createdAt: -1 } }
  })
  .populate('property', 'title price')
  .populate('user', 'name email mobile');

  res.status(200).json({
    success: true,
    data: contactRequest
  });
});

// @desc    Get all contact requests (Admin)
// @route   GET /api/v1/admin/contacts
// @access  Private/Admin
exports.getContactRequests = asyncHandler(async (req, res, next) => {
  const contacts = await ContactRequest.find({
    isCurrent: true
  })
    .populate({
      path: 'previousVersions',
      select: 'message contactMethod status createdAt',
      options: { sort: { createdAt: -1 } }
    })
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

// @desc    Delete contact request (Admin)
// @route   DELETE /api/v1/admin/contacts/:id
// @access  Private/Admin
exports.deleteContactRequest = asyncHandler(async (req, res, next) => {
  const contactRequest = await ContactRequest.findById(req.params.id);

  if (!contactRequest) {
    return next(
      new ErrorResponse(`Contact request not found with id of ${req.params.id}`, 404)
    );
  }

  // If this is the current version, promote the most recent previous version
  if (contactRequest.isCurrent && contactRequest.previousVersions.length > 0) {
    const previousVersions = await ContactRequest.find({
      _id: { $in: contactRequest.previousVersions }
    }).sort({ createdAt: -1 });

    if (previousVersions.length > 0) {
      const newCurrent = previousVersions[0];
      newCurrent.isCurrent = true;
      newCurrent.previousVersions = previousVersions.slice(1).map(v => v._id);
      await newCurrent.save();
    }
  }

  await contactRequest.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Delete all contact requests (Admin)
