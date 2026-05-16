const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

// Public route to get reviews for a specific movie
router.get('/movie/:movie_id', reviewController.getReviewsByMovie);

// Protected routes
router.post('/', protect, reviewController.addReview);
router.delete('/:id', protect, reviewController.deleteReview);

module.exports = router;
