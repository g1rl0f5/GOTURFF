const mongoose = require('mongoose');

const turfSchema = new mongoose.Schema({
  name: String,
  location: String,
  price: Number,
  description: String,
  sports: [String],
  amenities: [String],
  photo: String,
  isApproved: {
    type: Boolean,
    default: false,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

module.exports = mongoose.model('Turf', turfSchema);


