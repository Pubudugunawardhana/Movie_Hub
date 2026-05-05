import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, Film } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-[100] px-6 py-4 flex justify-between items-center transition-colors duration-500 ${isScrolled ? 'bg-dark shadow-lg' : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent'}`}>
      <Link to="/" className="flex items-center gap-2 text-primary font-bold text-2xl tracking-tighter hover:scale-105 transition-transform">
        <Film className="w-8 h-8 fill-current" />
        <span>MOVIEHUB</span>
      </Link>

      <div className="flex items-center gap-6 text-sm font-medium">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <Link to="/movies" className="hover:text-primary transition-colors">Movies</Link>
        <Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link>
        
        <form onSubmit={handleSearch} className="relative flex items-center">
          <input 
            type="text" 
            placeholder="Search movies..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black/50 border border-secondary rounded-full py-1 px-4 pr-10 text-sm focus:outline-none focus:border-primary transition-colors"
          />
          <button type="submit" className="absolute right-3 text-gray-400 hover:text-white">
            <Search className="w-4 h-4" />
          </button>
        </form>

        {user ? (
          <div className="flex items-center gap-4">
            {user.subscribed ? (
              <Link to="/subscription" className="text-[#E50914] font-bold text-xs hidden md:block capitalize border border-[#E50914]/50 px-3 py-1 rounded-full bg-[#E50914]/10 hover:bg-[#E50914]/20 transition-all cursor-pointer">
                {user.plan && user.plan !== 'none' ? `${user.plan} Plan` : 'Premium Member'}
              </Link>
            ) : (
              <Link to="/subscription" className="hover:text-primary transition-colors hidden md:block font-bold">Subscribe</Link>
            )}
            <div className="relative group">
              <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center font-bold text-sm text-primary">
                  {user.name?.[0]?.toUpperCase()}
                </div>
              </button>
              <div className="absolute right-0 top-10 bg-[#1a1a1a] border border-secondary rounded-xl shadow-2xl w-48 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link to="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-secondary transition-colors text-sm"><User className="w-4 h-4" /> My Profile</Link>
                {user.isAdmin && <Link to="/admin" className="flex items-center gap-2 px-4 py-2 hover:bg-secondary transition-colors text-sm text-yellow-400"><Film className="w-4 h-4" /> Admin Panel</Link>}
                <hr className="border-secondary my-1" />
                <button onClick={logout} className="flex items-center gap-2 w-full px-4 py-2 hover:bg-secondary transition-colors text-sm text-red-400">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/signin" className="text-white hover:text-primary transition-colors font-medium">Sign In</Link>
            <Link to="/signup" className="bg-primary px-4 py-1.5 rounded text-white font-semibold hover:bg-red-700 transition-all">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
