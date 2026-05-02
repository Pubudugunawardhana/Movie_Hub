import React from 'react';

const VideoPlayer = ({ src, title }) => {
  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-black shadow-2xl">
      <video
        className="w-full aspect-video"
        controls
        controlsList="nodownload nofullscreen"
        onContextMenu={(e) => e.preventDefault()}
        disablePictureInPicture
        poster={`https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=1280`}
      >
        {src ? (
          <source src={src} type="video/mp4" />
        ) : (
          <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        )}
        Your browser does not support the video tag.
      </video>
      <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
        🔒 Streaming Only — Downloads Disabled
      </div>
    </div>
  );
};

export default VideoPlayer;
