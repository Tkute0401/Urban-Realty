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
    url: String,
    publicId: String
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
    name: String,
    description: String
  }]
  ,
  team: [{
    name: String,
    designation: String,
    image: {
      url: String,
      publicId: String
    }
  }],
  specializations: [{
    name: String,
    description: String
  }]
  ,
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
    name: String,
    year: Number,
    category: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Developer', DeveloperSchema);