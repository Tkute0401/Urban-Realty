const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const LocalityService = require('../services/LocalityService');

// @desc    Get locality insights and analytics
// @route   GET /api/v1/locality/:city/:locality
// @access  Public
exports.getLocalityInsights = asyncHandler(async (req, res, next) => {
  const { city, locality } = req.params;

  if (!city || !locality) {
    return next(new ErrorResponse('City and locality are required', 400));
  }

  const stats = await LocalityService.getLocalityStats(city, locality);

  res.status(200).json({
    success: true,
    data: stats
  });
});



