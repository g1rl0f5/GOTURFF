const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['UPI', 'Credit Card', 'Debit Card', 'Cash'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'pending' 
  },
  paymentDate: { type: Date, default: Date.now },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
