const Booking = require('../models/Booking');
const Turf = require('../models/Turf');

// Create a booking
exports.createBooking = async (req, res) => {
  const { date, timeSlot, sports, message } = req.body;
  const { turfId } = req.params;

  try {
    const turf = await Turf.findById(turfId);
    if (!turf) return res.status(404).json({ message: 'Turf not found' });

    console.log('📦 Incoming Booking request user:', req.user);
    console.log('📦 req.user.id:', req.user?.id); 

    const newBooking = new Booking({
      turf: turfId,
      user: req.user.id,
      date,
      timeSlot,
      sports: sports,
      message,
      status: 'pending'
    });



    await newBooking.save();
    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ message: 'Failed to create booking' });
  }
};

// Get all bookings for the logged-in user
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('turf');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};

exports.getManagerBookings = async (req, res) => {
  try {
    const managerId = req.user._id; 

    // Find turfs managed by the logged-in manager
    const turfs = await Turf.find({ manager: managerId });
    const turfIds = turfs.map(turf => turf._id);

    // Find bookings for those turfs
    const bookings = await Booking.find({ turf: { $in: turfIds } })
      .populate('user', 'name email')
      .populate('turf', 'name location');

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};



exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { bookingId } = req.params;

    const booking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking status updated', booking });
  } catch (err) {
    console.error('Error updating booking status:', err);
    res.status(500).json({ message: 'Failed to update booking status' });
  }
};

exports.getMyApprovedBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id, status: 'approved' })
      .populate('turf', 'name location');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
