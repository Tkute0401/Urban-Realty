const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// @desc    Get all saved searches
// @route   GET /api/v1/searches
// @access  Private
router.get('/', searchController.getSavedSearches);

// @desc    Get single saved search
// @route   GET /api/v1/searches/:id
// @access  Private
router.get('/:id', searchController.getSavedSearch);

// @desc    Create saved search
// @route   POST /api/v1/searches
// @access  Private
router.post('/', searchController.createSavedSearch);

// @desc    Update saved search
// @route   PUT /api/v1/searches/:id
// @access  Private
router.put('/:id', searchController.updateSavedSearch);

// @desc    Delete saved search
// @route   DELETE /api/v1/searches/:id
// @access  Private
router.delete('/:id', searchController.deleteSavedSearch);

// @desc    Get properties matching saved search
// @route   GET /api/v1/searches/:id/properties
// @access  Private
router.get('/:id/properties', searchController.getSearchProperties);

module.exports = router;

