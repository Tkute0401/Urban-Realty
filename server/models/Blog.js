const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Please add a blog title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: [true, 'Please add a blog excerpt'],
    maxlength: [500, 'Excerpt cannot be more than 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Please add blog content']
  },
  
  // Media
  featuredImage: {
    url: String,
    publicId: String,
    caption: String
  },
  
  // Author Information
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    default: 'Squarefooot Team'
  },
  
  // Categorization
  category: {
    type: String,
    enum: [
      'Buying Guide',
      'Selling Guide',
      'Investment',
      'Financing',
      'Market Trends',
      'Home Improvement',
      'Legal',
      'Tips & Tricks',
      'News',
      'Other'
    ],
    default: 'Other'
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // SEO Fields
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title should be 60 characters or less']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description should be 160 characters or less']
  },
  keywords: [{
    type: String,
    trim: true
  }],
  
  // Publishing
  publishedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Reading Time (calculated automatically)
  readingTime: {
    type: Number, // in minutes
    default: 0
  },
  
  // Statistics
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  
  // Social Sharing
  socialImage: {
    url: String,
    publicId: String
  }
}, {
  timestamps: true
});

// Generate slug from title before saving
BlogSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Calculate reading time (average reading speed: 200 words per minute)
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200);
  }
  
  next();
});

// Index for text search
BlogSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
BlogSchema.index({ slug: 1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ isPublished: 1, publishedAt: -1 });
BlogSchema.index({ isFeatured: 1 });

module.exports = mongoose.model('Blog', BlogSchema);

