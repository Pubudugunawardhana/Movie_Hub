const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const { protect, admin } = require('../middleware/auth');

// Public - submit enquiry
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const enquiry = new Enquiry({ name, email, message });
    await enquiry.save();
    res.status(201).json({ message: 'Enquiry submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin - get all enquiries
router.get('/', protect, admin, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin - update status
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(enquiry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin - delete enquiry
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
    res.json({ message: 'Enquiry deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
