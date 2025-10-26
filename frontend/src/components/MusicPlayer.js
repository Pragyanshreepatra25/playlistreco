import React, { useState } from 'react';

function MusicPlayer({ playlist, onClose }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentTrack = playlist?.songs[currentTrackIndex];

  const playCurrentTrack = () => {
    if (!currentTrack) return;
    
    // Check if this is a YouTube URL
    if (currentTrack?.url?.includes('youtube.com') || currentTrack?.youtubeId) {
      const youtubeUrl = currentTrack.url || `https://www.youtube.com/watch?v=${currentTrack.youtubeId}`;
      window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // For non-YouTube URLs, show a message
    alert(`🎵 "${currentTrack.title}" by ${currentTrack.artist}\n\nThis song is not available on YouTube. Please check the playlist for YouTube-enabled songs.`);
  };

  const nextTrack = () => {
    if (currentTrackIndex < playlist.songs.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  };

  const prevTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };

  if (!playlist) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-2xl z-50 border-t border-slate-700">
      <div className="container mx-auto px-lg py-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-md">
          <div className="flex items-center gap-md flex-1">
            {/* Album Art */}
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🎵</span>
            </div>
            
            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-semibold text-white truncate">
                {currentTrack?.title || 'No track selected'}
              </h4>
              <p className="text-sm text-gray-300 truncate">
                {currentTrack?.artist || ''} • {playlist.name}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="text-lg">✕</span>
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-lg mb-md">
          {/* Previous Track */}
          <button
            onClick={prevTrack}
            disabled={currentTrackIndex === 0}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-xl">⏮</span>
          </button>

          {/* Play Button - Always YouTube */}
          <button
            onClick={playCurrentTrack}
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all bg-red-500 hover:bg-red-600"
            title="Play on YouTube"
          >
            📺
          </button>

          {/* Next Track */}
          <button
            onClick={nextTrack}
            disabled={currentTrackIndex === playlist.songs.length - 1}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-xl">⏭</span>
          </button>
        </div>

        {/* Track Counter */}
        <div className="text-center text-xs text-gray-400 mb-sm">
          Track {currentTrackIndex + 1} of {playlist.songs.length}
        </div>
        
        {/* YouTube Integration Message */}
        <div className="text-center">
          <div className="bg-red-500/20 text-red-200 rounded-lg p-sm text-xs">
            📺 All songs play through YouTube - Click the play button to open in a new tab
          </div>
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
