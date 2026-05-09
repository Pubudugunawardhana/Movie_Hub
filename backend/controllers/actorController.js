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
      const base64Image = req.file.buffer.toString('base64');
      actorData.photo_url = `data:${req.file.mimetype};base64,${base64Image}`;
    }
    const actor = new Actor({ ...actorData, actor_id: Date.now() });
    const savedActor = await actor.save();
    res.status(201).json(savedActor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateActor = async (req, res) => {
  try {
    const actorData = { name: req.body.name };
    if (req.file) {
      const base64Image = req.file.buffer.toString('base64');
      actorData.photo_url = `data:${req.file.mimetype};base64,${base64Image}`;
    }
    const updatedActor = await Actor.findByIdAndUpdate(req.params.id, actorData, { new: true });
    if (!updatedActor) return res.status(404).json({ message: 'Actor not found' });
    res.json(updatedActor);
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
