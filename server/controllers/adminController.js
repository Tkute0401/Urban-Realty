// server/controllers/adminController.js
const User = require('../models/User');
const Property = require('../models/Property');
const Contact = require('../models/Contact');
const ErrorResponse = require('../utils/errorResponse');

// Get dashboard stats
exports.getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalAgents, totalProperties, newContacts, totalRevenue] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'agent' }),
      Property.countDocuments(),
      Contact.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
      Property.aggregate([
        { $match: { status: 'Sold' } },
        { $group: { _id: null, total: { $sum: '$price' } } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalAgents,
        totalProperties,
        newContacts,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get all users with pagination
exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const query = search 
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const [users, total] = await Promise.all([
      User.find(query)
        .skip(skip)
        .limit(limit)
        .select('-password'),
      User.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      totalPages: Math.ceil(total / limit),
      users
    });
  } catch (err) {
    next(err);
  }
};

// Update user
exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, role, mobile } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, mobile },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return next(new ErrorResponse(`User not found with id ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(new ErrorResponse(`User not found with id ${req.params.id}`, 404));
    }

    // Delete user's properties if they were an agent
    if (user.role === 'agent') {
      await Property.deleteMany({ agent: user._id });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// Get all properties with pagination
exports.getProperties = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const query = search 
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { 'address.city': { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const [properties, total] = await Promise.all([
      Property.find(query)
        .skip(skip)
        .limit(limit)
        .populate('agent', 'name email mobile'),
      Property.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: properties.length,
      totalPages: Math.ceil(total / limit),
      properties
    });
  } catch (err) {
    next(err);
  }
};

// Update property
exports.updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('agent', 'name email mobile');

    if (!property) {
      return next(new ErrorResponse(`Property not found with id ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: property
    });
  } catch (err) {
    next(err);
  }
};

// Delete property
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return next(new ErrorResponse(`Property not found with id ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// Get all contacts with pagination
exports.getContacts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const query = search 
      ? {
          $or: [
            { 'user.name': { $regex: search, $options: 'i' } },
            { 'property.title': { $regex: search, $options: 'i' } },
            { message: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const [contacts, total] = await Promise.all([
      Contact.find(query)
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email mobile')
        .populate('property', 'title price')
        .populate('agent', 'name'),
      Contact.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: contacts.length,
      totalPages: Math.ceil(total / limit),
      contacts
    });
  } catch (err) {
    next(err);
  }
};

// Delete contact
exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return next(new ErrorResponse(`Contact not found with id ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};