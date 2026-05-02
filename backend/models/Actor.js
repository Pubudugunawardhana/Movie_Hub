const mongoose = require('mongoose');

const actorSchema = new mongoose.Schema({
  actor_id: { type: Number, required: true, unique: true },
  name: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Actor', actorSchema);
