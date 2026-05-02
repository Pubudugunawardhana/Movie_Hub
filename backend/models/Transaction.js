const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  plan: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
