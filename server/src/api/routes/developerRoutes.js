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
} = require('../../../controllers/developers');
const upload = require('../middleware/multer');
const advancedResults = require('../middleware/advancedResults');
const Developer = require('../../../models/Developer');

router
  .route('/')
  .get(advancedResults(Developer), getDevelopers)
  .post(protect, authorize('admin', 'agent', 'developer'), createDeveloper);
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
    upload.single('logo'),
    uploadDeveloperLogo
  );

module.exports = router;

