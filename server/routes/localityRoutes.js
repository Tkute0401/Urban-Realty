const express = require('express');
const router = express.Router();
const localityController = require('../controllers/localityController');

// @desc    Get locality insights
// @route   GET /api/v1/locality/:city/:locality
// @access  Public
router.get('/:city/:locality', localityController.getLocalityInsights);

module.exports = router;



