const express = require('express');
const router = express.Router();
const blogController = require('../../../controllers/blogController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/multer');

console.log('🔧 Blog routes loaded');
console.log('🔧 Blog controller functions:', {
  getBlogs: typeof blogController.getBlogs,
  getBlog: typeof blogController.getBlog,
  createBlog: typeof blogController.createBlog,
  updateBlog: typeof blogController.updateBlog,
  deleteBlog: typeof blogController.deleteBlog
});

// @desc    Get all blogs
// @route   GET /api/v1/blogs
// @access  Public
router.get('/', blogController.getBlogs);

// @desc    Get single blog
// @route   GET /api/v1/blogs/:id
// @access  Public
router.get('/:id', blogController.getBlog);

// @desc    Create new blog
// @route   POST /api/v1/blogs
// @access  Private (Admin only)
router.post(
  '/',
  protect,
  authorize('admin'),
  upload.single('featuredImage'),
  blogController.createBlog
);

// @desc    Update blog
// @route   PUT /api/v1/blogs/:id
// @access  Private (Admin only)
router.put(
  '/:id',
  protect,
  authorize('admin'),
  upload.single('featuredImage'),
  blogController.updateBlog
);

// @desc    Delete blog
// @route   DELETE /api/v1/blogs/:id
// @access  Private (Admin only)
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  blogController.deleteBlog
);

module.exports = router;

