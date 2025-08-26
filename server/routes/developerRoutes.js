const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDevelopers,
  getDeveloper,
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
  uploadDeveloperLogo
} = require('../controllers/developers');
const upload = require('../middleware/multer');
const advancedResults = require('../middleware/advancedResults');
const Developer = require('../models/Developer');
const {
  requireDeveloperAccess,
  requirePropertyManagement,
  requireMediaAccess
} = require('../middleware/subscriptionAccess');

router
  .route('/')
  .get(advancedResults(Developer), getDevelopers)
  .post([protect, authorize('admin', 'agent'), requireDeveloperAccess], createDeveloper);
router
  .route('/:id')
  .get(getDeveloper)
  .put([protect, authorize('admin', 'agent'), requireDeveloperAccess], updateDeveloper)
  .delete([protect, authorize('admin'), requireDeveloperAccess], deleteDeveloper);

// Logo upload route
router
  .route('/:id/logo')
  .put(
    [protect, authorize('admin', 'agent'), requireDeveloperAccess, requireMediaAccess],
    upload.single('logo'), // 'logo' should match the field name in FormData
    uploadDeveloperLogo
  );

module.exports = router;