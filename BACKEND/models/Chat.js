const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userQuery: {
    type: String,
    required: true
  },
  botResponse: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    default: 'guest'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Chat', chatSchema);
