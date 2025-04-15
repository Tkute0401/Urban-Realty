const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  // Core fields
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
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  
  // Profile image reference
  profileImage: {
    type: mongoose.Schema.ObjectId,
    ref: 'Media'
  },
  
  // Dynamic fields storage
  dynamicFields: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // User type reference
  userType: {
    type: mongoose.Schema.ObjectId,
    ref: 'UserType',
    required: true
  },
  
  // Status fields
  isVerified: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for user's properties
UserSchema.virtual('properties', {
  ref: 'Property',
  localField: '_id',
  foreignField: 'agent',
  justOne: false
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Update timestamps on save
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
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

// Cascade delete properties when user is deleted
UserSchema.pre('remove', async function(next) {
  if (this.dynamicFields.role === 'agent') {
    await this.model('Property').deleteMany({ agent: this._id });
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);