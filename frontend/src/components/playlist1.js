import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MusicPlayer from './MusicPlayer';
import PlaylistDebugger from './PlaylistDebugger';

function PlaylistDisplay({ emotion, languages }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPlaylist, setCurrentPlaylist] = useState(null);

  // Emotion mapping for better recommendations
  const emotionMappings = {
    'happy': ['happy', 'joyful', 'cheerful', 'excited'],
    'sad': ['sad', 'melancholy', 'emotional', 'calm'],
    'angry': ['angry', 'intense', 'energetic', 'aggressive'],
    'fearful': ['fearful', 'anxious', 'calm', 'peaceful'],
    'disgusted': ['disgusted', 'neutral', 'calm'],
    'surprised': ['surprised', 'excited', 'energetic', 'happy'],
    'neutral': ['neutral', 'calm', 'peaceful', 'relaxed']
  };

  useEffect(() => {
    if (emotion && languages.length > 0) {
      fetchPlaylists();
    }
  }, [emotion, languages]);

  const fetchPlaylists = async () => {
    setLoading(true);
    setError('');
    
    try {
      // First try to get exact emotion match
      let response = await axios.get('http://localhost:5000/api/playlists', {
        params: {
          emotion,
          languages: languages.join(',')
        }
      });

      // If no playlists found, try related emotions
      if (response.data.length === 0 && emotionMappings[emotion]) {
        const relatedEmotions = emotionMappings[emotion];
        for (const relatedEmotion of relatedEmotions) {
          if (relatedEmotion !== emotion) {
            response = await axios.get('http://localhost:5000/api/playlists', {
              params: {
                emotion: relatedEmotion,
                languages: languages.join(',')
              }
            });
            if (response.data.length > 0) break;
          }
        }
      }

      // If still no playlists, try without emotion filter
      if (response.data.length === 0) {
        response = await axios.get('http://localhost:5000/api/playlists', {
          params: {
            languages: languages.join(',')
          }
        });
      }

      setPlaylists(response.data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      setError('Failed to load playlists. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getEmotionEmoji = (emotion) => {
    const emojiMap = {
      'happy': '😊',
      'sad': '😢',
      'angry': '😠',
      'fearful': '😨',
      'disgusted': '🤢',
      'surprised': '😲',
      'neutral': '😐'
    };
    return emojiMap[emotion] || '🎵';
  };

  const getEmotionColor = (emotion) => {
    const colorMap = {
      'happy': 'from-green-400 to-green-600',
      'sad': 'from-gray-400 to-gray-600',
      'angry': 'from-red-400 to-red-600',
      'fearful': 'from-yellow-400 to-yellow-600',
      'disgusted': 'from-purple-400 to-purple-600',
      'surprised': 'from-orange-400 to-orange-600',
      'neutral': 'from-blue-400 to-blue-600'
    };
    return colorMap[emotion] || 'from-indigo-400 to-indigo-600';
  };

  const getEmotionBgColor = (emotion) => {
    const colorMap = {
      'happy': 'bg-green-50 border-green-200',
      'sad': 'bg-gray-50 border-gray-200',
      'angry': 'bg-red-50 border-red-200',
      'fearful': 'bg-yellow-50 border-yellow-200',
      'disgusted': 'bg-purple-50 border-purple-200',
      'surprised': 'bg-orange-50 border-orange-200',
      'neutral': 'bg-blue-50 border-blue-200'
    };
    return colorMap[emotion] || 'bg-indigo-50 border-indigo-200';
  };

  return (
    <div className="mt-xl">
      {/* Header */}
      <div className="text-center mb-xl">
        {emotion && (
          <div className="inline-flex items-center gap-md">
            <div className={`w-16 h-16 bg-gradient-to-br ${getEmotionColor(emotion)} rounded-2xl flex items-center justify-center`}>
              <span className="text-2xl">{getEmotionEmoji(emotion)}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary">
                Recommended Playlists
              </h2>
              <p className="text-lg text-secondary">
                Perfect for your {emotion.charAt(0).toUpperCase() + emotion.slice(1)} mood
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-xl">
          <div className="inline-flex flex-col items-center gap-md">
            <div className="spinner"></div>
            <p className="text-secondary font-medium">Finding perfect playlists for you...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-error text-center">
          <div className="flex items-center justify-center gap-sm">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
          <button 
            onClick={fetchPlaylists}
            className="btn btn-danger btn-sm mt-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && playlists.length === 0 && emotion && (
        <div className="card text-center py-xl">
          <div className="inline-flex flex-col items-center gap-md">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">🎵</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-sm">
                No playlists found
              </h3>
              <p className="text-gray-600 mb-md">
                No playlists found for {emotion} mood in {languages.join(', ')}
              </p>
              <p className="text-sm text-gray-500">
                Try scanning your face again or check back later for more playlists!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Playlist Grid */}
      {!loading && !error && playlists.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {playlists.map((playlist) => (
            <div 
              key={playlist._id} 
              className="card hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => setCurrentPlaylist(playlist)}
            >
              {/* Playlist Header */}
              <div className="flex items-center gap-md mb-md">
                <div className={`w-12 h-12 bg-gradient-to-br ${getEmotionColor(playlist.emotion)} rounded-xl flex items-center justify-center`}>
                  <span className="text-xl">{getEmotionEmoji(playlist.emotion)}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-primary group-hover:text-indigo-600 transition-colors">
                    {playlist.name}
                  </h3>
                  <div className="flex items-center gap-sm">
                    <span className={`px-2 py-1 text-xs font-semibold text-white bg-gradient-to-r ${getEmotionColor(playlist.emotion)} rounded-full`}>
                      {playlist.emotion.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Playlist Info */}
              <div className="space-y-sm mb-md">
                <div className="flex items-center gap-sm text-sm text-secondary">
                  <span>🌍</span>
                  <span><strong>Language:</strong> {playlist.language}</span>
                </div>
                <div className="flex items-center gap-sm text-sm text-secondary">
                  <span>🎵</span>
                  <span><strong>Songs:</strong> {playlist.songs.length} tracks</span>
                </div>
              </div>
              
              {/* Sample Tracks */}
              {playlist.songs.length > 0 && (
                <div className="mb-md">
                  <p className="text-sm font-medium text-gray-600 mb-sm">
                    Sample tracks:
                  </p>
                  <div className="space-y-xs">
                    {playlist.songs.slice(0, 3).map((song, index) => (
                      <div key={index} className="text-sm text-gray-600 flex items-center gap-sm">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span className="truncate">{song.title} - {song.artist}</span>
                      </div>
                    ))}
                    {playlist.songs.length > 3 && (
                      <div className="text-xs text-gray-500 italic">
                        ... and {playlist.songs.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="space-y-sm">
                {/* Main Play Button - Always YouTube */}
                {playlist.songs.length > 0 && (playlist.songs[0].url?.includes('youtube.com') || playlist.songs[0].youtubeId) ? (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const firstSong = playlist.songs[0];
                      const youtubeUrl = firstSong.url || `https://www.youtube.com/watch?v=${firstSong.youtubeId}`;
                      window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
                    }}
                    className="btn btn-danger btn-full"
                  >
                    <span>📺</span>
                    Play First Song on YouTube
                  </button>
                ) : (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`🎵 "${playlist.name}"\n\nThis playlist doesn't have YouTube-enabled songs. Please check other playlists for YouTube integration.`);
                    }}
                    className="btn btn-secondary btn-full"
                  >
                    <span>🎵</span>
                    Playlist Preview
                  </button>
                )}
                
                {/* Open Music Player */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentPlaylist(playlist);
                  }}
                  className="btn btn-primary btn-full btn-sm"
                >
                  <span>🎧</span>
                  Open Player
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Music Player Modal */}
      {currentPlaylist && (
        <MusicPlayer 
          playlist={currentPlaylist} 
          onClose={() => setCurrentPlaylist(null)} 
        />
      )}
      
      {/* Debug info */}
      {playlists.length > 0 && <PlaylistDebugger playlist={playlists[0]} />}
    </div>
  );
}

export default PlaylistDisplay;
