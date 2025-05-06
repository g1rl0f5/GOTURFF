const Review = require('../models/Review');
const Booking = require('../models/Booking');

// Create a review
const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    // Find the booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking already has a review
    if (booking.review) {
      return res.status(400).json({ message: 'Review already submitted for this booking' });
    }

    // Create a new review
    const review = await Review.create({
      user: req.user._id,
      turf: booking.turf,
      rating,
      comment,
    });

    // Attach the review to the booking
    booking.review = review._id;
    await booking.save();

    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (err) {
    res.status(400).json({ message: 'Error submitting review', error: err.message });
  }
};

// Get all reviews for a specific turf
const getTurfReviews = async (req, res) => {
  try {
    const { turfId } = req.params;

    // Find reviews by turfId and populate user data (e.g., name)
    const reviews = await Review.find({ turf: turfId }).populate('user', 'name');

    // Check if reviews exist
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this turf' });
    }

    res.status(200).json({ reviews });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
};

module.exports = { createReview, getTurfReviews };



// const Review = require('../models/Review');
// const Booking = require('../models/Booking');

// // Create a review
// const createReview = async (req, res) => {
//   try {
//     // Logic to create a review (e.g., save to database)
//     res.status(201).json({ message: 'Review created successfully' });
//   } catch (err) {
//     res.status(400).json({ message: 'Error creating review', error: err.message });
//   }
// };

// // Get all reviews for a specific turf
// const getTurfReviews = async (req, res) => {
//   try {
//     const { turfId } = req.params;
    
//     // Find reviews by turfId and populate user data (e.g., name)
//     const reviews = await Review.find({ turf: turfId }).populate('user', 'name');
    
//     // Check if reviews exist
//     if (!reviews || reviews.length === 0) {
//       return res.status(404).json({ message: 'No reviews found for this turf' });
//     }

//     res.status(200).json({ reviews });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
//   }
// };

// module.exports = { createReview, getTurfReviews };

