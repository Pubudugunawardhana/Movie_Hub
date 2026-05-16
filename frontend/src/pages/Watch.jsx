import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import VideoPlayer from '../components/VideoPlayer';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, Lock } from 'lucide-react';

const Watch = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    // For testing: allow everyone to watch trailers
    // if (!user) { navigate('/signin'); return; }
    // if (!user.subscribed) { navigate('/subscription'); return; }
    const fetch = async () => {
      const res = await axios.get(`http://localhost:5000/api/movies/${id}`);
      setMovie(res.data);
    };
    fetch();
  }, [id, user]);

  if (!movie) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-20 px-6 md:px-12 bg-dark">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back
      </button>
      <h1 className="text-2xl md:text-4xl font-bold mb-6">{movie.title}</h1>
      <div className="rounded-xl overflow-hidden border border-gray-800 shadow-2xl bg-black aspect-video relative">
        {movie.trailer_url && (movie.trailer_url.includes('youtube') || movie.trailer_url.includes('youtu.be')) ? (
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
      <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
        <Lock className="w-3.5 h-3.5" />
        This content is protected. Downloading is strictly prohibited.
      </div>
    </div>
  );
};

export default Watch;
