const express = require('express');
const router = express.Router();
const Turf = require('../models/Turf');
const User = require('../models/User');
const verifyAdmin = require('../middleware/verifyAdmin');


router.get('/all-turfs', verifyAdmin, async (req, res) => {
  try {
    const turfs = await Turf.find().populate({
      path: 'manager',
      select: 'name email role',
      model: 'User',
    });

    console.log("All turfs fetched from DB:", turfs);

    res.json(turfs); // ✅ no unnecessary transform
  } catch (err) {
    console.error('Error fetching turfs:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get all pending turfs
router.get('/pending-turfs', verifyAdmin, async (req, res) => {
  try {
    const pendingTurfs = await Turf.find({ isApproved: false }).populate({
      path: 'manager',
      select: 'name email role',
    });
    const formatted = pendingTurfs.map(turf => {
      const turfObj = turf.toObject();
      turfObj.manager = turfObj.manager;
      delete turfObj.manager;
      return turfObj;
    });
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pending turfs', error: err.message });
  }
});


// 🔹 Get all users (including managers and regular users)
router.get('/all-users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});

// 🔹 Approve a turf by ID
router.patch('/approve-turf/:id', verifyAdmin, async (req, res) => {
  try {
    const turf = await Turf.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }
    res.json({ message: 'Turf approved successfully', turf });
  } catch (err) {
    res.status(500).json({ message: 'Failed to approve turf', error: err.message });
  }
});

// 🔹 Reject (Delete) a turf
router.delete('/delete-turf/:id', verifyAdmin, async (req, res) => {
  try {
    const turf = await Turf.findByIdAndDelete(req.params.id);
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }
    res.json({ message: 'Turf deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete turf', error: err.message });
  }
});

// 🔹 Delete a user by ID
router.delete('/delete-user/:id', verifyAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
});

module.exports = router;
