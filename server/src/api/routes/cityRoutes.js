const express = require('express');
const router = express.Router();
const cityController = require('../../../controllers/cityController');

// @desc    Get all cities and localities
// @route   GET /api/v1/cities
// @access  Public
router.get('/', cityController.getCities);

module.exports = router;

