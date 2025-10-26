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
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      setSelectedLanguages(userData.languages || ['English']);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(false);
    navigate('/login');
  };

  const handleLanguageChange = (languages) => {
    setSelectedLanguages(languages);
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
