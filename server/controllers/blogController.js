const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Blog = require('../models/Blog');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

// @desc    Get all blogs
// @route   GET /api/v1/blogs
// @access  Public
exports.getBlogs = asyncHandler(async (req, res, next) => {
  const {
    search,
    category,
    tag,
    slug,
    published,
    limit = 50,
    sort = '-createdAt',
    page = 1
  } = req.query;

  // Build query
  const query = {};

  // Filter by published status (default to published only for public)
  if (published !== undefined) {
    query.published = published === 'true';
  } else {
    // Default: only show published blogs for non-admin users
    const user = req.user;
    if (!user || user.role !== 'admin') {
      query.published = true;
    }
  }

  // Filter by slug
  if (slug) {
    query.slug = slug;
  }

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Filter by tag
  if (tag) {
    query.tags = { $in: [tag] };
  }

  // Search in title, excerpt, and content
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } }
    ];
  }

  // Pagination
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  // Execute query
  let blogs = Blog.find(query)
    .populate('author', 'name email avatar')
    .sort(sort)
    .skip(skip)
    .limit(limitNum);

  const results = await blogs;
  const total = await Blog.countDocuments(query);

  // Convert relative image URLs to absolute URLs
  const baseUrl = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.squarefooot.com';
  
  // Format response
  const formattedBlogs = results.map(blog => {
    let featuredImageUrl = blog.featuredImage;
    if (featuredImageUrl && !featuredImageUrl.startsWith('http')) {
      // It's a relative path, convert to absolute URL
      featuredImageUrl = `${baseUrl}${featuredImageUrl}`;
    }
    
    return {
      _id: blog._id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      featuredImage: featuredImageUrl,
      author: blog.author ? {
        _id: blog.author._id,
        name: blog.authorName || blog.author.name || 'Admin',
        avatar: blog.author.avatar
      } : {
        name: blog.authorName || 'Admin'
      },
      category: blog.category,
      tags: blog.tags,
      published: blog.published,
      publishedAt: blog.publishedAt,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
      seoTitle: blog.seoTitle,
      seoDescription: blog.seoDescription,
      metaKeywords: blog.metaKeywords,
      views: blog.views
    };
  });

  res.status(200).json({
    success: true,
    count: formattedBlogs.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: formattedBlogs
  });
});

// @desc    Get single blog
// @route   GET /api/v1/blogs/:id
// @access  Public
exports.getBlog = asyncHandler(async (req, res, next) => {
  // Support both MongoDB ID and slug lookups
  const identifier = req.params.id;
  console.log(`🔍 Fetching blog with identifier: ${identifier}`);
  
  let blog;
  
  // Check if it's a valid MongoDB ObjectId (24 hex characters)
  if (/^[0-9a-fA-F]{24}$/.test(identifier)) {
    blog = await Blog.findById(identifier).populate('author', 'name email avatar');
    console.log(`🔍 Blog lookup by ID: ${blog ? 'Found' : 'Not found'}`);
  } else {
    // Try slug lookup
    blog = await Blog.findOne({ slug: identifier }).populate('author', 'name email avatar');
    console.log(`🔍 Blog lookup by slug "${identifier}": ${blog ? 'Found' : 'Not found'}`);
    if (blog) {
      console.log(`🔍 Blog found - Published: ${blog.published}, Title: ${blog.title}`);
    }
  }

  if (!blog) {
    console.log(`❌ Blog not found with identifier: ${identifier}`);
    return next(new ErrorResponse(`Blog not found with id/slug of ${identifier}`, 404));
  }

  // Check if blog is published (unless user is admin)
  const user = req.user;
  if (!user || user.role !== 'admin') {
    if (!blog.published) {
      console.log(`❌ Blog "${identifier}" exists but is not published`);
      return next(new ErrorResponse(`Blog not found with id/slug of ${identifier}`, 404));
    }
  } else {
    console.log(`✅ Admin access - allowing unpublished blog: ${identifier}`);
  }

  // Increment views
  blog.views += 1;
  await blog.save();

  // Convert relative image URLs to absolute URLs
  let featuredImageUrl = blog.featuredImage;
  if (featuredImageUrl && !featuredImageUrl.startsWith('http')) {
    // It's a relative path, convert to absolute URL
    const baseUrl = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.squarefooot.com';
    featuredImageUrl = `${baseUrl}${featuredImageUrl}`;
  }

  res.status(200).json({
    success: true,
    data: {
      _id: blog._id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      featuredImage: featuredImageUrl,
      author: blog.author ? {
        _id: blog.author._id,
        name: blog.authorName || blog.author.name || 'Admin',
        avatar: blog.author.avatar
      } : {
        name: blog.authorName || 'Admin'
      },
      category: blog.category,
      tags: blog.tags,
      published: blog.published,
      publishedAt: blog.publishedAt,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
      seoTitle: blog.seoTitle,
      seoDescription: blog.seoDescription,
      metaKeywords: blog.metaKeywords,
      views: blog.views
    }
  });
});

// @desc    Create new blog
// @route   POST /api/v1/blogs
// @access  Private (Admin only)
exports.createBlog = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.author = req.user.id;
  req.body.authorName = req.user.name || 'Admin';

  // Handle featured image upload
  if (req.files && req.files.featuredImage) {
    const file = req.files.featuredImage;
    
    // Upload to Cloudinary if configured
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        const result = await cloudinary.uploader.upload(file.tempFilePath || file.path, {
          folder: 'blogs',
          resource_type: 'auto'
        });
        req.body.featuredImage = result.secure_url;
        
        // Delete temp file
        if (file.tempFilePath && fs.existsSync(file.tempFilePath)) {
          fs.unlinkSync(file.tempFilePath);
        }
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        return next(new ErrorResponse('Error uploading image', 500));
      }
    } else {
      // Fallback: save to local uploads directory
      const uploadsDir = path.join(__dirname, '../uploads/blogs');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadsDir, fileName);
      
      if (file.tempFilePath) {
        fs.renameSync(file.tempFilePath, filePath);
      } else if (file.path) {
        fs.copyFileSync(file.path, filePath);
      }
      
      req.body.featuredImage = `/uploads/blogs/${fileName}`;
    }
  }

  // Parse tags if string
  if (req.body.tags && typeof req.body.tags === 'string') {
    req.body.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
  }

  // Parse metaKeywords if string
  if (req.body.metaKeywords && typeof req.body.metaKeywords === 'string') {
    req.body.metaKeywords = req.body.metaKeywords.split(',').map(kw => kw.trim()).filter(kw => kw);
  }

  // Convert published to boolean if it's a string
  if (req.body.published !== undefined) {
    req.body.published = req.body.published === true || req.body.published === 'true';
  }

  // Set publishedAt if publishing
  if (req.body.published === true) {
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
// @access  Private (Admin only)
exports.updateBlog = asyncHandler(async (req, res, next) => {
  let blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404));
  }

  // Handle featured image upload or removal
  if (req.files && req.files.featuredImage) {
    const file = req.files.featuredImage;
    
    // Upload to Cloudinary if configured
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        // Delete old image if exists
        if (blog.featuredImage && blog.featuredImage.includes('cloudinary')) {
          const publicId = blog.featuredImage.split('/').slice(-2).join('/').split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        }
        
        const result = await cloudinary.uploader.upload(file.tempFilePath || file.path, {
          folder: 'blogs',
          resource_type: 'auto'
        });
        req.body.featuredImage = result.secure_url;
        
        // Delete temp file
        if (file.tempFilePath && fs.existsSync(file.tempFilePath)) {
          fs.unlinkSync(file.tempFilePath);
        }
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        return next(new ErrorResponse('Error uploading image', 500));
      }
    } else {
      // Fallback: save to local uploads directory
      const uploadsDir = path.join(__dirname, '../uploads/blogs');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      // Delete old local image if exists
      if (blog.featuredImage && blog.featuredImage.startsWith('/uploads/blogs/')) {
        const oldFilePath = path.join(__dirname, '..', blog.featuredImage);
        if (fs.existsSync(oldFilePath)) {
          try {
            fs.unlinkSync(oldFilePath);
          } catch (err) {
            console.warn('Could not delete old image file:', err);
          }
        }
      }
      
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadsDir, fileName);
      
      if (file.tempFilePath) {
        fs.renameSync(file.tempFilePath, filePath);
      } else if (file.path) {
        fs.copyFileSync(file.path, filePath);
      }
      
      req.body.featuredImage = `/uploads/blogs/${fileName}`;
    }
  } else if (req.body.clearFeaturedImage === 'true' || req.body.clearFeaturedImage === true) {
    // User wants to remove the featured image
    console.log('Clearing featured image for blog:', req.params.id);
    
    // Delete old image if exists
    if (blog.featuredImage) {
      if (blog.featuredImage.includes('cloudinary') && process.env.CLOUDINARY_CLOUD_NAME) {
        try {
          const publicId = blog.featuredImage.split('/').slice(-2).join('/').split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (error) {
          console.warn('Could not delete image from Cloudinary:', error);
        }
      } else if (blog.featuredImage.startsWith('/uploads/blogs/')) {
        const oldFilePath = path.join(__dirname, '..', blog.featuredImage);
        if (fs.existsSync(oldFilePath)) {
          try {
            fs.unlinkSync(oldFilePath);
          } catch (err) {
            console.warn('Could not delete old image file:', err);
          }
        }
      }
    }
    
    req.body.featuredImage = null;
  }
  // If no new file and no clear flag, featuredImage is not in req.body, so it will be preserved

  // Parse tags if string
  if (req.body.tags && typeof req.body.tags === 'string') {
    req.body.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
  }

  // Parse metaKeywords if string
  if (req.body.metaKeywords && typeof req.body.metaKeywords === 'string') {
    req.body.metaKeywords = req.body.metaKeywords.split(',').map(kw => kw.trim()).filter(kw => kw);
  }

  // Convert published to boolean if it's a string
  if (req.body.published !== undefined) {
    req.body.published = req.body.published === true || req.body.published === 'true';
  }

  // Set publishedAt if publishing for the first time
  if (req.body.published === true && !blog.publishedAt) {
    req.body.publishedAt = new Date();
  }

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
// @access  Private (Admin only)
exports.deleteBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404));
  }

  // Delete featured image from Cloudinary if exists
  if (blog.featuredImage && process.env.CLOUDINARY_CLOUD_NAME) {
    try {
      if (blog.featuredImage.includes('cloudinary')) {
        const publicId = blog.featuredImage.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
    }
  }

  await blog.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

