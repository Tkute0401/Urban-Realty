const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const SavedSearch = require('../models/SavedSearch');
const Property = require('../models/Property');
const SearchAlertService = require('../services/SearchAlertService');

// @desc    Get all saved searches for user
// @route   GET /api/v1/searches
// @access  Private
exports.getSavedSearches = asyncHandler(async (req, res, next) => {
  const searches = await SavedSearch.find({ user: req.user.id })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: searches.length,
    data: searches
  });
});

// @desc    Get single saved search
// @route   GET /api/v1/searches/:id
// @access  Private
exports.getSavedSearch = asyncHandler(async (req, res, next) => {
  const search = await SavedSearch.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!search) {
    return next(new ErrorResponse('Saved search not found', 404));
  }

  res.status(200).json({
    success: true,
    data: search
  });
});

// @desc    Create saved search
// @route   POST /api/v1/searches
// @access  Private
exports.createSavedSearch = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const search = await SavedSearch.create(req.body);

  res.status(201).json({
    success: true,
    data: search
  });
});

// @desc    Update saved search
// @route   PUT /api/v1/searches/:id
// @access  Private
exports.updateSavedSearch = asyncHandler(async (req, res, next) => {
  let search = await SavedSearch.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!search) {
    return next(new ErrorResponse('Saved search not found', 404));
  }

  search = await SavedSearch.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: search
  });
});

// @desc    Delete saved search
// @route   DELETE /api/v1/searches/:id
// @access  Private
exports.deleteSavedSearch = asyncHandler(async (req, res, next) => {
  const search = await SavedSearch.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!search) {
    return next(new ErrorResponse('Saved search not found', 404));
  }

  await search.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get properties matching saved search
// @route   GET /api/v1/searches/:id/properties
// @access  Private
exports.getSearchProperties = asyncHandler(async (req, res, next) => {
  const search = await SavedSearch.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!search) {
    return next(new ErrorResponse('Saved search not found', 404));
  }

  // Build query from filters
  const query = Property.find(search.filters)
    .populate('agent', 'name email phone')
    .populate('developer', 'name logo');

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const skip = (page - 1) * limit;

  const total = await Property.countDocuments(search.filters);
  const properties = await query.skip(skip).limit(limit);

  // Update match count
  search.matchCount = total;
  await search.save();

  res.status(200).json({
    success: true,
    count: properties.length,
    pagination: {
      currentPage: page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalResults: total
    },
    data: properties
  });
});



