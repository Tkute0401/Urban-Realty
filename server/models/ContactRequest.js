const mongoose = require('mongoose');

const ContactRequestSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.ObjectId,
    ref: 'Property',
    required: true
  },
  agent: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
    maxlength: [1000, 'Message cannot be more than 1000 characters']
  },
  contactMethod: {
    type: String,
    enum: ['email', 'phone', 'whatsapp'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'completed', 'spam'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate contact requests
ContactRequestSchema.index({ property: 1, user: 1 }, { unique: true });

// Populate with user and property data
ContactRequestSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'property',
    select: 'title price'
  });
  this.populate({
    path: 'agent',
    select: 'name email mobile'
  });
  this.populate({
    path: 'user',
    select: 'name email mobile'
  });
  next();
});

module.exports = mongoose.model('ContactRequest', ContactRequestSchema);