const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  // Developer connection
  developer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Developer',
    required: [true, 'Please specify the developer']
  },
  
  // Project basic information
  name: {
    type: String,
    required: [true, 'Please add a project name'],
    trim: true,
    maxlength: [200, 'Project name cannot be more than 200 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Please add a project description'],
    maxlength: [5000, 'Description cannot be more than 5000 characters']
  },
  
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot be more than 500 characters']
  },
  
  // Project type and status
  type: {
    type: String,
    required: [true, 'Please specify project type'],
    enum: ['Residential', 'Commercial', 'Mixed-Use', 'Industrial', 'Hospitality', 'Retail', 'Office', 'Other'],
    default: 'Residential'
  },
  
  status: {
    type: String,
    required: [true, 'Please specify project status'],
    enum: ['Planning', 'Under Construction', 'Completed', 'On Hold', 'Cancelled'],
    default: 'Planning'
  },
  
  // Project details
  totalUnits: {
    type: Number,
    min: [1, 'Total units must be at least 1']
  },
  
  totalArea: {
    type: Number,
    min: [1, 'Total area must be at least 1 sq ft']
  },
  
  unitTypes: [{
    _id: false,
    type: {
      type: String,
      enum: ['1BHK', '2BHK', '3BHK', '4BHK', '5BHK', 'Studio', 'Penthouse', 'Villa', 'Duplex', 'Other']
    },
    count: { type: Number },
    area: { type: Number },
    priceRange: {
      min: { type: Number },
      max: { type: Number }
    }
  }],

  // Project configurations (e.g., 2BHK, 3BHK with different prices, areas, etc.)
  configurations: [{
    _id: false,
    name: {
      type: String,
      required: [true, 'Configuration name is required'],
      trim: true,
      maxlength: [50, 'Configuration name cannot be more than 50 characters']
    },
    type: {
      type: String,
      required: [true, 'Configuration type is required'],
      enum: ['1BHK', '2BHK', '3BHK', '4BHK', '5BHK', 'Studio', 'Penthouse', 'Villa', 'Duplex', 'Other']
    },
    bedrooms: {
      type: Number,
      required: [true, 'Number of bedrooms is required'],
      min: [0, 'Bedrooms cannot be negative']
    },
    bathrooms: {
      type: Number,
      required: [true, 'Number of bathrooms is required'],
      min: [0, 'Bathrooms cannot be negative']
    },
    area: {
      type: Number,
      required: [true, 'Area is required'],
      min: [1, 'Area must be at least 1 sq ft']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    pricePerSqFt: {
      type: Number,
      min: [0, 'Price per sq ft cannot be negative']
    },
    floorPlan: {
      url: { type: String },
      publicId: { type: String },
      caption: { type: String }
    },
    description: {
      type: String,
      maxlength: [500, 'Configuration description cannot be more than 500 characters']
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    unitsAvailable: {
      type: Number,
      min: [0, 'Units available cannot be negative']
    }
  }],
  
  // Location information
  location: {
    address: {
      type: String,
      required: [true, 'Please add project address']
    },
    city: {
      type: String,
      required: [true, 'Please specify city']
    },
    state: {
      type: String,
      required: [true, 'Please specify state']
    },
    pincode: {
      type: String,
      required: [true, 'Please specify pincode']
    },
    country: {
      type: String,
      default: 'India'
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0]
      }
    },
    landmarks: [{ type: String }]
  },
  
  // Timeline
  launchDate: {
    type: Date
  },
  
  possessionDate: {
    type: Date
  },
  
  constructionStartDate: {
    type: Date
  },
  
  estimatedCompletionDate: {
    type: Date
  },
  
  // Pricing
  pricePerSqFt: {
    type: Number,
    min: [0, 'Price per sq ft cannot be negative']
  },
  
  startingPrice: {
    type: Number,
    min: [0, 'Starting price cannot be negative']
  },
  
  priceRange: {
    min: {
      type: Number,
      min: [0, 'Minimum price cannot be negative']
    },
    max: {
      type: Number,
      min: [0, 'Maximum price cannot be negative']
    }
  },
  
  // Amenities and features
  amenities: [{
    _id: false,
    name: { type: String },
    description: { type: String },
    icon: { type: String }
  }],
  
  features: [{
    _id: false,
    name: { type: String },
    description: { type: String }
  }],
  
  // Media
  images: [{
    _id: false,
    url: { type: String },
    publicId: { type: String },
    caption: { type: String },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  floorPlans: [{
    _id: false,
    url: { type: String },
    publicId: { type: String },
    unitType: { type: String },
    caption: { type: String }
  }],
  
  brochures: [{
    _id: false,
    url: { type: String },
    publicId: { type: String },
    name: { type: String },
    type: { type: String } // PDF, DOC, etc.
  }],
  
  virtualTours: [{
    _id: false,
    url: { type: String },
    type: {
      type: String,
      enum: ['video', '360', 'virtual_reality'],
      default: 'video'
    },
    thumbnail: { type: String }
  }],
  
  // Legal and approvals
  approvals: [{
    _id: false,
    name: { type: String },
    number: { type: String },
    issuingAuthority: { type: String },
    date: { type: Date },
    status: {
      type: String,
      enum: ['Approved', 'Pending', 'Rejected'],
      default: 'Pending'
    }
  }],
  
  reraNumber: {
    type: String,
    trim: true
  },
  
  // Financial information
  paymentPlans: [{
    _id: false,
    name: { type: String },
    description: { type: String },
    percentage: { type: Number },
    timeline: { type: String }
  }],
  
  // Contact information
  contact: {
    salesOffice: {
      address: String,
      phone: String,
      email: String
    },
    siteOffice: {
      address: String,
      phone: String
    }
  },
  
  // SEO and marketing
  keywords: [{ type: String }],
  
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot be more than 160 characters']
  },
  
  // Status flags
  isActive: {
    type: Boolean,
    default: true
  },
  
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  isPublished: {
    type: Boolean,
    default: false
  },
  
  // Statistics
  views: {
    type: Number,
    default: 0
  },
  
  inquiries: {
    type: Number,
    default: 0
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for geospatial queries
ProjectSchema.index({ 'location.coordinates': '2dsphere' });

// Index for text search
ProjectSchema.index({ 
  name: 'text', 
  description: 'text', 
  'location.city': 'text',
  'location.state': 'text'
});

// Update the updatedAt field before saving
ProjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Cascade delete related data when project is deleted
ProjectSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  // Here you can add logic to delete related data like inquiries, etc.
  next();
});

// Delete existing model if it exists to prevent caching issues
if (mongoose.models.Project) {
  delete mongoose.models.Project;
}

module.exports = mongoose.model('Project', ProjectSchema);
