import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Film, Mail, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage(res.data.message || 'Check your email for the reset link!');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark relative px-6">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=2000" 
          alt="Background"
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md bg-black/80 p-10 rounded-xl backdrop-blur-sm border border-secondary">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 text-primary font-bold text-3xl tracking-tighter">
            <Film className="w-10 h-10 fill-current" />
            <span>MOVIEHUB</span>
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-2">Forgot Password</h2>
        <p className="text-gray-400 mb-6 text-sm">Enter your email and we'll send you a link to reset your password.</p>
        
        {error && <div className="bg-primary/20 text-primary p-3 rounded mb-4 text-sm">{error}</div>}
        {message && <div className="bg-green-500/20 text-green-500 p-3 rounded mb-4 text-sm">{message}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full bg-[#333] text-white p-4 pl-12 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <Link to="/signin" className="text-gray-400 hover:text-white flex items-center justify-center gap-2 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
