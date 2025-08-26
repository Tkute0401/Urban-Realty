const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const mediaController = require('../controllers/mediaController');
const upload = require('../middleware/multer');
const { requireMediaAccess } = require('../middleware/subscriptionAccess');

router.post(
  '/:entityType/:entityId',
  [protect, requireMediaAccess],
  upload.array('file'),
  mediaController.uploadMedia
);
router.get('/:entityType/:entityId', mediaController.getEntityMedia);
router.delete('/:id', [protect, requireMediaAccess], mediaController.deleteMedia);

module.exports = router;
