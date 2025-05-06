// // reviewRoutes.js
// const express = require('express');
// const router = express.Router();
// const protect = require('../middleware/authMiddleware');
// const { createReview } = require('../controllers/reviewController');

// console.log(createReview); // Check if createReview is a function

// router.post('/', protect, createReview);

// module.exports = router;

const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { createReview, getTurfReviews } = require('../controllers/reviewController');

// POST route to create a review
router.post('/', protect, createReview);

// GET route to fetch all reviews (for a specific turf or all)
router.get('/:turfId', protect, getTurfReviews);

module.exports = router;
