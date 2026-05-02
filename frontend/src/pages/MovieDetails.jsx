import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Play, Star, Clock, Calendar, Globe, Lock, ChevronRight, ChevronLeft, UserCircle2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import VideoPlayer from '../components/VideoPlayer';

// Interactive Star Rating Component
const StarRating = ({ rating, onChange, interactive = false }) => {
  const [hover, setHover] = React.useState(0);
  const stars = 5;
  return (
    <div className="flex gap-1">
      {Array.from({ length: stars }, (_, i) => i + 1).map(star => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onChange && onChange(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className={`transition-transform ${interactive ? 'cursor-pointer hover:scale-125' : 'cursor-default'}`}
        >
          <Star
            className={`w-7 h-7 transition-colors drop-shadow ${
              star <= (hover || rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-700 text-gray-600'
            }`}
          />
        </button>
      ))}
      {interactive && (
        <span className="ml-2 text-sm text-gray-400 self-center">{hover || rating}/5</span>
      )}
    </div>
  );
};

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Top Cast');
  
  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const { user, getAuthHeader } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Movie Details
        const movieRes = await axios.get(`http://localhost:5000/api/movies/${id}`);
        const fetchedMovie = movieRes.data;
        setMovie(fetchedMovie);

        // Fetch Related Movies (Same Category)
        if (fetchedMovie.category) {
          const relatedRes = await axios.get(`http://localhost:5000/api/movies/category/${fetchedMovie.category._id}`);
          setRelatedMovies(relatedRes.data.filter(m => m.movie_id !== id).slice(0, 4));
        }

        // Fetch Reviews
        const reviewsRes = await axios.get(`http://localhost:5000/api/reviews/movie/${id}`);
        setReviews(reviewsRes.data);

      } catch (err) {
        console.error('Error fetching details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      setSubmittingReview(true);
      setReviewError('');
      const res = await axios.post(
        'http://localhost:5000/api/reviews',
        { movie_id: id, rating, comment },
        { headers: getAuthHeader() }
      );
      // Prepend new review
      setReviews([{ ...res.data, user: { name: user.name, email: user.email } }, ...reviews]);
      setComment('');
      setRating(5);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const scrollCast = (direction) => {
    const row = document.getElementById('cast-row');
    if (row) {
      const { scrollLeft, clientWidth } = row;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      row.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
    </div>
  );

  if (!movie) return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center text-gray-400">Movie not found.</div>
  );

  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans pb-20">
      
      {/* Hero Section */}
      <div className="relative pt-24 px-6 md:px-12 lg:px-20 pb-16 flex flex-col md:flex-row gap-10 bg-gradient-to-b from-dark/80 to-[#141414]">
        
        {/* Background Image Setup */}
        <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
          <img 
            src={movie.poster_url || `https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=2000&sig=${movie.movie_id}`} 
            alt="backdrop" 
            className="w-full h-full object-cover blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
        </div>

        {/* Poster Left */}
        <div className="relative z-10 shrink-0 mx-auto md:mx-0">
          <img
            src={movie.poster_url || `https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400&sig=${movie.movie_id}`}
            alt={movie.title}
            className="w-64 md:w-80 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-gray-800"
          />
        </div>

        {/* Info Right */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 text-white drop-shadow-lg">{movie.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6 font-medium">
            {movie.ibm_rating > 0 && (
              <span className="flex items-center gap-1 text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                <Star className="w-4 h-4 fill-current" /> {movie.ibm_rating}/10 Match
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
              <span className="bg-red-600/20 text-red-500 px-3 py-0.5 rounded-full border border-red-600/30">{movie.category.name}</span>
            )}
          </div>

          <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 max-w-3xl drop-shadow">
            {movie.summary || "No summary available for this title."}
          </p>

          {movie.director && (
            <p className="text-gray-400 mb-8"><span className="text-white font-semibold">Director:</span> {movie.director}</p>
          )}

          <div className="flex gap-4">
              <button
                onClick={() => navigate(`/watch/${movie.movie_id}`)}
                className="flex items-center gap-2 bg-[#E50914] text-white px-8 py-3.5 rounded md:text-lg font-bold hover:bg-red-700 transition-colors shadow-[0_0_20px_rgba(229,9,20,0.4)]"
              >
                <Play className="fill-current w-6 h-6" /> Watch Now
              </button>
          </div>
        </div>
      </div>

      {/* Main Content Area (Tabs & Sidebar) */}
      <div className="px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column (Tabs) */}
        <div className="lg:col-span-2">
          
          {/* Tab Navigation */}
          <div className="flex gap-8 border-b border-gray-800 mb-8">
            {movie.type === 'series' && (
              <button 
                onClick={() => setActiveTab('Episodes')}
                className={`pb-4 font-bold text-lg transition-colors border-b-4 ${activeTab === 'Episodes' ? 'text-white border-[#E50914]' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
              >
                Episodes
              </button>
            )}
            <button 
              onClick={() => setActiveTab('Top Cast')}
              className={`pb-4 font-bold text-lg transition-colors border-b-4 ${activeTab === 'Top Cast' ? 'text-white border-[#E50914]' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
            >
              Top Cast
            </button>
            <button 
              onClick={() => setActiveTab('User Review')}
              className={`pb-4 font-bold text-lg transition-colors border-b-4 ${activeTab === 'User Review' ? 'text-white border-[#E50914]' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
            >
              User Review
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px]">
            {/* Top Cast Tab */}
            {activeTab === 'Top Cast' && (
              <div className="relative group/cast">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Top Cast ({movie.actors?.length || 0})</h3>
                </div>
                
                {movie.actors && movie.actors.length > 0 ? (
                  <div className="relative">
                    <button 
                      onClick={() => scrollCast('left')} 
                      className="absolute left-0 top-0 bottom-0 z-40 bg-black/60 hover:bg-black/90 w-10 flex items-center justify-center opacity-0 group-hover/cast:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>

                    <div id="cast-row" className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
                      {movie.actors.map((actor, i) => (
                        <div key={i} className="shrink-0 w-32 group cursor-pointer">
                          <div className="w-32 h-44 rounded-md overflow-hidden bg-gray-800 mb-3 relative border border-gray-800 transition-all hover:border-gray-500">
                            {actor.photo_url ? (
                              <img src={actor.photo_url} alt={actor.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                                <UserCircle2 className="w-12 h-12 mb-2" />
                                <span className="text-xs">No Photo</span>
                              </div>
                            )}
                          </div>
                          <h4 className="font-bold text-sm text-gray-200 line-clamp-1">{actor.name || actor}</h4>
                          <p className="text-xs text-gray-500 line-clamp-1">Actor</p>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => scrollCast('right')} 
                      className="absolute right-0 top-0 bottom-0 z-40 bg-black/60 hover:bg-black/90 w-10 flex items-center justify-center opacity-0 group-hover/cast:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500">No cast information available.</p>
                )}
              </div>
            )}

            {/* User Review Tab */}
            {activeTab === 'User Review' && (
              <div>
                {/* Review Form */}
                {user ? (
                  <form onSubmit={handleReviewSubmit} className="bg-gray-900/50 p-6 rounded-lg mb-8 border border-gray-800">
                    <h3 className="font-bold mb-4 text-lg">Write a Review</h3>
                    {reviewError && <p className="text-red-500 text-sm mb-3">{reviewError}</p>}
                    <div className="mb-5">
                      <label className="text-sm text-gray-400 mb-2 block">Your Rating</label>
                      <StarRating rating={rating} onChange={setRating} interactive={true} />
                    </div>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                      placeholder="What did you think about this movie?"
                      className="w-full bg-black border border-gray-700 rounded p-3 text-white placeholder-gray-500 outline-none focus:border-gray-500 transition-colors mb-4 resize-none h-24"
                    />
                    <button 
                      type="submit" 
                      disabled={submittingReview}
                      className="bg-[#E50914] text-white px-6 py-2 rounded font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {submittingReview ? 'Submitting...' : 'Post Review'}
                    </button>
                  </form>
                ) : (
                  <div className="bg-gray-900/50 p-6 rounded-lg mb-8 border border-gray-800 text-center">
                    <p className="text-gray-400 mb-4">You must be logged in to write a review.</p>
                    <button 
                      onClick={() => navigate('/signin')}
                      className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200 transition-colors"
                    >
                      Sign In
                    </button>
                  </div>
                )}

                {/* Review List */}
                <h3 className="font-bold text-xl mb-6">User Reviews ({reviews.length})</h3>
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-gray-500">No reviews yet. Be the first to share your thoughts!</p>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev._id} className="bg-[#1c1c1c] p-5 rounded-lg border border-gray-800">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold text-lg shadow-lg">
                            {rev.user?.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-200">{rev.user?.name || 'Anonymous'}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex gap-0.5">
                                {Array.from({ length: 5 }, (_, i) => i + 1).map(star => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= rev.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'fill-gray-700 text-gray-600'
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className="text-xs text-gray-500">{new Date(rev.createdAt).toLocaleDateString()} &middot; <span className="text-yellow-400 font-semibold">{rev.rating}/5</span></p>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                          {rev.comment}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            
            {/* Episodes Tab */}
            {activeTab === 'Episodes' && (
              <div className="text-gray-400 text-center py-10 border border-gray-800 rounded-lg bg-gray-900/20">
                <p>Episodes list not currently available.</p>
              </div>
            )}
          </div>

          {/* Trailer Section */}
          {movie.trailer_url && (
            <div className="mt-12 mb-8 border-t border-gray-800 pt-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Play className="w-5 h-5 text-[#E50914] fill-current" /> Official Trailer
              </h3>
              <div className="rounded-xl overflow-hidden border border-gray-800 shadow-2xl bg-black aspect-video relative">
                {movie.trailer_url.includes('youtube') || movie.trailer_url.includes('youtu.be') ? (
                  <iframe 
                    className="w-full h-full absolute top-0 left-0"
                    src={movie.trailer_url.includes('watch?v=') ? movie.trailer_url.replace('watch?v=', 'embed/').split('&')[0] : movie.trailer_url.replace('youtu.be/', 'youtube.com/embed/').split('?')[0]} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                ) : (
                  <VideoPlayer src={movie.trailer_url} title={movie.title} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (More Like This) */}
        <div className="lg:col-span-1">
          <h3 className="text-xl font-bold mb-6">More like this</h3>
          {relatedMovies.length === 0 ? (
            <p className="text-gray-500 text-sm">No related movies found.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {relatedMovies.map(rel => (
                <div 
                  key={rel.movie_id} 
                  onClick={() => navigate(`/movie/${rel.movie_id}`)}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[2/3] rounded-md overflow-hidden mb-2 relative">
                    <img 
                      src={rel.poster_url || `https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400&sig=${rel.movie_id}`} 
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-10 h-10 text-white fill-white" />
                    </div>
                  </div>
                  <h4 className="font-bold text-sm text-gray-300 line-clamp-1 group-hover:text-white transition-colors">{rel.title}</h4>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
