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

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Admin only routes
router.post('/', protect, admin, upload.single('poster'), movieController.createMovie);
router.put('/:id', protect, admin, upload.single('poster'), movieController.updateMovie);
router.delete('/:id', protect, admin, movieController.deleteMovie);

module.exports = router;
