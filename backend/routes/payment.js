const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const Transaction = require('../models/Transaction');

// Pricing map
const PRICES = {
  basic: 499,
  standard: 999,
  premium: 1499,
};

// Create payment intent
router.post('/create-payment-intent', protect, async (req, res) => {
  const { plan } = req.body;
  const amount = PRICES[plan];
  if (!amount) return res.status(400).json({ message: 'Invalid plan' });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: { userId: req.user._id.toString(), plan },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/confirm', protect, async (req, res) => {
  try {
    const { plan, price } = req.body;
    await User.findByIdAndUpdate(req.user._id, { subscribed: true, plan: plan || 'standard' });
    
    // Log transaction
    const transaction = new Transaction({
      user: req.user._id,
      amount: parseFloat(price) || (PRICES[plan] ? PRICES[plan]/100 : 9.99),
      plan: plan || 'standard'
    });
    await transaction.save();

    res.json({ message: 'Subscription activated!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
