const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogStats
} = require('../controllers/blogController');
const upload = require('../middleware/multer');
const parseFormData = require('../middleware/parseFormData');

// Public routes
router
  .route('/')
  .get(getBlogs)
  .post(
    protect,
    authorize('admin'),
    upload.fields([
      { name: 'featuredImage', maxCount: 1 },
      { name: 'socialImage', maxCount: 1 }
    ]),
    parseFormData,
    createBlog
  );

router
  .route('/stats')
  .get(protect, authorize('admin'), getBlogStats);

router
  .route('/:id')
  .get(getBlog)
  .put(
    protect,
    authorize('admin'),
    upload.fields([
      { name: 'featuredImage', maxCount: 1 },
      { name: 'socialImage', maxCount: 1 }
    ]),
    parseFormData,
    updateBlog
  )
  .delete(protect, authorize('admin'), deleteBlog);

module.exports = router;

