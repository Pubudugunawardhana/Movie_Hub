import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, Trash2, Save, Crown, ArrowRight } from 'lucide-react';

const UserProfile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo'))?.token}` }
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      await axios.put('http://localhost:5000/api/users/profile', { name, email, password: password || undefined }, getAuthHeader());
      setSuccess('Profile updated successfully!');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    try {
      await axios.delete('http://localhost:5000/api/users/profile', getAuthHeader());
      logout();
      navigate('/');
    } catch (err) {
      setError('Failed to delete account');
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-6 mb-10">
          <div className="w-20 h-20 rounded-full bg-primary/30 flex items-center justify-center text-3xl font-bold text-primary">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user?.name}</h1>
            <p className="text-gray-400">{user?.email}</p>
            <span className={`text-xs font-bold mt-1 inline-block px-3 py-1 rounded-full ${user?.subscribed ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
              {user?.subscribed ? '✓ Subscribed' : 'No Subscription'}
            </span>
          </div>
        </div>

        <div className="bg-secondary/50 border border-secondary rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-6">Edit Profile</h2>
          {success && <div className="bg-green-500/20 text-green-400 p-3 rounded mb-4">{success}</div>}
          {error && <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">{error}</div>}
          
          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2"><User className="w-4 h-4" /> Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-dark text-white p-4 rounded-lg border border-secondary focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2"><Mail className="w-4 h-4" /> Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-dark text-white p-4 rounded-lg border border-secondary focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2"><Lock className="w-4 h-4" /> New Password (leave blank to keep current)</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-dark text-white p-4 rounded-lg border border-secondary focus:outline-none focus:border-primary" />
            </div>
            <button type="submit" disabled={loading} className="flex items-center gap-2 bg-primary hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition-all">
              <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>

          <hr className="border-secondary my-8" />

          {/* Subscription Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Crown className="w-5 h-5 text-yellow-400" /> Subscription</h3>
            {user?.subscribed ? (
              <div className="bg-gradient-to-r from-[#E50914]/10 to-transparent border border-[#E50914]/30 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Current Plan</p>
                    <p className="text-2xl font-bold text-white capitalize">{user.plan || 'Premium'} Plan</p>
                    <span className="text-xs text-green-400 font-semibold">✓ Active</span>
                  </div>
                  <button
                    onClick={() => navigate('/subscription')}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-5 py-2.5 rounded-xl transition-all"
                  >
                    Change Plan <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-secondary/30 border border-secondary rounded-xl p-6 flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">No Active Subscription</p>
                  <p className="text-gray-500 text-sm">Subscribe to unlock all movies and series</p>
                </div>
                <button
                  onClick={() => navigate('/subscription')}
                  className="flex items-center gap-2 bg-[#E50914] hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all"
                >
                  Subscribe Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <hr className="border-secondary my-8" />

          <div>
            <h3 className="text-lg font-bold text-red-400 mb-2">Danger Zone</h3>
            <p className="text-gray-500 text-sm mb-4">Permanently delete your account and all associated data.</p>
            <button onClick={handleDelete} className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 font-bold px-6 py-3 rounded-xl border border-red-500/50 transition-all">
              <Trash2 className="w-4 h-4" /> Delete My Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
