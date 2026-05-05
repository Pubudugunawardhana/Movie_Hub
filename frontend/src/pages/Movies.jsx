import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Play, Info, Filter } from 'lucide-react';
import MovieRow from '../components/MovieRow';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, categoriesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/movies'),
          axios.get('http://localhost:5000/api/categories')
        ]);
        setMovies(moviesRes.data);
        setCategories(categoriesRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-dark flex items-center justify-center text-white">Loading amazing content...</div>;
  }

  const featuredMovie = movies.length > 0 ? movies[Math.floor(Math.random() * Math.min(5, movies.length))] : null;
  const filteredMovies = selectedCategory === 'All' 
    ? movies 
    : movies.filter(m => m.category && m.category._id === selectedCategory);

  return (
    <div className="min-h-screen bg-dark pb-20">
      {/* Featured Hero */}
      {featuredMovie && selectedCategory === 'All' && (
        <section className="relative h-[80vh] md:h-[90vh]">
          <div className="absolute inset-0 z-0">
            <img 
              src={featuredMovie.poster_url || `https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=2000&sig=${featuredMovie.movie_id}`} 
              alt={featuredMovie.title}
              className="w-full h-full object-cover brightness-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-2xl px-6 md:px-12 flex flex-col justify-end h-full pb-32">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tighter drop-shadow-lg text-white">{featuredMovie.title}</h1>
            <p className="text-lg text-gray-300 mb-8 line-clamp-3 drop-shadow-md font-medium">
              {featuredMovie.summary || "Explore the best of cinema on MovieHub."}
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => navigate(`/watch/${featuredMovie.movie_id}`)}
                className="flex items-center justify-center gap-3 bg-white text-black px-8 py-3.5 rounded-lg md:text-lg font-bold hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                <Play className="fill-current w-6 h-6" /> Play
              </button>
              <button 
                onClick={() => navigate(`/movie/${featuredMovie.movie_id}`)}
                className="flex items-center justify-center gap-3 bg-gray-600/40 backdrop-blur-md border border-gray-500/30 text-white px-8 py-3.5 rounded-lg md:text-lg font-bold hover:bg-gray-600/60 hover:scale-105 transition-all duration-300"
              >
                <Info className="w-6 h-6" /> More Info
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Category Selector Pills */}
      <div className={`relative z-20 px-6 md:px-12 flex flex-col gap-6 ${selectedCategory === 'All' ? '-mt-24 mb-10' : 'pt-32 mb-10'}`}>
        <h2 className="text-3xl font-extrabold text-white drop-shadow-md">
          {selectedCategory === 'All' ? 'Browse Movies' : categories.find(c => c._id === selectedCategory)?.name}
        </h2>
        
        <div className="flex items-center gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`snap-start shrink-0 px-6 py-2.5 rounded-full font-bold text-sm md:text-base transition-all duration-300 border-2 ${
              selectedCategory === 'All' 
                ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-105' 
                : 'bg-black/50 text-gray-300 border-gray-600 hover:bg-gray-800 hover:border-white hover:text-white backdrop-blur-md'
            }`}
          >
            All Genres
          </button>
          
          {categories.map(c => (
            <button
              key={c._id}
              onClick={() => setSelectedCategory(c._id)}
              className={`snap-start shrink-0 px-6 py-2.5 rounded-full font-bold text-sm md:text-base transition-all duration-300 border-2 ${
                selectedCategory === c._id 
                  ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-105' 
                  : 'bg-black/50 text-gray-300 border-gray-600 hover:bg-gray-800 hover:border-white hover:text-white backdrop-blur-md'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-20 px-6 md:px-12">
        {selectedCategory === 'All' ? (
          /* Default View: Rows for each category */
          <div className="space-y-8">
            <MovieRow title="Recently Added" movies={movies.slice(0, 10)} />
            {categories.map(category => {
              const categoryMovies = movies.filter(m => m.category && m.category._id === category._id);
              if (categoryMovies.length === 0) return null;
              return (
                <MovieRow 
                  key={category._id} 
                  title={category.name} 
                  movies={categoryMovies} 
                />
              );
            })}
          </div>
        ) : (
          /* Filtered View: Grid of movies */
          <div>
            <div className="flex items-center gap-2 mb-6">
               <h3 className="text-gray-400 font-medium">Viewing category:</h3>
               <span className="text-white font-bold text-lg">{categories.find(c => c._id === selectedCategory)?.name}</span>
            </div>
            {filteredMovies.length === 0 ? (
              <div className="text-center py-20 text-gray-500">No movies found in this category.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredMovies.map(movie => (
                  <div
                    key={movie.movie_id}
                    onClick={() => navigate(`/movie/${movie.movie_id}`)}
                    className="group relative overflow-hidden rounded-md aspect-[2/3] transition-all duration-300 hover:scale-105 hover:z-50 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-black border border-transparent hover:border-white/20"
                  >
                    <img src={movie.poster_url || `https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400&sig=${movie.movie_id}`} alt={movie.title} className="w-full h-full object-cover" />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 translate-y-4 group-hover:translate-y-0">
                      <h3 className="font-bold text-sm text-white mb-1 line-clamp-1">{movie.title}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        {movie.ibm_rating > 0 && <span className="text-[10px] font-bold text-green-500 border border-green-500/30 bg-green-500/10 px-1 rounded">{movie.ibm_rating}/10 Match</span>}
                        <span className="text-[10px] border border-gray-500 px-1 text-gray-300 rounded uppercase">{movie.language}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/watch/${movie.movie_id}`); }}
                          className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full hover:bg-gray-300 transition-colors"
                        >
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/movie/${movie.movie_id}`); }}
                          className="w-8 h-8 flex items-center justify-center border-2 border-gray-400 text-white rounded-full hover:border-white transition-colors"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
