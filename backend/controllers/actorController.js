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
    const actor = new Actor({ name: req.body.name });
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
