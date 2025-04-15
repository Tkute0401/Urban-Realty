const mongoose = require('mongoose');

const DynamicFieldSchema = new mongoose.Schema({
  entityType: {
    type: String,
    required: true,
    enum: ['property', 'user', 'contact']
  },
  fieldName: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  fieldType: {
    type: String,
    required: true,
    enum: ['string', 'number', 'boolean', 'date', 'array', 'enum', 'reference']
  },
  options: [{
    value: String,
    label: String
  }],
  required: {
    type: Boolean,
    default: false
  },
  visible: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  validation: {
    min: Number,
    max: Number,
    regex: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DynamicField', DynamicFieldSchema);