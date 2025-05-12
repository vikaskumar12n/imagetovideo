const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  imageName: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Video', videoSchema);
