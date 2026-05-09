import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Film, Eye, EyeOff } from 'lucide-react';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      if (res.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
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
        <h2 className="text-3xl font-bold mb-6">Sign In</h2>
        {error && <div className="bg-primary/20 text-primary p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="email" 
              placeholder="Email or phone number" 
              className="w-full bg-[#333] text-white p-4 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              className="w-full bg-[#333] text-white p-4 pr-12 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded transition-colors">
            Sign In
          </button>
          <div className="flex justify-between items-center text-sm text-gray-400 mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-gray-500" /> Remember me
            </label>
            <Link to="/forgot-password" title="Forgot Password" className="hover:underline">Forgot password?</Link>
          </div>
        </form>
        <p className="text-gray-400 mt-8">
          New to MovieHub? <Link to="/signup" className="text-white hover:underline font-semibold">Sign up now</Link>.
        </p>
      </div>
    </div>
  );
};

export default SignIn;
