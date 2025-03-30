const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const PropertySchema = new mongoose.Schema({
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
      'Commercial'
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
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
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
      'Storage'
    ]
  },
  images: [
    {
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
    }
  ],
  featured: {
    type: Boolean,
    default: false
  },
  agent: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
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
      throw new Error('Could not geocode address');
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
    next(err);
  }
});

// Automatically populate agent with contact info
PropertySchema.pre(/^find/, function(next) {
  this.populate({
    path: 'agent',
    select: 'name email phone mobile'
  });
  next();
});

// Static method to get avg price
PropertySchema.statics.getAveragePrice = async function() {
  const obj = await this.aggregate([
    {
      $group: {
        _id: null,
        averagePrice: { $avg: '$price' }
      }
    }
  ]);

  try {
    await this.model('Property').findByIdAndUpdate(null, {
      averagePrice: Math.ceil(obj[0].averagePrice / 10) * 10
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAveragePrice after save
PropertySchema.post('save', function() {
  this.constructor.getAveragePrice();
});

// Call getAveragePrice after remove
PropertySchema.post('remove', function() {
  this.constructor.getAveragePrice();
});

// Index for geospatial queries
PropertySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Property', PropertySchema);