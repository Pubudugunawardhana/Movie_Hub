import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Film, Users, Trash2, Plus, Edit, CheckCircle, X, Download, MessageSquare, Tag, User as UserIcon, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const { user, getAuthHeader } = useContext(AuthContext);
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [actors, setActors] = useState([]);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [form, setForm] = useState({ title: '', summary: '', language: 'English', type: 'movie', ibm_rating: 0, trailer_url: '', director: '' });
  const [posterFile, setPosterFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [newCategory, setNewCategory] = useState('');
  const [newActor, setNewActor] = useState('');

  // Filters
  const [searchTitle, setSearchTitle] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('All');
  const [filterType, setFilterType] = useState('All');

  const authHeaders = () => ({ headers: getAuthHeader() });

  useEffect(() => {
    if (!user || !user.isAdmin) { navigate('/'); return; }
    fetchMovies();
    fetchUsers();
    fetchTransactions();
    fetchEnquiries();
    fetchCategories();
    fetchActors();
  }, [user]);

  const fetchMovies = async () => {
    const res = await axios.get('http://localhost:5000/api/movies');
    setMovies(res.data);
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users', authHeaders());
      const sorted = res.data.sort((a, b) => {
        if (a.isAdmin === b.isAdmin) return 0;
        return a.isAdmin ? -1 : 1;
      });
      setUsers(sorted);
    } catch {}
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/transactions', authHeaders());
      setTransactions(res.data);
    } catch {}
  };

  const fetchEnquiries = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/enquiries', authHeaders());
      setEnquiries(res.data);
    } catch {}
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/categories', authHeaders());
      setCategories(res.data);
    } catch {}
  };

  const fetchActors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/actors', authHeaders());
      setActors(res.data);
    } catch {}
  };

  // Movie Actions
  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Delete this movie?')) return;
    await axios.delete(`http://localhost:5000/api/movies/${id}`, authHeaders());
    fetchMovies();
  };

  const handleSubmitMovie = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      if (posterFile) formData.append('poster', posterFile);
      
      if (editingId) {
        await axios.put(`http://localhost:5000/api/movies/${editingId}`, formData, authHeaders());
      } else {
        formData.append('movie_id', Date.now());
        await axios.post('http://localhost:5000/api/movies', formData, authHeaders());
      }
      setForm({ title: '', summary: '', language: 'English', type: 'movie', ibm_rating: 0, trailer_url: '', director: '' });
      setPosterFile(null);
      setEditingId(null);
      fetchMovies();
      setActiveTab('movies');
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving movie');
    }
  };

  const startEdit = (movie) => {
    setForm({
      title: movie.title, summary: movie.summary || '', language: movie.language, type: movie.type,
      ibm_rating: movie.ibm_rating || 0, trailer_url: movie.trailer_url || '', director: movie.director || '',
    });
    setPosterFile(null); setEditingId(movie.movie_id); setActiveTab('add'); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // User Actions
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await axios.delete(`http://localhost:5000/api/users/${id}`, authHeaders());
    fetchUsers();
  };

  const handleToggleUserStatus = async (targetUser) => {
    if (targetUser.isAdmin) return alert('Cannot deactivate an admin user');
    if (!window.confirm(`Are you sure?`)) return;
    await axios.put(`http://localhost:5000/api/users/${targetUser._id}/status`, {}, authHeaders());
    fetchUsers();
  };

  // Enquiry Actions
  const handleToggleEnquiryStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'resolved' : 'pending';
    await axios.put(`http://localhost:5000/api/enquiries/${id}`, { status: newStatus }, authHeaders());
    fetchEnquiries();
  };

  // Metadata Actions
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    await axios.post('http://localhost:5000/api/categories', { name: newCategory }, authHeaders());
    setNewCategory(''); fetchCategories();
  };
  const handleDeleteCategory = async (id) => {
    await axios.delete(`http://localhost:5000/api/categories/${id}`, authHeaders()); fetchCategories();
  };
  const handleAddActor = async (e) => {
    e.preventDefault();
    if (!newActor.trim()) return;
    await axios.post('http://localhost:5000/api/actors', { name: newActor }, authHeaders());
    setNewActor(''); fetchActors();
  };
  const handleDeleteActor = async (id) => {
    await axios.delete(`http://localhost:5000/api/actors/${id}`, authHeaders()); fetchActors();
  };

  // Export Data
  const downloadCSV = () => {
    const headers = ['Date', 'User Email', 'Plan', 'Amount ($)'];
    const rows = transactions.map(t => [
      new Date(t.createdAt).toLocaleDateString(),
      t.user?.email || 'Unknown',
      t.plan || 'standard',
      t.amount
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions_report.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const filteredMovies = movies.filter(m => {
    return m.title.toLowerCase().includes(searchTitle.toLowerCase()) && 
           (filterLanguage === 'All' || m.language === filterLanguage) && 
           (filterType === 'All' || m.type === filterType);
  });

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-12">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <div className="bg-primary/20 p-2 rounded-lg"><Film className="w-7 h-7 text-primary" /></div>
        Admin Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-secondary">
        {[
          ['overview', 'Overview'],
          ['movies', 'All Movies'], 
          ['users', 'Users'],
          ['subscribers', 'Transactions & Analytics'],
          ['enquiries', 'Enquiries'],
          ['metadata', 'Metadata']
        ].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)} className={`px-6 py-3 font-semibold transition-colors border-b-2 -mb-[2px] ${activeTab === id ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Movies', value: movies.length, icon: <Film />, color: 'text-primary' },
              { label: 'Total Users', value: users.length, icon: <Users />, color: 'text-blue-400' },
              { label: 'Subscribed', value: users.filter(u => u.subscribed).length, icon: <CheckCircle />, color: 'text-green-400' },
              { label: 'Total Revenue', value: `$${transactions.reduce((acc, t) => acc + t.amount, 0).toFixed(2)}`, icon: <Activity />, color: 'text-yellow-400' },
            ].map((stat, i) => (
              <div key={i} className="bg-secondary/50 border border-secondary rounded-xl p-5">
                <div className={`mb-2 ${stat.color}`}>{stat.icon}</div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Recent Movies */}
            <div className="bg-secondary/50 border border-secondary rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Film className="w-5 h-5 text-primary"/> Recent Movies</h3>
              <div className="space-y-4">
                {[...movies].reverse().slice(0, 5).map(m => (
                  <div key={m._id} className="flex gap-3 items-center">
                    <img src={m.poster_url || `https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=100&sig=${m.movie_id}`} alt={m.title} className="w-10 h-14 object-cover rounded" />
                    <div>
                      <p className="font-bold text-sm">{m.title}</p>
                      <p className="text-xs text-gray-500">{m.language} • {m.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-secondary/50 border border-secondary rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-blue-400"/> Newest Users</h3>
              <div className="space-y-4">
                {[...users].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0, 5).map(u => (
                  <div key={u._id} className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center font-bold text-blue-400">
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{u.name}</p>
                      <p className="text-xs text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-secondary/50 border border-secondary rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-green-400"/> Recent Transactions</h3>
              <div className="space-y-4">
                {transactions.slice(0, 5).map(t => (
                  <div key={t._id} className="flex justify-between items-center border-b border-secondary pb-3 last:border-0">
                    <div>
                      <p className="font-bold text-sm">{t.user?.email || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="font-bold text-green-400">+${t.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Movies Tab */}
      {activeTab === 'movies' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-secondary/30 p-4 rounded-xl border border-secondary">
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <input type="text" placeholder="Search Title..." value={searchTitle} onChange={e => setSearchTitle(e.target.value)} className="bg-dark text-white px-4 py-2 rounded-lg border border-secondary focus:outline-none focus:border-primary w-full md:w-48" />
              <select value={filterLanguage} onChange={e => setFilterLanguage(e.target.value)} className="bg-dark text-white px-4 py-2 rounded-lg border border-secondary focus:outline-none">
                <option value="All">All Languages</option><option>English</option><option>Tamil</option><option>Sinhala</option><option>Hindi</option>
              </select>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-dark text-white px-4 py-2 rounded-lg border border-secondary focus:outline-none">
                <option value="All">All Types</option><option value="movie">Movie</option><option value="series">Series</option>
              </select>
            </div>
            <button onClick={() => { setEditingId(null); setForm({ title: '', summary: '', language: 'English', type: 'movie', ibm_rating: 0, trailer_url: '', director: '' }); setPosterFile(null); setActiveTab('add'); }} className="flex items-center gap-2 bg-primary hover:bg-red-700 text-white font-bold px-6 py-2 rounded-xl transition-all w-full md:w-auto justify-center">
              <Plus className="w-5 h-5" /> Add New Movie
            </button>
          </div>

          {filteredMovies.map(movie => (
            <div key={movie.movie_id} className="flex items-center justify-between bg-secondary/50 border border-secondary rounded-xl p-4 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-4">
                <img src={movie.poster_url || `https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=100&sig=${movie.movie_id}`} alt={movie.title} className="w-12 h-16 object-cover rounded-lg" />
                <div>
                  <h3 className="font-bold">{movie.title}</h3>
                  <div className="flex gap-2 mt-1 text-xs text-gray-500">
                    <span className="bg-dark px-2 py-0.5 rounded">{movie.language}</span>
                    <span className="bg-dark px-2 py-0.5 rounded">{movie.type}</span>
                    {movie.director && <span className="bg-dark border border-gray-700 px-2 py-0.5 rounded text-gray-400">Dir: {movie.director}</span>}
                    <span className="bg-green-900/50 text-green-400 px-2 py-0.5 rounded">IBM: {movie.ibm_rating || 0}/10</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(movie)} className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDeleteMovie(movie.movie_id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Movie Form */}
      {activeTab === 'add' && (
        <div className="max-w-2xl">
          <form onSubmit={handleSubmitMovie} className="bg-secondary/50 border border-secondary rounded-2xl p-8 space-y-5">
            {/* Same form as before */}
            <h2 className="text-xl font-bold">{editingId ? 'Edit Movie' : 'Add New Movie'}</h2>
            <div><label className="block text-sm text-gray-400 mb-2">Title *</label><input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-dark text-white p-4 rounded-lg border border-secondary focus:border-primary" /></div>
            <div><label className="block text-sm text-gray-400 mb-2">Summary</label><textarea rows={4} value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} className="w-full bg-dark text-white p-4 rounded-lg border border-secondary" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm text-gray-400 mb-2">Language</label><select value={form.language} onChange={e => setForm({...form, language: e.target.value})} className="w-full bg-dark text-white p-4 rounded-lg border border-secondary"><option>English</option><option>Tamil</option><option>Sinhala</option><option>Hindi</option></select></div>
              <div><label className="block text-sm text-gray-400 mb-2">Type</label><select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full bg-dark text-white p-4 rounded-lg border border-secondary"><option value="movie">Movie</option><option value="series">Series</option></select></div>
            </div>
            <div><label className="block text-sm text-gray-400 mb-2">Director</label><input value={form.director} onChange={e => setForm({...form, director: e.target.value})} className="w-full bg-dark text-white p-4 rounded-lg border border-secondary" /></div>
            <div><label className="block text-sm text-gray-400 mb-2">Trailer URL</label><input value={form.trailer_url} onChange={e => setForm({...form, trailer_url: e.target.value})} className="w-full bg-dark text-white p-4 rounded-lg border border-secondary" /></div>
            <div><label className="block text-sm text-gray-400 mb-2">Poster Image</label><input type="file" accept="image/*" onChange={e => setPosterFile(e.target.files[0])} className="w-full bg-dark text-white p-4 rounded-lg border border-secondary" /></div>
            <div><label className="block text-sm text-gray-400 mb-2">IBM Rating</label><input type="number" min={0} max={10} step={0.1} value={form.ibm_rating} onChange={e => setForm({...form, ibm_rating: parseFloat(e.target.value)})} className="w-full bg-dark text-white p-4 rounded-lg border border-secondary" /></div>
            <div className="flex gap-3">
              <button type="submit" className="bg-primary hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl">{editingId ? 'Update' : 'Add'}</button>
              {editingId && <button type="button" onClick={() => setActiveTab('movies')} className="bg-secondary text-gray-400 font-bold px-8 py-3 rounded-xl hover:text-white">Cancel</button>}
            </div>
          </form>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-3">
          {users.map(u => (
            <div key={u._id} className="flex items-center justify-between bg-secondary/50 border border-secondary rounded-xl p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center font-bold text-primary">{u.name?.[0]?.toUpperCase()}</div>
                <div><h3 className="font-bold">{u.name}</h3><p className="text-sm text-gray-500">{u.email}</p></div>
              </div>
              <div className="flex gap-2 items-center">
                {u.isAdmin && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full font-bold">Admin</span>}
                <span className={`text-xs px-3 py-1 rounded-full font-bold ${u.subscribed ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-500'}`}>{u.subscribed ? 'Subscribed' : 'Free'}</span>
                <span className={`text-xs px-3 py-1 rounded-full font-bold ${u.isActive !== false ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>{u.isActive !== false ? 'Active' : 'Inactive'}</span>
                <button onClick={() => handleToggleUserStatus(u)} className="ml-2 px-3 py-1 bg-secondary text-gray-300 text-sm font-bold rounded-lg hover:bg-gray-700">{u.isActive !== false ? 'Deactivate' : 'Activate'}</button>
                <button onClick={() => handleDeleteUser(u._id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'subscribers' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Transactions & Analytics</h2>
            <button onClick={downloadCSV} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-5 py-2 rounded-xl transition-colors">
              <Download className="w-4 h-4" /> Download CSV
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-secondary/50 border border-secondary rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-center">User Subscriptions</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={[{ name: 'Subscribed', value: users.filter(u => u.subscribed).length }, { name: 'Free', value: users.length - users.filter(u => u.subscribed).length }]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"><Cell fill="#4ade80" /><Cell fill="#6b7280" /></Pie><Tooltip /><Legend /></PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-secondary/50 border border-secondary rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-center">User Status</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={[{ name: 'Active', value: users.filter(u => u.isActive !== false).length }, { name: 'Inactive', value: users.length - users.filter(u => u.isActive !== false).length }]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"><Cell fill="#60a5fa" /><Cell fill="#f87171" /></Pie><Tooltip /><Legend /></PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="bg-secondary/50 border border-secondary rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Revenue Chart</h3>
            <div className="h-80">
              {transactions.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Object.entries(transactions.reduce((acc, t) => { const m = new Date(t.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' }); acc[m] = (acc[m] || 0) + t.amount; return acc; }, {})).map(([name, revenue]) => ({ name, revenue })).reverse()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" /><XAxis dataKey="name" stroke="#9ca3af" /><YAxis stroke="#9ca3af" /><Tooltip formatter={(val) => [`$${val.toFixed(2)}`, 'Revenue']} /><Legend /><Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <div className="flex items-center justify-center h-full text-gray-500">No data</div>}
            </div>
          </div>
        </div>
      )}

      {/* Enquiries Tab */}
      {activeTab === 'enquiries' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enquiries.length === 0 && <p className="text-gray-400">No messages found.</p>}
          {enquiries.map(enq => (
            <div key={enq._id} className="bg-secondary/50 border border-secondary rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold flex items-center gap-2"><MessageSquare className="w-4 h-4 text-primary"/> {enq.name}</h3>
                    <p className="text-sm text-gray-400">{enq.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded font-bold ${enq.status === 'resolved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {enq.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm bg-dark/50 p-3 rounded-lg mb-4 text-gray-300">"{enq.message}"</p>
              </div>
              <button onClick={() => handleToggleEnquiryStatus(enq._id, enq.status)} className={`w-full py-2 rounded-lg font-bold transition-colors ${enq.status === 'resolved' ? 'bg-secondary text-gray-400 hover:text-white' : 'bg-primary text-white hover:bg-red-700'}`}>
                Mark as {enq.status === 'resolved' ? 'Pending' : 'Resolved'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Metadata Tab */}
      {activeTab === 'metadata' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Categories */}
          <div className="bg-secondary/50 border border-secondary rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Tag className="w-5 h-5 text-primary"/> Manage Categories</h3>
            <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
              <input type="text" placeholder="New Category (e.g. Sci-Fi)" value={newCategory} onChange={e => setNewCategory(e.target.value)} className="flex-1 bg-dark text-white px-4 py-2 rounded-lg border border-secondary focus:outline-none focus:border-primary" />
              <button type="submit" className="bg-primary hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg">Add</button>
            </form>
            <div className="space-y-2">
              {categories.map(cat => (
                <div key={cat._id} className="flex justify-between items-center bg-dark p-3 rounded-lg border border-secondary">
                  <span>{cat.name}</span>
                  <button onClick={() => handleDeleteCategory(cat._id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4"/></button>
                </div>
              ))}
            </div>
          </div>

          {/* Actors */}
          <div className="bg-secondary/50 border border-secondary rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><UserIcon className="w-5 h-5 text-blue-400"/> Manage Actors</h3>
            <form onSubmit={handleAddActor} className="flex gap-2 mb-6">
              <input type="text" placeholder="New Actor (e.g. Tom Hardy)" value={newActor} onChange={e => setNewActor(e.target.value)} className="flex-1 bg-dark text-white px-4 py-2 rounded-lg border border-secondary focus:outline-none focus:border-primary" />
              <button type="submit" className="bg-primary hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg">Add</button>
            </form>
            <div className="space-y-2">
              {actors.map(actor => (
                <div key={actor._id} className="flex justify-between items-center bg-dark p-3 rounded-lg border border-secondary">
                  <span>{actor.name}</span>
                  <button onClick={() => handleDeleteActor(actor._id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4"/></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
