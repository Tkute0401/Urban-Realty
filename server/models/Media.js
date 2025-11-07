const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: true
  },
  mediaType: {
    type: String,
    required: true,
    enum: ['image', 'video', 'document']
  },
  width: Number,
  height: Number,
  duration: Number, // for videos
  format: String,
  size: Number, // file size in bytes
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  entityType: {
    type: String,
    required: false // Optional for admin media
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false // Optional for admin media
  },
  // Admin media fields
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  tags: [{
    type: String
  }],
  category: {
    type: String,
    default: 'general'
  },
  altText: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Media', MediaSchema);