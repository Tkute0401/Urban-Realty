const mongoose = require('mongoose');

const UserInteractionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  property: {
    type: mongoose.Schema.ObjectId,
    ref: 'Property',
    required: true,
    index: true
  },
  interactionType: {
    type: String,
    enum: ['view', 'favorite', 'contact', 'share', 'search'],
    required: true
  },
  duration: {
    type: Number, // Time spent in seconds
    default: 0
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
UserInteractionSchema.index({ user: 1, property: 1, interactionType: 1 });
UserInteractionSchema.index({ user: 1, createdAt: -1 });
UserInteractionSchema.index({ property: 1, interactionType: 1 });

// Delete existing model if it exists
if (mongoose.models.UserInteraction) {
  delete mongoose.models.UserInteraction;
}

module.exports = mongoose.model('UserInteraction', UserInteractionSchema);



