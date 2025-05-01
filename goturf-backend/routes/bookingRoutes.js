const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const verifyUser = require('../middleware/verifyUser');
const managerMiddleware = require('../middleware/managerMiddleware');

// Create a booking for a turf
router.post('/:turfId', verifyUser, bookingController.createBooking);

// Get all bookings for the logged-in user
router.get('/', verifyUser, bookingController.getUserBookings);

// Manager can view bookings on their turfs
router.get('/manager', verifyUser, managerMiddleware, bookingController.getManagerBookings);

// Update booking status
router.put('/manager/:bookingId', verifyUser, managerMiddleware, bookingController.updateBookingStatus);


module.exports = router;


// const express = require('express');
// const router = express.Router();
// const bookingController = require('../controllers/bookingController');
// const verifyUser = require('../middleware/verifyUser');
// const managerMiddleware = require('../middleware/managerMiddleware')


// // Create a booking for a turf
// router.post('/bookings/:turfId', verifyUser, bookingController.createBooking);

// // (Optional) Get all bookings for the logged-in user
// router.get('/bookings', verifyUser, bookingController.getUserBookings);

// router.get('/manager/bookings', managerMiddleware, bookingController.getManagerBookings);




// module.exports = router;
