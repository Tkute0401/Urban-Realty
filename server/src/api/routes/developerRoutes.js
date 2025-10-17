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
  getMyDeveloperProfile,
  getDeveloperDashboard,
  getDeveloperAnalytics,
  getDeveloperInquiries,
  updateDeveloperInquiry
} = require('../../../controllers/developers');
const upload = require('../middleware/multer');
const advancedResults = require('../middleware/advancedResults');
const parseFormData = require('../../../middleware/parseFormData');
const Developer = require('../../../models/Developer');

router
  .route('/')
  .get(advancedResults(Developer), getDevelopers)
  .post(protect, authorize('admin', 'agent', 'developer'), upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'teamPhotos', maxCount: 10 }
  ]), parseFormData, createDeveloper);

// Developer profile route for current user
router
  .route('/profile/me')
  .get(protect, authorize('developer'), getMyDeveloperProfile);

router
  .route('/:id')
  .get(getDeveloper)
  .put(protect, authorize('admin', 'agent', 'developer'), upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'teamPhotos', maxCount: 10 }
  ]), parseFormData, updateDeveloper)
  .delete(protect, authorize('admin'), deleteDeveloper);

// Logo upload route
router
  .route('/:id/logo')
  .put(
    protect,
    authorize('admin', 'agent', 'developer'),
    upload.single('logo'),
    uploadDeveloperLogo
  );

// Developer dashboard and analytics routes
router
  .route('/dashboard')
  .get(protect, authorize('developer'), getDeveloperDashboard);

router
  .route('/analytics')
  .get(protect, authorize('developer'), getDeveloperAnalytics);

router
  .route('/inquiries')
  .get(protect, authorize('developer'), getDeveloperInquiries);

router
  .route('/inquiries/:inquiryId')
  .put(protect, authorize('developer'), updateDeveloperInquiry);

module.exports = router;

