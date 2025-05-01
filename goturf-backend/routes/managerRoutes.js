const express = require('express');
const router = express.Router();
const Turf = require('../models/Turf');
const managerMiddleware = require('../middleware/managerMiddleware');
const Slot = require('../models/Slot');
const Booking = require('../models/Booking');
const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });


// 🔹 Add a new turf
router.post('/add-turf', managerMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const { name, location, price, description, sports, amenities } = req.body;

    const newTurf = new Turf({
      name,
      location,
      price,
      description,
      sports: Array.isArray(sports) ? sports : [sports],
      amenities: Array.isArray(amenities) ? amenities : [amenities],
      photo: req.file?.filename || '',
      manager: req.user.id,
      isApproved: false,
    });

    await newTurf.save();
    res.status(201).json({ message: 'Turf added successfully', turf: newTurf });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});


// 🔹 Get all turfs of manager
router.get('/my-turfs', managerMiddleware, async (req, res) => {
  try {
    const turfs = await Turf.find({ manager: req.user.id });
    res.json(turfs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch turfs', error: err.message });
  }
});


// 🔹 Get all slots for manager's turfs
router.get('/slots', managerMiddleware, async (req, res) => {
  try {
    const turfs = await Turf.find({ manager: req.user.id });
    const turfIds = turfs.map(turf => turf._id);
    const slots = await Slot.find({ turf: { $in: turfIds } }); // 🔥 Corrected here
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch slots', error: err.message });
  }
});


// 🔹 Update a slot (example: availability, time, date)
router.put('/slots/:id', managerMiddleware, async (req, res) => {
  try {
    const { available, time, date } = req.body;
    const slot = await Slot.findByIdAndUpdate(
      req.params.id,
      { available, time, date },
      { new: true }
    );
    res.json(slot);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update slot', error: err.message });
  }
});


// 🔹 Get all bookings related to manager's turfs
router.get('/bookings', managerMiddleware, async (req, res) => {
  try {
    const managerTurfs = await Turf.find({ manager: req.user.id });
    const turfIds = managerTurfs.map(t => t._id);

    const bookings = await Booking.find({ turf: { $in: turfIds } })
      .populate('user' , 'name email') 
      .populate('turf' , 'name location');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: err.message });
  }
});


// 🔹 Approve a booking
router.put('/bookings/:id/approve', managerMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Failed to approve booking', error: err.message });
  }
});


// 🔹 Reject a booking (Optional - if you want to add)
router.put('/bookings/:id/reject', managerMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Failed to reject booking', error: err.message });
  }
});

// // 🔹 Update an existing turf
// router.put('/edit-turf/:id', managerMiddleware, upload.single('photo'), async (req, res) => {
//   try {
//     const { name, location, price, description, sports, amenities } = req.body;

//     const updatedData = {
//       name,
//       location,
//       price,
//       description,
//       sports: Array.isArray(sports) ? sports : [sports],
//       amenities: Array.isArray(amenities) ? amenities : [amenities],
//     };

//     if (req.file) {
//       updatedData.photo = req.file.filename;
//     }

//     const turf = await Turf.findOneAndUpdate(
//       { _id: req.params.id, manager: req.user.id },
//       updatedData,
//       { new: true }
//     );

//     if (!turf) return res.status(404).json({ message: 'Turf not found or unauthorized' });

//     res.json({ message: 'Turf updated successfully', turf });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to update turf', error: err.message });
//   }
// });

// 🔹 Update a turf by ID
router.put('/edit-turf/:id', managerMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const { name, location, price, description, sports, amenities } = req.body;
    const updatedFields = {
      name,
      location,
      price,
      description,
      sports: Array.isArray(sports) ? sports : sports?.split(',').map(s => s.trim()) || [],
      amenities: Array.isArray(amenities) ? amenities : amenities?.split(',').map(a => a.trim()) || [],
    };

    if (req.file) {
      updatedFields.photo = req.file.filename;
    }

    const turf = await Turf.findOneAndUpdate(
      { _id: req.params.id, manager: req.user.id },
      updatedFields,
      { new: true }
    );

    if (!turf) return res.status(404).json({ message: 'Turf not found or unauthorized' });

    res.json({ message: 'Turf updated successfully', turf });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


module.exports = router;

