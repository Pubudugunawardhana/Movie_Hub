const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { protect, admin } = require('../middleware/auth');

// Get all transactions
router.get('/', protect, admin, async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete all transactions
router.delete('/', protect, admin, async (req, res) => {
  try {
    await Transaction.deleteMany({});
    res.json({ message: 'All transactions deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
