const mongoose = require('mongoose');

const SavedSearchSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a name for this search'],
    trim: true,
    maxlength: [100, 'Search name cannot be more than 100 characters']
  },
  filters: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: {}
  },
  notificationsEnabled: {
    type: Boolean,
    default: true
  },
  frequency: {
    type: String,
    enum: ['instant', 'daily', 'weekly'],
    default: 'daily'
  },
  lastNotified: {
    type: Date
  },
  matchCount: {
    type: Number,
    default: 0
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
  timestamps: true
});

// Indexes
SavedSearchSchema.index({ user: 1, createdAt: -1 });
SavedSearchSchema.index({ notificationsEnabled: 1, frequency: 1 });

// Delete existing model if it exists
if (mongoose.models.SavedSearch) {
  delete mongoose.models.SavedSearch;
}

module.exports = mongoose.model('SavedSearch', SavedSearchSchema);

