const Actor = require('../models/Actor');

exports.getActors = async (req, res) => {
  try {
    const actors = await Actor.find();
    res.json(actors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createActor = async (req, res) => {
  try {
    const actorData = { name: req.body.name };
    if (req.file) {
      actorData.photo_url = `http://localhost:5000/uploads/${req.file.filename}`;
    }
    const actor = new Actor({ ...actorData, actor_id: Date.now() });
    const savedActor = await actor.save();
    res.status(201).json(savedActor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteActor = async (req, res) => {
  try {
    await Actor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Actor deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
