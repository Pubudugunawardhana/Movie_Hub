import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Play, Info, Film } from 'lucide-react';
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
                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent"></div>
                  </div>

                  <div className="relative z-10 max-w-2xl">
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tighter drop-shadow-lg">{movie.title}</h1>
                    <p className="text-lg text-gray-300 mb-8 line-clamp-3 drop-shadow-md font-medium">
                      {movie.summary || "Experience the ultimate entertainment with MovieHub's exclusive collection of blockbusters and trending series."}
                    </p>
                    <div className="flex gap-4">
                      <button className="flex items-center justify-center gap-2 bg-white text-black px-8 py-3 rounded md:text-lg font-bold hover:bg-white/80 transition-colors">
                        <Play className="fill-current w-6 h-6" /> Play
                      </button>
                      <button className="flex items-center justify-center gap-2 bg-gray-500/60 text-white px-8 py-3 rounded md:text-lg font-bold hover:bg-gray-500/40 transition-colors">
                        <Info className="w-6 h-6" /> More Info
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
        
        <MovieRow title="Trending Movies" movies={trendingMovies} />
        {series.length > 0 && <MovieRow title="Popular Series" movies={series} />}
        {sampleMovies.length > 0 && <MovieRow title="Sample Movies & Trailers" movies={sampleMovies} />}
        
      </div>
    </div>
  );
};

export default Home;
