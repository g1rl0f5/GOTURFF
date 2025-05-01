const express = require('express');
const router = express.Router();
const Turf = require('../models/Turf');

// 🔹 Public route to get only approved turfs
router.get('/approved-turfs', async (req, res) => {
  try {
    const approvedTurfs = await Turf.find({ isApproved: true });
    res.json(approvedTurfs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching approved turfs', error: err.message });
  }
});

module.exports = router;
