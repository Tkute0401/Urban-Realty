const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Property = require('../models/Property');

// @desc    Get all cities and localities
// @route   GET /api/v1/cities
// @access  Public
exports.getCities = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit || '50', 10);

  try {
    // Get distinct cities from properties
    const cities = await Property.aggregate([
      {
        $match: {
          'address.city': { $exists: true, $ne: '' }
        }
      },
      {
        $group: {
          _id: '$address.city',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: limit
      },
      {
        $project: {
          _id: 0,
          city: '$_id',
          propertyCount: '$count'
        }
      }
    ]);

    // Get distinct localities from properties (popular ones)
    const localities = await Property.aggregate([
      {
        $match: {
          'address.locality': { $exists: true, $ne: '' }
        }
      },
      {
        $group: {
          _id: '$address.locality',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: limit * 2 // More localities than cities
      },
      {
        $project: {
          _id: 0,
          locality: '$_id',
          propertyCount: '$count'
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        cities,
        localities
      }
    });
  } catch (error) {
    console.error('Error fetching cities and localities:', error);
    // Return empty data instead of error to prevent 500
    res.status(200).json({
      success: true,
      data: {
        cities: [],
        localities: []
      }
    });
  }
});



