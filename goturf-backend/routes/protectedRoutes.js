const express = require('express');
const router = express.Router();
const Turf = require('../models/Turf');
const verifyUser = require('../middleware/verifyUser');
const bookingController = require('../controllers/bookingController');



// GET /api/protected/turf/:id
router.get('/turf/:id', verifyUser, async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) return res.status(404).json({ message: 'Turf not found' });
    res.status(200).json(turf);
  } catch (err) {
    console.error('Error fetching turf:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/bookings/:turfId', verifyUser, bookingController.createBooking);
router.get('/bookings', verifyUser, bookingController.getUserBookings);

module.exports = router;

