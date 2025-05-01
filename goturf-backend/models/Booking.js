// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  turf: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  sports: [String],
  message: { type: String },
});

module.exports = mongoose.model('Booking', bookingSchema);
