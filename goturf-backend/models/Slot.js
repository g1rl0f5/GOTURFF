// models/Slot.js
const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  turf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Turf',
    required: true,
  },
  date: {
    type: String, 
    required: true,
  },
  availableSlots: [
    {
      time: String, 
      isBooked: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

module.exports = mongoose.model('Slot', slotSchema);
