const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  locality: {
    type: String,
    trim: true
  },
  service: {
    type: String,
    required: true
  },
  propertyType: {
    type: String,
    default: 'N/A'
  },
  budget: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lead', leadSchema);
