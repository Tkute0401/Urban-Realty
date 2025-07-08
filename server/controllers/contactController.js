
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const ContactRequest = require('../models/ContactRequest');
const Property = require('../models/Property');
const User = require('../models/User');

// @desc    Create contact request
// @route   POST /api/v1/properties/:propertyId/contact
// @access  Private
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const ContactRequest = require('../models/ContactRequest');
const Property = require('../models/Property');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail'); // Assuming you have an email utility

// @desc    Create contact request
// @route   POST /api/v1/properties/:propertyId/contact
// @access  Private
exports.createContactRequest = asyncHandler(async (req, res, next) => {
  // 1. Validate property exists
  const property = await Property.findById(req.params.propertyId)
    .populate('agent', 'name email mobile phone whatsappNumber');
  
  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.propertyId}`, 404)
    );
  }

  // 2. Validate agent exists
  if (!property.agent) {
    return next(
      new ErrorResponse('This property has no assigned agent', 400)
    );
  }

  // 3. Validate contact method
  const validMethods = ['email', 'phone', 'whatsapp'];
  if (!validMethods.includes(req.body.contactMethod)) {
    return next(
      new ErrorResponse(`Invalid contact method. Must be one of: ${validMethods.join(', ')}`, 400)
    );
  }

  // 4. Validate contact details based on method
  const contactMethod = req.body.contactMethod;
  let contactDetails = {};

  switch(contactMethod) {
    case 'email':
      if (!property.agent.email) {
        return next(
          new ErrorResponse('Agent does not have an email registered', 400)
        );
      }
      contactDetails = {
        email: property.agent.email,
        subject: `Inquiry about ${property.title}`,
        message: req.body.message || `I'm interested in your property at ${property.address}`
      };
      break;

    case 'phone':
      if (!property.agent.mobile && !property.agent.phone) {
        return next(
          new ErrorResponse('Agent does not have a phone number registered', 400)
        );
      }
      contactDetails = {
        phone: property.agent.mobile || property.agent.phone
      };
      break;

    case 'whatsapp':
      const whatsappNumber = property.agent.whatsappNumber || property.agent.mobile;
      if (!whatsappNumber) {
        return next(
          new ErrorResponse('Agent does not have a WhatsApp number registered', 400)
        );
      }
      contactDetails = {
        whatsapp: whatsappNumber,
        message: req.body.message || `Hello, I'm interested in your property at ${property.address}`
      };
      break;
  }

  // 5. Check for existing request (versioning)
  const existingRequest = await ContactRequest.findOne({
    property: property._id,
    user: req.user.id,
    isCurrent: true
  });

  // 6. Create contact request record
  const contactData = {
    property: property._id,
    agent: property.agent._id,
    user: req.user.id,
    contactMethod,
    message: req.body.message || `Contact request via ${contactMethod}`,
    contactDetails,
    metadata: {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip
    }
  };

  let contactRequest;

  if (existingRequest) {
    // Versioning: Create new version and archive old one
    contactRequest = await ContactRequest.create({
      ...contactData,
      version: existingRequest.version + 1,
      previousVersions: [...existingRequest.previousVersions, existingRequest._id]
    });

    existingRequest.isCurrent = false;
    await existingRequest.save();
  } else {
    // First contact request
    contactRequest = await ContactRequest.create(contactData);
  }

  // 7. Handle the actual contact based on method
  try {
    switch(contactMethod) {
      case 'email':
        await sendEmail({
          email: contactDetails.email,
          subject: contactDetails.subject,
          message: contactDetails.message,
          template: 'property-inquiry',
          context: {
            property,
            user: req.user,
            message: contactDetails.message
          }
        });
        break;

      case 'whatsapp':
        // Frontend will handle opening WhatsApp
        contactRequest.whatsappLink = `https://wa.me/${contactDetails.whatsapp}?text=${encodeURIComponent(contactDetails.message)}`;
        break;

      case 'phone':
        // Frontend will handle phone call
        contactRequest.telLink = `tel:${contactDetails.phone}`;
        break;
    }
  } catch (err) {
    console.error(`Error processing ${contactMethod} contact:`, err);
    // Don't fail the request if the actual contact method fails
    // The record is still created for tracking purposes
  }

  // 8. Populate the response data
  await contactRequest.populate([
    { path: 'property', select: 'title price address' },
    { path: 'agent', select: 'name email mobile phone whatsappNumber' },
    { path: 'user', select: 'name email mobile' }
  ]);

  // 9. Return response with appropriate data
  res.status(201).json({
    success: true,
    data: {
      contactRequest,
      action: contactMethod === 'email' ? 'emailSent' : 
              contactMethod === 'whatsapp' ? 'whatsappLink' : 
              'telLink',
      link: contactMethod === 'whatsapp' ? contactRequest.whatsappLink :
            contactMethod === 'phone' ? contactRequest.telLink :
            null
    }
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
