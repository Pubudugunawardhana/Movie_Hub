const Review = require('../models/Review');

exports.addReview = async (req, res) => {
  try {
    const { movie_id, rating, comment } = req.body;
    
    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({ user: req.user._id, movie_id });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this movie.' });
    }

    const review = new Review({
      user: req.user._id,
      movie_id,
      rating,
      comment
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReviewsByMovie = async (req, res) => {
  try {
    const { movie_id } = req.params;
    const reviews = await Review.find({ movie_id }).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    // Check if user is the owner or an admin
    if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();
    res.json({ message: 'Review removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
