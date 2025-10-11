const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/hybridGeocoder');

console.log('🔧 Property model loaded');
console.log('🔧 Mongoose connection state:', mongoose.connection.readyState);
console.log('🔧 Mongoose version:', mongoose.version);

const PropertySchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  type: {
    type: String,
    required: [true, 'Please select a property type'],
    enum: [
      'House',
      'Apartment',
      'Villa',
      'Condo',
      'Townhouse',
      'Land',
      'Commercial',
      'PG'
    ],
    default: 'House'
  },
  status: {
    type: String,
    required: [true, 'Please select a status'],
    enum: [
      'For Sale',
      'For Rent',
      'Sold',
      'Rented'
    ],
    default: 'For Sale'
  },

  // Pricing and Details
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price must be at least 0']
  },
  bedrooms: {
    type: Number,
    required: [true, 'Please add number of bedrooms'],
    min: [0, 'Bedrooms must be at least 0']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Please add number of bathrooms'],
    min: [0, 'Bathrooms must be at least 0']
  },
  area: {
    type: Number,
    required: [true, 'Please add area in sqft'],
    min: [0, 'Area must be at least 0']
  },
  buildingName: {
    type: String,
    default: '',
    maxlength: [100, 'Building name cannot be more than 100 characters']
  },
  floorNumber: {
    type: String,
    default: '',
    maxlength: [20, 'Floor number cannot be more than 20 characters']
  },

  // Developer Information
  developer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Developer'
  },
  constructionStatus: {
    type: String,
    enum: [
      'Under Construction',
      'Ready to Move',
      'New Launch',
      'Almost Ready'
    ],
    default: 'Under Construction'
  },
  possessionDate: Date,
  ageOfProperty: {
    type: Number,
    min: 0
  },
  approvals: [{
    name: String,
    number: String,
    date: Date
  }],

  // Location Information
  address: {
    line1: {
      type: String,
      default: '',
      maxlength: [100, 'Address line 1 cannot be more than 100 characters']
    },
    street: {
      type: String,
      required: [true, 'Please add a street address'],
      maxlength: [100, 'Street address cannot be more than 100 characters']
    },
    city: {
      type: String,
      required: [true, 'Please add a city'],
      maxlength: [50, 'City name cannot be more than 50 characters']
    },
    locality: {
      type: String,
      required: [true, 'Please add a locality'],
      maxlength: [50, 'Locality name cannot be more than 50 characters']
    },
    state: {
      type: String,
      required: [true, 'Please add a state'],
      maxlength: [50, 'State name cannot be more than 50 characters']
    },
    zipCode: {
      type: String,
      required: [true, 'Please add a zip code'],
      maxlength: [20, 'Zip code cannot be more than 20 characters'],
      validate: {
        validator: function(v) {
          return /^\d{5,6}(?:[-\s]\d{4})?$/.test(v);
        },
        message: props => `${props.value} is not a valid zip code!`
      }
    },
    country: {
      type: String,
      required: [true, 'Please add a country'],
      default: 'India',
      maxlength: [50, 'Country name cannot be more than 50 characters']
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
      default: [0, 0],
      validate: {
        validator: function(v) {
          return v.length === 2 && 
                 v[0] >= -180 && v[0] <= 180 && 
                 v[1] >= -90 && v[1] <= 90;
        },
        message: props => `${props.value} is not a valid coordinate!`
      }
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },

  // Features and Amenities
  amenities: {
    type: [String],
    default: [],
    enum: [
      'Parking',
      'Swimming Pool',
      'Gym',
      'Security',
      'Garden',
      'Balcony',
      'WiFi',
      'Air Conditioning',
      'Furnished',
      'Pet Friendly',
      'Elevator',
      'Laundry',
      'Storage',
      'Conference Room',
      'Kitchen'
    ]
  },
  highlights: {
    type: [String],
    default: [],
    maxlength: [100, 'Highlight cannot be more than 100 characters']
  },
  nearbyLocalities: {
    hasSchool: { type: Boolean, default: false },
    school: { type: String, default: '' },
    hasHospital: { type: Boolean, default: false },
    hospital: { type: String, default: '' },
    hasMall: { type: Boolean, default: false },
    mall: { type: String, default: '' },
    hasPark: { type: Boolean, default: false },
    park: { type: String, default: '' },
    hasTransport: { type: Boolean, default: false },
    transport: { type: String, default: '' }
  },

  // Project Details
  projectDetails: {
    projectArea: { type: String, default: '' },
    totalUnits: { type: String, default: '' },
    launchDate: { type: Date, default: null },
    reraId: { type: String, default: '' },
    configurations: { type: String, default: '' }
  },

  // Media
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    width: Number,
    height: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  floorPlanImages: [{
    url: String,
    publicId: String,
    description: String
  }],
  brochure: {
    url: String,
    publicId: String
  },
  virtualTour: {
    url: String,
    type: {
      type: String,
      enum: ['video', '3d']
    }
  },

  // Metadata
  featured: {
    type: Boolean,
    default: false
  },
  agent: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create property slug from the title
PropertySchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

// Geocode & create location field
PropertySchema.pre('save', async function(next) {
  if (!this.isModified('address')) return next();

  try {
    const addressString = [
      this.address.line1,
      this.address.street,
      this.address.city,
      this.address.state,
      this.address.zipCode,
      this.address.country
    ].filter(Boolean).join(', ');

    const loc = await geocoder.geocode(addressString);
    
    if (!loc || loc.length === 0) {
      console.warn('Geocoding failed, using default coordinates');
      return next();
    }

    this.location = {
      type: 'Point',
      coordinates: [loc[0].longitude, loc[0].latitude],
      formattedAddress: loc[0].formattedAddress,
      street: loc[0].streetName || this.address.street,
      city: loc[0].city || this.address.city,
      state: loc[0].stateCode || this.address.state,
      zipCode: loc[0].zipcode || this.address.zipCode,
      country: loc[0].countryCode || this.address.country
    };

    next();
  } catch (err) {
    console.error('Geocoding error:', err);
    next();
  }
});

// Calculate age of property if possession date is provided
PropertySchema.pre('save', function(next) {
  if (this.possessionDate && !this.ageOfProperty) {
    const ageInMilliseconds = Date.now() - new Date(this.possessionDate).getTime();
    this.ageOfProperty = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365));
  }
  next();
});

// Reverse populate with virtuals
PropertySchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'property',
  justOne: false
});

// Cascade delete reviews when a property is deleted
PropertySchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  await this.model('Review').deleteMany({ property: this._id });
  next();
});

// Index for geospatial queries
PropertySchema.index({ location: '2dsphere' });

// Index for text search
PropertySchema.index({
  title: 'text',
  description: 'text',
  'address.city': 'text',
  'address.state': 'text',
  buildingName: 'text'
});

module.exports = mongoose.model('Property', PropertySchema);