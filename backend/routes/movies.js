const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { protect, admin } = require('../middleware/auth');

// Static GET routes FIRST (before /:id to avoid conflicts)
router.get('/search', movieController.searchMovies);
router.get('/category/:categoryId', movieController.getMoviesByCategory);
router.get('/', movieController.getAllMovies);

// Dynamic ID routes
router.get('/:id', movieController.getMovieById);

const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Admin only routes
router.post('/', protect, admin, upload.single('poster'), movieController.createMovie);
router.put('/:id', protect, admin, upload.single('poster'), movieController.updateMovie);
router.delete('/:id', protect, admin, movieController.deleteMovie);

module.exports = router;
