const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const ContactRequest = require('../models/ContactRequest');
const Property = require('../models/Property');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @desc    Create contact request
// @route   POST /api/v1/properties/:propertyId/contact
// @access  Private
exports.createContactRequest = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.propertyId)
    .populate('agent', 'name email mobile');
  
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

  // Validate message for email/whatsapp
  if ((req.body.contactMethod === 'email' || req.body.contactMethod === 'whatsapp') && 
      (!req.body.message || req.body.message.trim().length < 10)) {
    return next(
      new ErrorResponse('Please provide a meaningful message (at least 10 characters)', 400)
    );
  }

  // Set default message if not provided
  const message = req.body.message || `Contact request via ${req.body.contactMethod}`;

  // Check for existing pending request from same user for same property
  const existingRequest = await ContactRequest.findOne({
    property: property._id,
    user: req.user.id,
    isCurrent: true,
    status: 'pending'
  });

  let contactRequest;

  if (existingRequest) {
    // Create a new version if different contact method or message
    if (existingRequest.contactMethod !== req.body.contactMethod || 
        existingRequest.message !== message) {
      
      contactRequest = await ContactRequest.create({
        property: property._id,
        agent: property.agent._id,
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
      // Return existing request if identical
      return res.status(200).json({
        success: true,
        data: existingRequest
      });
    }
  } else {
    // Create first request
    contactRequest = await ContactRequest.create({
      property: property._id,
      agent: property.agent._id,
      user: req.user.id,
      message: message,
      contactMethod: req.body.contactMethod
    });
  }

  // Populate the response data
  await contactRequest.populate([
    { path: 'property', select: 'title price' },
    { path: 'agent', select: 'name email mobile' },
    { path: 'user', select: 'name email mobile' }
  ]);

  // Send email notification if contact method is email
  if (req.body.contactMethod === 'email' && property.agent.email) {
    try {
      await sendEmail({
        email: property.agent.email,
        subject: `New Contact Request for ${property.title}`,
        message: `
          <h2>New Contact Request</h2>
          <p>You have a new contact request for your property: <strong>${property.title}</strong></p>
          <p><strong>From:</strong> ${req.user.name} (${req.user.email})</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <p>Price: ${property.price}</p>
          <p>Please respond to the user at your earliest convenience.</p>
        `
      });
    } catch (err) {
      console.error('Error sending email notification:', err);
      // Don't fail the request if email fails
    }
  }

  res.status(201).json({
    success: true,
    data: contactRequest
  });
});

// @desc    Get contact requests for agent
// @route   GET /api/v1/contacts/agent
// @access  Private/Agent
exports.getAgentContactRequests = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'agent') {
    return next(
      new ErrorResponse('Only agents can access contact requests', 403)
    );
  }

  // Filtering
  const filter = { agent: req.user.id, isCurrent: true };
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.contactMethod) {
    filter.contactMethod = req.query.contactMethod;
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  // Sorting
  const sortBy = req.query.sort ? req.query.sort.split(',').join(' ') : '-createdAt';

  const contacts = await ContactRequest.find(filter)
    .populate({
      path: 'previousVersions',
      select: 'message contactMethod status createdAt',
      options: { sort: { createdAt: -1 } }
    })
    .populate('property', 'title price images')
    .populate('user', 'name email mobile')
    .skip(skip)
    .limit(limit)
    .sort(sortBy);

  const total = await ContactRequest.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: contacts.length,
    total,
    pages: Math.ceil(total / limit),
    data: contacts
  });
});

// @desc    Get single contact request
// @route   GET /api/v1/contacts/:id
// @access  Private
exports.getContactRequest = asyncHandler(async (req, res, next) => {
  const contactRequest = await ContactRequest.findById(req.params.id)
    .populate({
      path: 'previousVersions',
      select: 'message contactMethod status createdAt',
      options: { sort: { createdAt: -1 } }
    })
    .populate('property', 'title price')
    .populate('agent', 'name email mobile')
    .populate('user', 'name email mobile');

  if (!contactRequest) {
    return next(
      new ErrorResponse(`Contact request not found with id of ${req.params.id}`, 404)
    );
  }

  // Check authorization
  if (contactRequest.agent._id.toString() !== req.user.id && 
      contactRequest.user._id.toString() !== req.user.id && 
      req.user.role !== 'admin') {
    return next(
      new ErrorResponse('Not authorized to access this contact request', 401)
    );
  }

  res.status(200).json({
    success: true,
    data: contactRequest
  });
});

// @desc    Update contact request status
// @route   PUT /api/v1/contacts/:id
// @access  Private/Agent
exports.updateContactRequest = asyncHandler(async (req, res, next) => {
  let contactRequest = await ContactRequest.findById(req.params.id)
    .populate('user', 'name email');

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

  // Validate status
  const validStatuses = ['pending', 'contacted', 'completed', 'spam'];
  if (!validStatuses.includes(req.body.status)) {
    return next(
      new ErrorResponse(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400)
    );
  }

  // Update contact request
  contactRequest.status = req.body.status;
  if (req.body.notes) {
    contactRequest.notes = req.body.notes;
  }
  contactRequest = await contactRequest.save();

  // Populate the response
  await contactRequest.populate([
    { path: 'property', select: 'title price' },
    { path: 'agent', select: 'name email mobile' },
    { path: 'user', select: 'name email mobile' }
  ]);

  // Send notification email if status changed to contacted
  if (req.body.status === 'contacted' && contactRequest.user.email) {
    try {
      await sendEmail({
        email: contactRequest.user.email,
        subject: `Regarding your interest in ${contactRequest.property.title}`,
        message: `
          <h2>Thank you for your interest</h2>
          <p>The agent has marked your request as contacted regarding:</p>
          <p><strong>Property:</strong> ${contactRequest.property.title}</p>
          <p><strong>Price:</strong> ${contactRequest.property.price}</p>
          ${req.body.notes ? `<p><strong>Agent Notes:</strong> ${req.body.notes}</p>` : ''}
          <p>Please expect to hear from the agent soon.</p>
        `
      });
    } catch (err) {
      console.error('Error sending status update email:', err);
    }
  }

  res.status(200).json({
    success: true,
    data: contactRequest
  });
});

// @desc    Get all contact requests (Admin)
// @route   GET /api/v1/admin/contacts
// @access  Private/Admin
exports.getAdminContactRequests = asyncHandler(async (req, res, next) => {
  // Filtering
  const filter = { isCurrent: true };
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.contactMethod) {
    filter.contactMethod = req.query.contactMethod;
  }
  if (req.query.agentId) {
    filter.agent = req.query.agentId;
  }
  if (req.query.userId) {
    filter.user = req.query.userId;
  }

  // Advanced filtering (greater than, less than, etc)
  let queryStr = JSON.stringify(filter);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const skip = (page - 1) * limit;

  // Sorting
  const sortBy = req.query.sort ? req.query.sort.split(',').join(' ') : '-createdAt';

  const contacts = await ContactRequest.find(JSON.parse(queryStr))
    .populate({
      path: 'previousVersions',
      select: 'message contactMethod status createdAt',
      options: { sort: { createdAt: -1 } }
    })
    .populate('property', 'title price')
    .populate('agent', 'name email mobile')
    .populate('user', 'name email mobile')
    .skip(skip)
    .limit(limit)
    .sort(sortBy);

  const total = await ContactRequest.countDocuments(JSON.parse(queryStr));

  res.status(200).json({
    success: true,
    count: contacts.length,
    total,
    pages: Math.ceil(total / limit),
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

// @desc    Get contact stats
// @route   GET /api/v1/contacts/stats
// @access  Private/Agent or Admin
exports.getContactStats = asyncHandler(async (req, res, next) => {
  let match = {};
  
  // For agents, only show their own stats
  if (req.user.role === 'agent') {
    match.agent = req.user.id;
  }

  const stats = await ContactRequest.aggregate([
    {
      $match: {
        ...match,
        isCurrent: true
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgResponseTime: { $avg: '$responseTime' }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$count' },
        statuses: { $push: { status: '$_id', count: '$count', avgResponseTime: '$avgResponseTime' } },
        byMethod: {
          $push: {
            $group: {
              _id: '$contactMethod',
              count: { $sum: 1 }
            }
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        total: 1,
        statuses: 1,
        byMethod: {
          $arrayToObject: {
            $map: {
              input: "$byMethod",
              as: "method",
              in: {
                k: "$$method._id",
                v: "$$method.count"
              }
            }
          }
        }
      }
    }
  ]);

  // Get recent activity
  const recentActivity = await ContactRequest.find({
    ...match,
    isCurrent: true
  })
    .sort('-updatedAt')
    .limit(5)
    .populate('property', 'title')
    .populate('user', 'name');

  const result = {
    total: stats[0]?.total || 0,
    byStatus: stats[0]?.statuses || [],
    byMethod: stats[0]?.byMethod || {},
    recentActivity
  };

  res.status(200).json({
    success: true,
    data: result
  });
});