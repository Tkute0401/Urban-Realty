const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  mobile: {
    type: String,
    match: [
      /^\+?[0-9]{10,15}$/,
      'Please add a valid mobile number with country code'
    ]
  },
  role: {
    type: String,
    enum: ['buyer', 'agent', 'admin', 'painter', 'interior_designer', 'lawyer'],
    default: 'buyer'
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  active: {
    type: Boolean,
    default: true
  },
  occupation: {
    type: String,
    trim: true,
    maxlength: [100, 'Occupation cannot be more than 100 characters']
  },
  favorites: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Property'
    }
  ],
  recentlyViewed: [
    {
      property: {
        type: mongoose.Schema.ObjectId,
        ref: 'Property'
      },
      viewedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  // Subscription related fields
  currentSubscription: {
    type: mongoose.Schema.ObjectId,
    ref: 'UserSubscription'
  },
  subscriptionStatus: {
    type: String,
    enum: ['free', 'basic', 'premium', 'enterprise'],
    default: 'free',
    required: true
  },
  subscriptionExpiry: {
    type: Date
  },
  stripeCustomerId: {
    type: String,
    trim: true
  },
  // Professional fields for new roles
  professionalInfo: {
    licenseNumber: {
      type: String,
      trim: true
    },
    yearsOfExperience: {
      type: Number,
      min: 0
    },
    specializations: [{
      type: String,
      trim: true
    }],
    certifications: [{
      type: String,
      trim: true
    }],
    businessName: {
      type: String,
      trim: true,
      maxlength: [100, 'Business name cannot be more than 100 characters']
    },
    businessAddress: {
      type: String,
      trim: true
    },
    businessPhone: {
      type: String,
      trim: true
    },
    businessWebsite: {
      type: String,
      trim: true
    }
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if user has required subscription level
UserSchema.methods.hasSubscription = function(requiredPlan) {
  const subscriptionLevels = {
    'free': 0,
    'basic': 1,
    'premium': 2,
    'enterprise': 3
  };
  
  const userLevel = subscriptionLevels[this.subscriptionStatus] || 0;
  const requiredLevel = subscriptionLevels[requiredPlan] || 0;
  
  return userLevel >= requiredLevel;
};

// Check if user can access a specific feature
UserSchema.methods.canAccessFeature = function(feature) {
  const featureAccess = {
    'advancedSearch': 'basic',
    'analytics': 'premium',
    'customBranding': 'enterprise',
    'apiAccess': 'enterprise',
    'prioritySupport': 'premium'
  };
  
  const requiredPlan = featureAccess[feature];
  if (!requiredPlan) return true; // Feature doesn't require subscription
  
  return this.hasSubscription(requiredPlan);
};

// Get subscription info for display
UserSchema.methods.getSubscriptionInfo = function() {
  return {
    status: this.subscriptionStatus,
    expiry: this.subscriptionExpiry,
    currentSubscription: this.currentSubscription
  };
};

module.exports = mongoose.model('User', UserSchema);