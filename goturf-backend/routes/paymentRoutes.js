
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const verifyUser = require('../middleware/verifyUser');
const Booking = require('../models/Booking');










router.post('/create-payment-intent/:bookingId', verifyUser, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId).populate('turf');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const amountInPaise = booking.turf.price * 100; 

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPaise, 
      currency: 'inr',       
      metadata: { bookingId: booking._id.toString() },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
      amount: amountInPaise,   // 👈 added this line
    });
  } catch (error) {
    console.error('PaymentIntent creation failed:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


// router.post('/create-payment-intent/:bookingId', verifyUser, async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.bookingId).populate('turf');
//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     const amountInPaise = booking.turf.price * 100; 

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amountInPaise, 
//       currency: 'inr',       
//       metadata: { bookingId: booking._id.toString() },
//     });

//     res.send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.error('PaymentIntent creation failed:', error);
//     res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });

module.exports = router;
