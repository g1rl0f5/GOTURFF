const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const verifyUser = require('../middleware/verifyUser');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment'); // make sure this is imported

router.post('/initiate-payment/:bookingId', verifyUser, async (req, res) => {
  try {
    console.log("✅ Initiating payment...");
    const { paymentMethod } = req.body;
    console.log("Payment method:", paymentMethod);

    const booking = await Booking.findById(req.params.bookingId).populate('turf');
    if (!booking) {
      console.log("❌ Booking not found");
      return res.status(404).json({ message: 'Booking not found' });
    }

    const amount = booking.turf.price;
    console.log("Booking found, amount:", amount);

    const payment = new Payment({
      user: req.user.id,
      booking: booking._id,
      amount,
      paymentMethod,
      status: 'pending',
    });

    await payment.save();
    console.log("✅ Payment saved:", payment._id);

    if (paymentMethod === 'Cash') {
      payment.status = 'completed';
      await payment.save();
      console.log("✅ Cash booking confirmed");
      return res.json({ message: 'Cash booking confirmed', paymentId: payment._id });
    }

    // Stripe checkout session
    const frontendUrl = process.env.FRONTEND_URL.replace(/\/$/, '');
    const successUrl = `${frontendUrl}/payment/${booking._id}?status=success`;
    const cancelUrl = `${frontendUrl}/payment/${booking._id}?status=cancelled`;

    console.log("Success URL:", successUrl);
    console.log("Cancel URL:", cancelUrl);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'upi'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Turf Booking - ${booking.turf.name}`,
              description: booking.turf.description,
              images: [booking.turf.photo],
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        bookingId: booking._id.toString(),
        userId: req.user.id,
        paymentId: payment._id.toString(),
      },
    });

    console.log("✅ Stripe session created:", session.url);
    res.json({ url: session.url });

  } catch (error) {
    console.error('❌ Payment initiation failed:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


// 🎯 Direct Checkout Session (if needed separately)
router.post('/create-checkout-session/:bookingId', verifyUser, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId).populate('turf');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const amountInPaise = booking.turf.price * 100;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'upi'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Turf Booking - ${booking.turf.name}`,
              description: booking.turf.description,
              images: [booking.turf.photo],
            },
            unit_amount: amountInPaise,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment/${booking._id}?status=success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/${booking._id}?status=cancelled`,
      metadata: {
        bookingId: booking._id.toString(),
        userId: req.user.id,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session creation failed:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;




















// const express = require('express');
// const router = express.Router();
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const verifyUser = require('../middleware/verifyUser');
// const Booking = require('../models/Booking');

// router.post('/create-checkout-session/:bookingId', verifyUser, async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.bookingId).populate('turf');
//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     const amountInPaise = booking.turf.price * 100;

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card', 'upi'],   // 👈 supports card & UPI
//       line_items: [
//         {
//           price_data: {
//             currency: 'inr',
//             product_data: {
//               name: `Turf Booking - ${booking.turf.name}`,
//             },
//             unit_amount: amountInPaise,
//           },
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url: `${process.env.FRONTEND_URL}/payment-success`,  // 👈 redirect on success
//       cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`, // 👈 redirect if user cancels
//       metadata: {
//         bookingId: booking._id.toString(),
//         userId: req.user.id,
//       },
//     });

//     res.send({ url: session.url });  // 👈 frontend will redirect to this URL
//   } catch (error) {
//     console.error('Checkout session creation failed:', error);
//     res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });

// // create-checkout-session route (new)
// router.post('/create-checkout-session/:bookingId', verifyUser, async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.bookingId).populate('turf');
//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price_data: {
//             currency: 'inr',
//             product_data: {
//               name: booking.turf.name,
//             },
//             unit_amount: booking.turf.price * 100,
//           },
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url: `https://your-frontend-url.com/payment/${booking._id}?status=success`,
//       cancel_url: `https://your-frontend-url.com/payment/${booking._id}?status=cancelled`,
//       metadata: {
//         bookingId: booking._id.toString(),
//       },
//     });

//     res.json({ url: session.url });
//   } catch (error) {
//     console.error('Checkout Session creation failed:', error);
//     res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });



// router.post('/initiate-payment/:bookingId', verifyUser, async (req, res) => {
//   try {
//     const { paymentMethod } = req.body;

//     const booking = await Booking.findById(req.params.bookingId).populate('turf');
//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     const amount = booking.turf.price;

//     // Create a Payment record first
//     const payment = new Payment({
//       user: req.user.id,
//       booking: booking._id,
//       amount,
//       paymentMethod,
//       status: 'pending',
//     });

//     await payment.save();

//     if (paymentMethod === 'Cash') {
//       // if cash booking — mark as completed immediately or pending manually
//       payment.status = 'completed';
//       await payment.save();
//       return res.json({ message: 'Cash booking confirmed', paymentId: payment._id });
//     }

//     // Else for UPI, Card etc — Create Stripe Checkout Session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card', 'upi'],
//       line_items: [
//         {
//           price_data: {
//             currency: 'inr',
//             product_data: {
//               name: `Turf Booking - ${booking.turf.name}`,
//             },
//             unit_amount: amount * 100,
//           },
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url: `${process.env.FRONTEND_URL}/payment-success`,
//       cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`,
//       metadata: {
//         bookingId: booking._id.toString(),
//         userId: req.user.id,
//         paymentId: payment._id.toString(),
//       },
//     });

//     res.json({ url: session.url });
//   } catch (error) {
//     console.error('Payment initiation failed:', error);
//     res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });

// module.exports = router;


