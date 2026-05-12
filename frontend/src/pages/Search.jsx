import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Play, Info } from 'lucide-react';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [language, setLanguage] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const currentQuery = searchParams.get('q') || '';
      const res = await axios.get(`http://localhost:5000/api/movies/search?query=${currentQuery}&language=${language}`);
      setMovies(res.data);
      if (currentQuery !== query) setQuery(currentQuery);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [searchParams, language]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ q: query });
  };

  return (
    <div className="min-h-screen pt-24 px-6 md:px-12">
      <h1 className="text-3xl font-bold mb-8">Search Movies</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title..."
            className="flex-1 bg-secondary text-white p-3 rounded focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button type="submit" className="bg-primary px-6 rounded font-bold hover:bg-primary/90">Search</button>
        </form>
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-secondary text-white p-3 rounded focus:outline-none"
        >
          <option value="">All Languages</option>
          <option value="English">English</option>
          <option value="Tamil">Tamil</option>
          <option value="Sinhala">Sinhala</option>
          <option value="Hindi">Hindi</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading results...</div>
      ) : (
        <div>
          <h2 className="text-xl mb-4 text-gray-300">Found {movies.length} results</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map(movie => (
              <div key={movie.movie_id} className="group relative overflow-hidden rounded-lg aspect-[2/3] transition-all duration-300 hover:scale-105 cursor-pointer">
                <img src={movie.poster_url || `https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1159&sig=${movie.movie_id}`} alt={movie.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <h3 className="font-bold text-sm">{movie.title}</h3>
                  <div className="flex gap-2 mt-2">
                    <button className="p-1.5 bg-white text-black rounded-full"><Play className="w-3 h-3 fill-current" /></button>
                    <button className="p-1.5 border border-white rounded-full"><Info className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
