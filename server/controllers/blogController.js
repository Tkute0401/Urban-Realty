const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Blog = require('../models/Blog');
const { uploadImages, deleteFiles } = require('../services/fileUploadService');

// @desc    Get all blogs
// @route   GET /api/v1/blogs
// @access  Public
exports.getBlogs = asyncHandler(async (req, res, next) => {
  const { category, tag, search, isPublished, isFeatured, page = 1, limit = 10, sort = '-publishedAt' } = req.query;
  
  // Build query
  const query = {};
  
  // Only show published blogs for non-admin users
  if (req.user?.role !== 'admin') {
    query.isPublished = true;
  } else if (isPublished !== undefined) {
    query.isPublished = isPublished === 'true';
  }
  
  if (category) {
    query.category = category;
  }
  
  if (tag) {
    query.tags = { $in: [tag] };
  }
  
  if (isFeatured !== undefined) {
    query.isFeatured = isFeatured === 'true';
  }
  
  if (search) {
    query.$text = { $search: search };
  }
  
  // Pagination
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;
  
  // Execute query
  const blogs = await Blog.find(query)
    .populate('author', 'name email avatar')
    .sort(sort)
    .skip(skip)
    .limit(limitNum);
  
  const total = await Blog.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count: blogs.length,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    },
    data: blogs
  });
});

// @desc    Get single blog
// @route   GET /api/v1/blogs/:id
// @access  Public
exports.getBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findOne({
    $or: [
      { _id: req.params.id },
      { slug: req.params.id }
    ]
  }).populate('author', 'name email avatar');
  
  if (!blog) {
    return next(
      new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Only show published blogs to non-admin users
  if (req.user?.role !== 'admin' && !blog.isPublished) {
    return next(
      new ErrorResponse(`Blog not found`, 404)
    );
  }
  
  // Increment views
  blog.views += 1;
  await blog.save();
  
  res.status(200).json({
    success: true,
    data: blog
  });
});

// @desc    Create blog
// @route   POST /api/v1/blogs
// @access  Private (Admin)
exports.createBlog = asyncHandler(async (req, res, next) => {
  // Set author to current user
  req.body.author = req.user.id;
  req.body.authorName = req.user.name || 'Squarefooot Team';
  
  // Handle featured image upload
  if (req.files && req.files.featuredImage && req.files.featuredImage.length > 0) {
    const uploadResult = await uploadImages(req.files.featuredImage, 'blogs');
    if (uploadResult.success && uploadResult.data.length > 0) {
      req.body.featuredImage = {
        url: uploadResult.data[0].url,
        publicId: uploadResult.data[0].publicId
      };
    }
  }
  
  // Handle social image upload
  if (req.files && req.files.socialImage && req.files.socialImage.length > 0) {
    const uploadResult = await uploadImages(req.files.socialImage, 'blogs');
    if (uploadResult.success && uploadResult.data.length > 0) {
      req.body.socialImage = {
        url: uploadResult.data[0].url,
        publicId: uploadResult.data[0].publicId
      };
    }
  }
  
  // Generate slug if not provided
  if (!req.body.slug && req.body.title) {
    req.body.slug = req.body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Set published date if publishing
  if (req.body.isPublished && !req.body.publishedAt) {
    req.body.publishedAt = new Date();
  }
  
  const blog = await Blog.create(req.body);
  
  res.status(201).json({
    success: true,
    data: blog
  });
});

// @desc    Update blog
// @route   PUT /api/v1/blogs/:id
// @access  Private (Admin)
exports.updateBlog = asyncHandler(async (req, res, next) => {
  let blog = await Blog.findById(req.params.id);
  
  if (!blog) {
    return next(
      new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Handle featured image upload
  if (req.files && req.files.featuredImage && req.files.featuredImage.length > 0) {
    // Delete old image if exists
    if (blog.featuredImage?.publicId) {
      await deleteFiles([blog.featuredImage.publicId]);
    }
    
    const uploadResult = await uploadImages(req.files.featuredImage, 'blogs');
    if (uploadResult.success && uploadResult.data.length > 0) {
      req.body.featuredImage = {
        url: uploadResult.data[0].url,
        publicId: uploadResult.data[0].publicId
      };
    }
  }
  
  // Handle social image upload
  if (req.files && req.files.socialImage && req.files.socialImage.length > 0) {
    // Delete old image if exists
    if (blog.socialImage?.publicId) {
      await deleteFiles([blog.socialImage.publicId]);
    }
    
    const uploadResult = await uploadImages(req.files.socialImage, 'blogs');
    if (uploadResult.success && uploadResult.data.length > 0) {
      req.body.socialImage = {
        url: uploadResult.data[0].url,
        publicId: uploadResult.data[0].publicId
      };
    }
  }
  
  // Update slug if title changed
  if (req.body.title && req.body.title !== blog.title) {
    req.body.slug = req.body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Set published date if publishing for the first time
  if (req.body.isPublished && !blog.isPublished && !req.body.publishedAt) {
    req.body.publishedAt = new Date();
  }
  
  // Update updatedAt
  req.body.updatedAt = new Date();
  
  blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: blog
  });
});

// @desc    Delete blog
// @route   DELETE /api/v1/blogs/:id
// @access  Private (Admin)
exports.deleteBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  
  if (!blog) {
    return next(
      new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Delete associated images
  const publicIds = [];
  if (blog.featuredImage?.publicId) {
    publicIds.push(blog.featuredImage.publicId);
  }
  if (blog.socialImage?.publicId) {
    publicIds.push(blog.socialImage.publicId);
  }
  
  if (publicIds.length > 0) {
    await deleteFiles(publicIds);
  }
  
  await blog.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get blog statistics
// @route   GET /api/v1/blogs/stats
// @access  Private (Admin)
exports.getBlogStats = asyncHandler(async (req, res, next) => {
  const totalBlogs = await Blog.countDocuments();
  const publishedBlogs = await Blog.countDocuments({ isPublished: true });
  const draftBlogs = await Blog.countDocuments({ isPublished: false });
  const featuredBlogs = await Blog.countDocuments({ isFeatured: true });
  const totalViews = await Blog.aggregate([
    { $group: { _id: null, totalViews: { $sum: '$views' } } }
  ]);
  
  const blogsByCategory = await Blog.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      total: totalBlogs,
      published: publishedBlogs,
      drafts: draftBlogs,
      featured: featuredBlogs,
      totalViews: totalViews[0]?.totalViews || 0,
      byCategory: blogsByCategory
    }
  });
});

