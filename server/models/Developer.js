const mongoose = require('mongoose');

const DeveloperSchema = new mongoose.Schema({
  // User connection
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    default: null
  },
  name: {
    type: String,
    required: [true, 'Please add a developer name'],
    unique: true,
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  logo: {
    url: { type: String },
    publicId: { type: String }
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  foundedYear: {
    type: Number,
    min: [1800, 'Year must be after 1800']
  },
  headquarters: {
    city: String,
    state: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  completedProjects: {
    type: Number,
    default: 0
  },
  ongoingProjects: {
    type: Number,
    default: 0
  },
  upcomingProjects: {
    type: Number,
    default: 0
  },
  flagshipProjects: [{
    _id: false,
    name: { type: String },
    description: { type: String }
  }],
  team: [{
    _id: false,
    name: { type: String },
    designation: { type: String },
    image: {
      url: { type: String },
      publicId: { type: String }
    }
  }],
  specializations: [{
    _id: false,
    name: { type: String },
    description: { type: String }
  }],
  contact: {
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    phone: String
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String
  },
  awards: [{
    _id: false,
    name: { type: String },
    year: { type: Number },
    category: { type: String }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Delete existing model if it exists to prevent caching issues
if (mongoose.models.Developer) {
  delete mongoose.models.Developer;
}

module.exports = mongoose.model('Developer', DeveloperSchema);