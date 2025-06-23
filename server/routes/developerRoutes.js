const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults'); // Add this line
const Developer = require('../models/Developer'); // Add this line
const {
  getDevelopers,
  getDeveloper,
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
  uploadDeveloperLogo
} = require('../controllers/developers');

const router = express.Router();

router.route('/')
  .get(advancedResults(Developer), getDevelopers) // Add advancedResults middleware
  .post(protect, authorize('admin', 'agent'), createDeveloper);

router.route('/:id')
  .get(getDeveloper)
  .put(protect, authorize('admin', 'agent'), updateDeveloper)
  .delete(protect, authorize('admin'), deleteDeveloper);

router.route('/:id/logo')
  .put(protect, authorize('admin', 'agent'), uploadDeveloperLogo);

module.exports = router;