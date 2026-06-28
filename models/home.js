const mongoose = require('mongoose');

const homeSchema = mongoose.Schema({
  houseName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  photo: String,      // URL
  photoId: String,    // Cloudinary public_id
  description: String,
});

module.exports = mongoose.model('Home', homeSchema);