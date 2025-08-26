const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a subscription name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Subscription name cannot be more than 50 characters']
  },
  type: {
    type: String,
    required: [true, 'Please add a subscription type'],
    enum: ['free', 'basic', 'premium', 'enterprise'],
    default: 'free'
  },
  price: {
    type: Number,
    required: [true, 'Please add a subscription price'],
    min: [0, 'Price cannot be negative']
  },
  billingCycle: {
    type: String,
    required: [true, 'Please add a billing cycle'],
    enum: ['monthly', 'yearly'],
    default: 'monthly'
  },
  features: {
    propertyListings: {
      type: Number,
      default: 0,
      description: 'Number of property listings allowed'
    },
    advancedSearch: {
      type: Boolean,
      default: false,
      description: 'Access to advanced search features'
    },
    prioritySupport: {
      type: Boolean,
      default: false,
      description: 'Priority customer support'
    },
    analytics: {
      type: Boolean,
      default: false,
      description: 'Access to analytics and insights'
    },
    customBranding: {
      type: Boolean,
      default: false,
      description: 'Custom branding options'
    },
    apiAccess: {
      type: Boolean,
      default: false,
      description: 'API access for integrations'
    }
  },
  maxUsers: {
    type: Number,
    default: 1,
    description: 'Maximum number of users allowed'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update the updatedAt field before saving
SubscriptionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);