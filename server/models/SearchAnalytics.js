const mongoose = require('mongoose');

const SearchAnalyticsSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    default: null
  },
  sessionId: {
    type: String,
    required: true
  },
  resultsCount: {
    type: Number,
    default: 0
  },
  filters: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  clickedResults: [{
    propertyId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Property'
    },
    position: Number,
    clickedAt: {
      type: Date,
      default: Date.now
    }
  }],
  conversion: {
    type: Boolean,
    default: false
  },
  conversionType: {
    type: String,
    enum: ['view', 'inquiry', 'favorite', 'share'],
    default: null
  },
  userAgent: {
    type: String,
    default: ''
  },
  ipAddress: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for analytics queries
SearchAnalyticsSchema.index({ query: 1, timestamp: -1 });
SearchAnalyticsSchema.index({ userId: 1, timestamp: -1 });
SearchAnalyticsSchema.index({ sessionId: 1 });
SearchAnalyticsSchema.index({ timestamp: -1 });
SearchAnalyticsSchema.index({ resultsCount: 1 });
SearchAnalyticsSchema.index({ conversion: 1 });

module.exports = mongoose.model('SearchAnalytics', SearchAnalyticsSchema);

