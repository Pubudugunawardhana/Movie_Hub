const mongoose = require('mongoose');

const actorSchema = new mongoose.Schema({
  actor_id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  photo_url: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Actor', actorSchema);
