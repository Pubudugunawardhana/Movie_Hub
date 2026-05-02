import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Play, Info, ChevronRight, Film } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen">
      {/* Hero Section Slideshow */}
      <section className="relative h-[85vh]">
        {heroMovies.length > 0 ? (
          <Swiper
            modules={[Autoplay, EffectFade, Navigation, Pagination]}
            effect="fade"
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="w-full h-full"
          >
            {heroMovies.map((movie) => (
              <SwiperSlide key={`hero-${movie.movie_id}`}>
                <div className="relative w-full h-full flex items-center px-6 md:px-12">
                  <div className="absolute inset-0 z-0">
                    <img 
                      src={movie.poster_url || `https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=2000&sig=${movie.movie_id}`} 
                      alt={movie.title}
                      className="w-full h-full object-cover brightness-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent"></div>
                  </div>

                  <div className="relative z-10 max-w-2xl">
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tighter drop-shadow-lg">{movie.title}</h1>
                    <p className="text-lg text-gray-300 mb-8 line-clamp-3 drop-shadow-md">
                      {movie.summary || "Experience the ultimate entertainment with MovieHub's exclusive collection of blockbusters and trending series."}
                    </p>
                    <div className="flex gap-4">
                      <button className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded font-bold hover:bg-red-700 transition-all shadow-lg shadow-primary/30">
                        <Play className="fill-current" /> Play Now
                      </button>
                      <button className="flex items-center gap-2 bg-secondary/80 text-white px-8 py-3 rounded font-bold hover:bg-secondary transition-all backdrop-blur-md">
                        <Info /> More Info
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
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
      <section className="relative z-20 px-6 md:px-12 py-12 bg-dark/50 border-y border-secondary backdrop-blur-sm -mt-10 mb-10 mx-6 md:mx-12 rounded-xl">
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
        
        <MovieRow title="Trending Movies" movies={trendingMovies} />
        {series.length > 0 && <MovieRow title="Popular Series" movies={series} />}
        {sampleMovies.length > 0 && <MovieRow title="Sample Movies & Trailers" movies={sampleMovies} />}
        
      </div>
    </div>
  );
};

// Extracted Component for reusability
const MovieRow = ({ title, movies }) => {
  const navigate = useNavigate();
  if (!movies || movies.length === 0) return null;
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-1 group cursor-pointer hover:text-primary transition-colors">
          {title} <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
        {movies.map(movie => (
          <div
            key={movie.movie_id}
            onClick={() => navigate(`/movie/${movie.movie_id}`)}
            className="snap-start shrink-0 w-40 md:w-48 lg:w-56 group relative overflow-hidden rounded-lg aspect-[2/3] transition-all duration-300 hover:scale-105 cursor-pointer border border-secondary/50 hover:border-primary"
          >
            <img src={movie.poster_url || `https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400&sig=${movie.movie_id}`} alt={movie.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
              <h3 className="font-bold text-sm text-white mb-1">{movie.title}</h3>
              {movie.ibm_rating > 0 && <span className="text-xs font-bold text-green-500 mb-2">{movie.ibm_rating}/10 Match</span>}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/watch/${movie.movie_id}`); }}
                  className="p-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Play className="w-4 h-4 fill-current" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/movie/${movie.movie_id}`); }}
                  className="p-2 border-2 border-gray-400 text-white rounded-full hover:border-white transition-colors"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
