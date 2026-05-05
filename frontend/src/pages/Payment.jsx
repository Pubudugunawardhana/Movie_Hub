import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Lock, CheckCircle } from 'lucide-react';

// Stripe Test publishable key (safe to expose)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#ffffff',
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px',
      '::placeholder': { color: '#6b7280' },
    },
    invalid: { color: '#ef4444' },
  },
};

const CheckoutForm = ({ plan, price }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState(user?.name || '');

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      
      // FOR TESTING SITE: Bypass Stripe entirely and just activate subscription
      await axios.post(
        'http://localhost:5000/api/payment/confirm',
        { plan, price },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const updatedUser = { ...user, subscribed: true, plan: plan };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-3">Payment Successful! 🎉</h2>
        <p className="text-gray-400">Your subscription is now active. Redirecting to home...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Cardholder Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name on card"
          className="w-full bg-secondary text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Card Details</label>
        <div className="bg-secondary p-4 rounded-lg border border-secondary hover:border-primary transition-colors">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>
      {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg text-sm">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-primary hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Lock className="w-4 h-4" />
        {loading ? 'Processing...' : `Pay $${price} Securely`}
      </button>
    </form>
  );
};

const Payment = () => {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'standard';
  const price = searchParams.get('price') || '9.99';

  const planNames = { basic: 'Basic', standard: 'Standard', premium: 'Premium' };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-12 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-secondary/50 border border-secondary rounded-2xl p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-bold mb-4">
              <Lock className="w-4 h-4" /> Secure Payment
            </div>
            <h1 className="text-2xl font-bold">{planNames[plan]} Plan</h1>
            <p className="text-gray-400 mt-1">Billed monthly. Cancel anytime.</p>
            <div className="mt-4 text-4xl font-extrabold">${price}<span className="text-gray-500 text-lg font-normal">/mo</span></div>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm plan={plan} price={price} />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default Payment;
