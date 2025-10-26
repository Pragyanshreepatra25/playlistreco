import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';                     
import WebcamExpression from './webcamExpression'; 
import PlaylistDisplay from './playlist1';   

function Home({ setAuth }) {
  const [user, setUser] = useState(null);
  const [selectedLanguages, setSelectedLanguages] = useState(['English']);
  const [detectedEmotion, setDetectedEmotion] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoritesList, setFavoritesList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      setSelectedLanguages(userData.languages || ['English']);
    }
  }, []);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/user/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavoritesList(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  useEffect(() => {
    if (showFavorites) {
      fetchFavorites();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFavorites]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(false);
    navigate('/login');
  };

  const handleLanguageChange = (languages) => {
    setSelectedLanguages(languages);
  };

  const handleShowFavorites = () => {
    setShowFavorites(true);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const seedSamplePlaylists = async () => {
    setIsSeeding(true);
    try {
      const response = await axios.post('http://localhost:5000/api/playlists/seed');
      alert(response.data.message);
    } catch (error) {
      console.error('Error seeding playlists:', error);
      alert('Error seeding playlists. Please try again.');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onLanguageChange={handleLanguageChange}
        selectedLanguages={selectedLanguages}
        onShowFavorites={handleShowFavorites}
      />
      
      <div className="container mx-auto px-lg py-xl">
        {/* Welcome Section */}
        <div className="card mb-xl">
          <div className="card-header">
            <h1 className="card-title">
              Welcome back, {user?.name}! 🎵
            </h1>
            <p className="card-subtitle">
              Let AI discover the perfect music for your mood
            </p>
          </div>
          
          {/* Emotion Detection Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-lg mb-lg border border-blue-200">
            <div className="text-center mb-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-md">
                <span className="text-2xl">🎭</span>
              </div>
              <h3 className="text-xl font-semibold text-blue-800 mb-sm">
                AI Emotion Detection
              </h3>
              <p className="text-blue-600 max-w-2xl mx-auto">
                Look at your camera and let our advanced AI analyze your facial expressions to recommend the perfect playlists for your current mood!
              </p>
            </div>
            
            <WebcamExpression onEmotionDetected={setDetectedEmotion} />
            
            {detectedEmotion && (
              <div className="mt-lg p-md bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-center gap-sm">
                  <span className="text-2xl">🎯</span>
                  <p className="text-lg font-semibold text-green-800">
                    Detected Emotion: {detectedEmotion.charAt(0).toUpperCase() + detectedEmotion.slice(1)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sample Data Section */}
          <div className="text-center">
            <div className="mb-lg">
              <button 
                onClick={seedSamplePlaylists}
                disabled={isSeeding}
                className="btn btn-success btn-lg"
              >
                {isSeeding ? (
                  <>
                    <div className="spinner"></div>
                    Loading Sample Playlists...
                  </>
                ) : (
                  <>
                    <span>🎵</span>
                    Load Sample Playlists
                  </>
                )}
              </button>
            </div>
            
            <p className="text-sm text-muted mb-md italic">
              Click this button to load sample playlists for testing the emotion-based recommendations
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-md">
              <div className="flex items-start gap-sm">
                <span className="text-blue-600 text-lg">ℹ️</span>
                <div className="text-left">
                  <p className="font-semibold text-blue-800 mb-xs">Music Integration Features:</p>
                  <ul className="text-sm text-blue-700 space-y-xs">
                    <li>• Sample playlists include YouTube links for instant playback</li>
                    <li>• Click the red "📺 Play on YouTube" buttons to listen to actual songs</li>
                    <li>• Use the music player to browse through playlists seamlessly</li>
                    <li>• Multi-language support for diverse music experiences</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Favorites Section */}
        <div className="card mb-xl">
          <div className="flex items-center justify-between mb-lg">
            <div>
              <h2 className="card-title">
                ❤️ My Favorites
              </h2>
              <p className="card-subtitle">
                Your saved playlists
              </p>
            </div>
            <button 
              onClick={() => setShowFavorites(!showFavorites)}
              className="btn btn-primary btn-sm"
            >
              {showFavorites ? 'Hide' : 'Show'} Favorites
            </button>
          </div>

          {showFavorites && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
              {favoritesList.length === 0 ? (
                <div className="col-span-full text-center py-lg">
                  <div className="inline-flex flex-col items-center gap-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🤍</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-xs">
                        No favorites yet
                      </h3>
                      <p className="text-sm text-gray-500">
                        Add playlists to your favorites to see them here
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                favoritesList.map((playlist) => (
                  <div 
                    key={playlist._id} 
                    className="card hover:shadow-xl transition-all duration-300 cursor-pointer group relative"
                  >
                    {/* Remove Favorite Button */}
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          const token = localStorage.getItem('token');
                          await axios.delete(`http://localhost:5000/api/user/favorites/${playlist._id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                          });
                          setFavoritesList(favoritesList.filter(p => p._id !== playlist._id));
                        } catch (error) {
                          console.error('Error removing favorite:', error);
                        }
                      }}
                      className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-gray-500 transition-all z-10"
                    >
                      <span className="text-lg">❌</span>
                    </button>

                    <div className="flex items-start gap-sm mb-sm">
                      <div className={`w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <span className="text-lg">❤️</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-primary group-hover:text-indigo-600 transition-colors truncate">
                          {playlist.name}
                        </h3>
                        <div className="flex items-center gap-xs mt-xs">
                          <span className="text-xs text-gray-500">{playlist.language}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-sm">
                      <div className="flex items-center gap-xs text-xs text-secondary mb-xs">
                        <span>🎵</span>
                        <span>{playlist.songs?.length || 0} tracks</span>
                      </div>
                      
                      {playlist.songs && playlist.songs.length > 0 && (
                        <div className="text-xs text-gray-500 truncate">
                          {playlist.songs[0].title} - {playlist.songs[0].artist}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-xs">
                      {playlist.songs && playlist.songs.length > 0 && (playlist.songs[0].url?.includes('youtube.com') || playlist.songs[0].youtubeId) ? (
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
                            alert(`🎵 "${playlist.name}"\n\nThis playlist doesn't have YouTube-enabled songs.`);
                          }}
                          className="btn btn-secondary btn-sm btn-full"
                        >
                          <span>🎵</span>
                          Preview
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Playlist Display */}
        <PlaylistDisplay 
          emotion={detectedEmotion} 
          languages={selectedLanguages}
        />
      </div>
    </div>
  );
}

export default Home;
