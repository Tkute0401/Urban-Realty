const mongoose = require('mongoose');

const UserTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  permissions: {
    properties: {
      create: Boolean,
      read: Boolean,
      update: Boolean,
      delete: Boolean
    },
    users: {
      create: Boolean,
      read: Boolean,
      update: Boolean,
      delete: Boolean
    },
    contacts: {
      create: Boolean,
      read: Boolean,
      update: Boolean,
      delete: Boolean
    }
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserType', UserTypeSchema);