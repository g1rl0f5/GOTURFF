const express = require('express');
const multer = require('multer');
const router = express.Router();
const Turf = require('../models/Turf');
const verifyManager = require('../middleware/authMiddleware');
const verifyUser = require('../middleware/verifyUser');

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.get('/fix-turf-fields', async (req, res) => {
  try {
    const result = await Turf.updateMany(
      { manager: { $exists: true } },
      [
        { $set: { manager: "$manager" } },
        { $unset: "manager" }
      ]
    );
    res.json({ message: 'Fields updated successfully', result });
  } catch (error) {
    console.error('Error updating fields:', error);
    res.status(500).json({ message: 'Failed to update fields', error: error.message });
  }
});
// Route: GET /api/turfs
router.get('/', async (req, res) => {
  try {
    const turfs = await Turf.find();
    res.json(turfs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch turfs' });
  }
});

// GET turf by ID
router.get('/:id', async (req, res) => {
  try {
    console.log('🧠 Requested Turf ID:', req.params.id);
    const turf = await Turf.findById(req.params.id);
    console.log('📄 Turf found:', turf);
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }
    res.status(200).json(turf);
  } catch (error) {
    console.error('❌ Error fetching turf by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', verifyManager, upload.single('photo'), async (req, res) => {
  try {
    const { name, location, price, description, sports, amenities } = req.body;
    const photo = req.file.filename;

    console.log('Form Data:', { name, location, price, description, sports, amenities });
    console.log('File Data:', req.file);

    // Check manager already has a turf
    const existingTurf = await Turf.findOne({ manager: req.user.id });
    if (existingTurf) {
      return res.status(400).json({ message: 'You can only add one turf.' });
    }

    // Save new turf to DB
    const newTurf = await Turf.create({
      name,
      location,
      price,
      description,
      sports: Array.isArray(sports) ? sports : [sports],
      amenities,
      photo,
      manager: req.user.id,
    });

    res.status(201).json(newTurf);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
