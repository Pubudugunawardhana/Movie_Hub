const Movie = require('../models/Movie');

exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().populate('category').populate('actors');
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findOne({ movie_id: req.params.id }).populate('category').populate('actors');
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMoviesByCategory = async (req, res) => {
  try {
    const movies = await Movie.find({ category: req.params.categoryId }).populate('category');
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchMovies = async (req, res) => {
  try {
    const { query, language, genre } = req.query;
    let filter = {};
    if (query) filter.title = { $regex: query, $options: 'i' };
    if (language) filter.language = language;
    // genre filtering would require a lookup in Category or assuming genre is passed as category name
    const movies = await Movie.find(filter).populate('category');
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const movieData = { ...req.body };
    if (req.file) {
      movieData.poster_url = `http://localhost:5000/uploads/${req.file.filename}`;
    }
    const movie = new Movie(movieData);
    const savedMovie = await movie.save();
    res.status(201).json(savedMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.poster_url = `http://localhost:5000/uploads/${req.file.filename}`;
    }
    const updatedMovie = await Movie.findOneAndUpdate({ movie_id: req.params.id }, updateData, { new: true });
    if (!updatedMovie) return res.status(404).json({ message: 'Movie not found' });
    res.json(updatedMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const deletedMovie = await Movie.findOneAndDelete({ movie_id: req.params.id });
    if (!deletedMovie) return res.status(404).json({ message: 'Movie not found' });
    res.json({ message: 'Movie deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
