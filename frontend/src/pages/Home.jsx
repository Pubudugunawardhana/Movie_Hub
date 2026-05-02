import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Play, Info, Film, LogIn, UserPlus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import MovieRow from '../components/MovieRow';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/movies');
        setMovies(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const heroMovies = movies.slice(0, 3);
  const trendingMovies = movies.filter(m => m.type !== 'series');
  const series = movies.filter(m => m.type === 'series');
  const sampleMovies = movies.filter(m => m.is_sample);

  return (
    <div className="min-h-screen bg-dark">
      {/* Hero Section Slideshow */}
      <section className="relative h-[100vh]">
        {heroMovies.length > 0 ? (
          <div className="relative w-full h-full flex items-center px-6 md:px-12 pt-20">
            <div className="absolute inset-0 z-0">
              <img 
                src={heroMovies[0].poster_url || `https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=2000`} 
                alt="Hero Background"
                className="w-full h-full object-cover brightness-50"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-dark/40"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent"></div>
            </div>

            <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="max-w-2xl">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter drop-shadow-lg leading-tight text-white">
                  Welcome to <span className="text-[#E50914]">Movie Hub</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-300 mb-10 drop-shadow-md font-medium leading-relaxed">
                  Experience the ultimate entertainment with our exclusive collection of blockbusters, trending series, and cinematic masterpieces.
                </p>
                
                {user ? (
                   <div className="flex gap-4">
                     <button onClick={() => {
                        document.getElementById('trending-movies')?.scrollIntoView({ behavior: 'smooth' });
                     }} className="flex items-center justify-center gap-3 bg-[#E50914] text-white px-8 py-4 rounded-full md:text-lg font-bold hover:bg-red-700 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(229,9,20,0.4)]">
                       <Film className="fill-current w-6 h-6" /> Browse Movies
                     </button>
                   </div>
                ) : (
                  <div className="flex flex-wrap gap-4">
                    <button onClick={() => navigate('/signin')} className="flex items-center justify-center gap-3 bg-[#E50914] text-white px-8 py-4 rounded-full md:text-lg font-bold hover:bg-red-700 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(229,9,20,0.4)]">
                      <LogIn className="w-5 h-5" /> Sign In
                    </button>
                    <button onClick={() => navigate('/signup')} className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full md:text-lg font-bold hover:bg-white/20 hover:scale-105 transition-all duration-300">
                      <UserPlus className="w-5 h-5" /> Sign Up
                    </button>
                  </div>
                )}
              </div>

              {/* Right Content - Trending Movie Cards */}
              <div className="hidden lg:flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-4 scrollbar-hide">
                {movies.slice(0, 3).map(movie => (
                  <div key={movie.movie_id} onClick={() => navigate(`/movie/${movie.movie_id}`)} className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl flex overflow-hidden cursor-pointer hover:border-[#E50914]/50 transition-all hover:scale-[1.02] group shadow-2xl">
                    <img src={movie.poster_url || `https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=200`} alt={movie.title} className="w-32 h-44 object-cover group-hover:brightness-110 transition-all" />
                    <div className="p-5 flex flex-col justify-center">
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{movie.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                         <span className="bg-white/10 px-2 py-1 rounded font-semibold text-white">{movie.release_date ? new Date(movie.release_date).getFullYear() : '2023'}</span>
                         {movie.runtime_minutes && <span className="font-semibold">{movie.runtime_minutes} min</span>}
                      </div>
                      <div className="flex items-center gap-2 text-[#E50914] font-bold text-sm group-hover:text-red-400 transition-colors">
                        <Play className="w-4 h-4 fill-current" /> Watch Trailer
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center px-6 md:px-12 bg-dark">
             <div className="relative z-10 max-w-2xl">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tighter">Welcome to MovieHub</h1>
                <p className="text-lg text-gray-300 mb-8">Loading amazing content for you...</p>
             </div>
          </div>
        )}
      </section>

      {/* Site Description */}
      <section className="relative z-20 px-6 md:px-12 py-12 bg-dark/80 border-y border-secondary/30 backdrop-blur-sm -mt-32 mb-10 mx-6 md:mx-12 rounded-xl">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="bg-primary/20 p-4 rounded-full">
            <Film className="w-12 h-12 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">The Ultimate Movie Experience</h2>
            <p className="text-gray-400">
              MovieHub offers thousands of recently released movies, exclusive series, and sample trailers. 
              Search by language, explore categories, and enjoy uninterrupted streaming without downloads.
            </p>
          </div>
        </div>
      </section>

      {/* Movie Rows */}
      <div className="relative z-20 px-6 md:px-12 space-y-12 pb-20">
        
        <div id="trending-movies">
          <MovieRow title="Trending Movies" movies={trendingMovies} />
        </div>
        {series.length > 0 && <MovieRow title="Popular Series" movies={series} />}
        {sampleMovies.length > 0 && <MovieRow title="Sample Movies & Trailers" movies={sampleMovies} />}
        
      </div>
    </div>
  );
};

export default Home;
