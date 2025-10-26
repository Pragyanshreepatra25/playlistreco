import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MusicPlayer from './MusicPlayer';
import PlaylistDebugger from './PlaylistDebugger';

function PlaylistDisplay({ emotion, languages }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [favorites, setFavorites] = useState([]);

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
    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emotion, languages]);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/user/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(response.data.map(p => p._id || p));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (playlistId, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      
      if (favorites.includes(playlistId)) {
        // Remove from favorites
        await axios.delete(`http://localhost:5000/api/user/favorites/${playlistId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(favorites.filter(id => id !== playlistId));
      } else {
        // Add to favorites
        await axios.post(`http://localhost:5000/api/user/favorites/${playlistId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites([...favorites, playlistId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorites');
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {playlists.map((playlist) => (
            <div 
              key={playlist._id} 
              className="card hover:shadow-xl transition-all duration-300 cursor-pointer group relative"
              onClick={() => setCurrentPlaylist(playlist)}
            >
              {/* Favorite Button */}
              <button
                onClick={(e) => toggleFavorite(playlist._id, e)}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-red-500 transition-all z-10"
              >
                <span className={`text-lg ${favorites.includes(playlist._id) ? '❤️' : '🤍'}`}>
                  {favorites.includes(playlist._id) ? '❤️' : '🤍'}
                </span>
              </button>

              {/* Playlist Header - Compact */}
              <div className="flex items-start gap-sm mb-sm">
                <div className={`w-10 h-10 bg-gradient-to-br ${getEmotionColor(playlist.emotion)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <span className="text-lg">{getEmotionEmoji(playlist.emotion)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-primary group-hover:text-indigo-600 transition-colors truncate">
                    {playlist.name}
                  </h3>
                  <div className="flex items-center gap-xs mt-xs">
                    <span className={`px-1.5 py-0.5 text-xs font-semibold text-white bg-gradient-to-r ${getEmotionColor(playlist.emotion)} rounded`}>
                      {playlist.emotion.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">• {playlist.language}</span>
                  </div>
                </div>
              </div>
              
              {/* Playlist Info - Compact */}
              <div className="mb-sm">
                <div className="flex items-center gap-xs text-xs text-secondary mb-xs">
                  <span>🎵</span>
                  <span>{playlist.songs.length} tracks</span>
                </div>
                
                {/* Sample Tracks - Only show first song */}
                {playlist.songs.length > 0 && (
                  <div className="text-xs text-gray-500 truncate">
                    {playlist.songs[0].title} - {playlist.songs[0].artist}
                  </div>
                )}
              </div>
              
              {/* Action Buttons - Compact */}
              <div className="space-y-xs">
                {/* Main Play Button - Always YouTube */}
                {playlist.songs.length > 0 && (playlist.songs[0].url?.includes('youtube.com') || playlist.songs[0].youtubeId) ? (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const firstSong = playlist.songs[0];
                      const youtubeUrl = firstSong.url || `https://www.youtube.com/watch?v=${firstSong.youtubeId}`;
                      window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
                    }}
                    className="btn btn-danger btn-sm btn-full"
                  >
                    <span>📺</span>
                    Play on YouTube
                  </button>
                ) : (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`🎵 "${playlist.name}"\n\nThis playlist doesn't have YouTube-enabled songs. Please check other playlists for YouTube integration.`);
                    }}
                    className="btn btn-secondary btn-sm btn-full"
                  >
                    <span>🎵</span>
                    Preview
                  </button>
                )}
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
