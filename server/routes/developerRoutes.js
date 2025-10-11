const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDevelopers,
  getDeveloper,
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
  uploadDeveloperLogo,
  getMyDeveloperProfile
} = require('../controllers/developers');
const upload = require('../middleware/multer');
const advancedResults = require('../middleware/advancedResults');
const Developer = require('../models/Developer');

router
  .route('/')
  .get(advancedResults(Developer), getDevelopers)
  .post(protect, authorize('admin', 'agent', 'developer'), createDeveloper);

// Developer profile route for current user
router
  .route('/profile/me')
  .get(protect, authorize('developer'), getMyDeveloperProfile);

router
  .route('/:id')
  .get(getDeveloper)
  .put(protect, authorize('admin', 'agent', 'developer'), updateDeveloper)
  .delete(protect, authorize('admin'), deleteDeveloper);

// Logo upload route
router
  .route('/:id/logo')
  .put(
    protect,
    authorize('admin', 'agent', 'developer'),
    upload.single('logo'), // 'logo' should match the field name in FormData
    uploadDeveloperLogo
  );

module.exports = router;