import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, ChevronRight, ChevronLeft } from 'lucide-react';

const MovieRow = ({ title, movies }) => {
  const navigate = useNavigate();
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;
  
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-1 group cursor-pointer hover:text-gray-300 transition-colors">
          {title} <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-primary" />
        </h2>
      </div>
      
      <div className="group/row relative">
        <button 
          onClick={() => scroll('left')} 
          className="absolute left-0 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/80 w-12 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity rounded-r-lg"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>

        <div ref={rowRef} className="flex gap-2 md:gap-4 overflow-x-auto py-8 scrollbar-hide scroll-smooth">
          {movies.map(movie => (
            <div
              key={movie.movie_id}
              onClick={() => navigate(`/movie/${movie.movie_id}`)}
              className="shrink-0 w-32 md:w-48 lg:w-56 group relative overflow-hidden rounded-md aspect-[2/3] transition-all duration-300 hover:scale-125 hover:z-50 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-black border border-transparent hover:border-white/20"
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

        <button 
          onClick={() => scroll('right')} 
          className="absolute right-0 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/80 w-12 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity rounded-l-lg"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      </div>
    </div>
  );
};

export default MovieRow;
