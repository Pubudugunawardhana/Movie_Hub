const mongoose = require('mongoose');
require('./Category');
require('./Actor');
const movieSchema = new mongoose.Schema({
  movie_id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  release_date: { type: Date },
  summary: { type: String },
  director: { type: String },
  runtime_minutes: { type: Number },
  trailer_url: { type: String },
  poster_url: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  language: { type: String, required: true },
  actors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actor' }],
  ibm_rating: { type: Number, min: 0, max: 10, default: 0 },
  type: { type: String, enum: ['movie', 'series'], default: 'movie' },
  is_sample: { type: Boolean, default: false },
  publicity_score: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
