import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Play, Star, Clock, Calendar, Globe, Users, Lock } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/movies/${id}`);
        setMovie(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
    </div>
  );

  if (!movie) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">Movie not found.</div>
  );

  return (
    <div className="min-h-screen">
      {/* Backdrop */}
      <div className="relative h-[60vh]">
        <img
          src={`https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=2000&sig=${movie.movie_id}`}
          alt={movie.title}
          className="w-full h-full object-cover brightness-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative -mt-64 z-10 px-6 md:px-12 pb-20">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Poster */}
          <div className="shrink-0">
            <img
              src={movie.poster_url || `https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400&sig=${movie.movie_id}`}
              alt={movie.title}
              className="w-48 md:w-64 rounded-xl shadow-2xl border border-secondary/50"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-3">{movie.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6">
              {movie.ibm_rating > 0 && (
                <span className="flex items-center gap-1 text-green-400 font-bold">
                  <Star className="w-4 h-4 fill-current" /> {movie.ibm_rating}/10 IBM Rating
                </span>
              )}
              {movie.runtime_minutes && (
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {movie.runtime_minutes} min</span>
              )}
              {movie.release_date && (
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(movie.release_date).getFullYear()}</span>
              )}
              {movie.language && (
                <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {movie.language}</span>
              )}
              {movie.category?.name && (
                <span className="bg-primary/20 text-primary px-3 py-0.5 rounded-full">{movie.category.name}</span>
              )}
            </div>

            <p className="text-gray-300 text-base leading-relaxed mb-8 max-w-2xl">{movie.summary}</p>

            {/* Director */}
            {movie.director && (
              <p className="text-gray-400 mb-6"><span className="text-white font-semibold">Director:</span> {movie.director}</p>
            )}

            {/* Actions */}
            <div className="flex gap-4 mb-10">
              {user && user.subscribed ? (
                <button
                  onClick={() => navigate(`/watch/${movie.movie_id}`)}
                  className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition-all shadow-lg shadow-primary/30"
                >
                  <Play className="fill-current" /> Watch Now
                </button>
              ) : (
                <button
                  onClick={() => navigate('/subscription')}
                  className="flex items-center gap-2 bg-secondary text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary/80 transition-all border border-primary/50"
                >
                  <Lock className="w-5 h-5" /> Subscribe to Watch
                </button>
              )}
            </div>

            {/* Cast */}
            {movie.actors && movie.actors.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> Cast & Crew</h3>
                <div className="flex flex-wrap gap-3">
                  {movie.actors.map((actor, i) => (
                    <div key={i} className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full text-sm border border-secondary">
                      <div className="w-7 h-7 rounded-full bg-primary/30 flex items-center justify-center font-bold text-xs">
                        {(actor.name || 'A')[0]}
                      </div>
                      <span>{actor.name || actor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
