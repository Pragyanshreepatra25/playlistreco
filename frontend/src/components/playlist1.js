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
      'happy': '#28a745',
      'sad': '#6c757d',
      'angry': '#dc3545',
      'fearful': '#ffc107',
      'disgusted': '#6f42c1',
      'surprised': '#fd7e14',
      'neutral': '#17a2b8'
    };
    return colorMap[emotion] || '#007bff';
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '24px',
          color: '#333'
        }}>
          {emotion && (
            <>
              {getEmotionEmoji(emotion)} Recommended Playlists for {emotion.charAt(0).toUpperCase() + emotion.slice(1)} Mood
            </>
          )}
        </h3>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '10px', color: '#666' }}>Finding perfect playlists for you...</p>
        </div>
      )}

      {error && (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '8px',
          margin: '20px 0'
        }}>
          <p>{error}</p>
          <button 
            onClick={fetchPlaylists}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && playlists.length === 0 && emotion && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <p style={{ fontSize: '18px', color: '#6c757d', marginBottom: '10px' }}>
            No playlists found for {emotion} mood in {languages.join(', ')}
          </p>
          <p style={{ color: '#6c757d' }}>
            Try scanning your face again or check back later for more playlists!
          </p>
        </div>
      )}

      {!loading && !error && playlists.length > 0 && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px',
          padding: '20px 0'
        }}>
          {playlists.map((playlist) => (
            <div key={playlist._id} style={{ 
              border: '2px solid #e9ecef',
              padding: '20px', 
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ fontSize: '24px', marginRight: '10px' }}>
                  {getEmotionEmoji(playlist.emotion)}
                </span>
                <h4 style={{ 
                  margin: 0, 
                  fontSize: '18px',
                  color: '#333'
                }}>
                  {playlist.name}
                </h4>
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <span style={{ 
                  backgroundColor: getEmotionColor(playlist.emotion),
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {playlist.emotion.toUpperCase()}
                </span>
              </div>
              
              <p style={{ margin: '8px 0', color: '#666' }}>
                <strong>Language:</strong> {playlist.language}
              </p>
              <p style={{ margin: '8px 0', color: '#666' }}>
                <strong>Songs:</strong> {playlist.songs.length} tracks
              </p>
              
              {playlist.songs.length > 0 && (
                <div style={{ marginTop: '15px' }}>
                  <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
                    Sample tracks:
                  </p>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {playlist.songs.slice(0, 3).map((song, index) => (
                      <div key={index} style={{ marginBottom: '4px' }}>
                        • {song.title} - {song.artist}
                      </div>
                    ))}
                    {playlist.songs.length > 3 && (
                      <div style={{ color: '#999' }}>
                        ... and {playlist.songs.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <button 
                onClick={() => setCurrentPlaylist(playlist)}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginTop: '15px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#0056b3';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#007bff';
                }}
              >
                🎵 Play Playlist
              </button>
              
              {/* Quick YouTube access for first song */}
              {playlist.songs.length > 0 && (playlist.songs[0].url?.includes('youtube.com') || playlist.songs[0].youtubeId) && (
                <button 
                  onClick={() => {
                    const firstSong = playlist.songs[0];
                    const youtubeUrl = firstSong.url || `https://www.youtube.com/watch?v=${firstSong.youtubeId}`;
                    window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#ff0000',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginTop: '8px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#cc0000';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#ff0000';
                  }}
                >
                  📺 Play First Song on YouTube
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

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
