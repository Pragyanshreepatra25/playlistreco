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
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onLanguageChange={handleLanguageChange}
        selectedLanguages={selectedLanguages}
      />
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '30px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h2 style={{ 
            marginBottom: '20px', 
            color: '#333',
            fontSize: '28px',
            textAlign: 'center'
          }}>
            Welcome, {user?.name}! 🎵
          </h2>
          
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: '#e3f2fd',
            borderRadius: '8px',
            border: '1px solid #bbdefb'
          }}>
            <h3 style={{ color: '#1976d2', marginBottom: '10px' }}>
              🎭 Scan Your Face Expression
            </h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Let our AI detect your current mood and recommend the perfect playlists for you!
            </p>
            
            <WebcamExpression onEmotionDetected={setDetectedEmotion} />
            
            {detectedEmotion && (
              <div style={{ 
                marginTop: '20px', 
                padding: '15px',
                backgroundColor: '#d4edda',
                borderRadius: '8px',
                border: '1px solid #c3e6cb'
              }}>
                <p style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold',
                  color: '#155724',
                  margin: 0
                }}>
                  🎯 Detected Emotion: {detectedEmotion.charAt(0).toUpperCase() + detectedEmotion.slice(1)}
                </p>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <button 
              onClick={seedSamplePlaylists}
              disabled={isSeeding}
              style={{
                padding: '12px 24px',
                backgroundColor: isSeeding ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: isSeeding ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              {isSeeding ? '⏳ Loading Sample Playlists...' : '🎵 Load Sample Playlists'}
            </button>
            <p style={{ 
              fontSize: '14px', 
              color: '#666', 
              marginTop: '10px',
              fontStyle: 'italic'
            }}>
              Click this button to load sample playlists for testing the emotion-based recommendations
            </p>
            <div style={{
              marginTop: '15px',
              padding: '10px',
              backgroundColor: '#d1ecf1',
              border: '1px solid #bee5eb',
              borderRadius: '6px',
              fontSize: '13px',
              color: '#0c5460'
            }}>
              <strong>🎵 Music Integration:</strong> Sample playlists now include YouTube links! 
              Click the red "📺 Play on YouTube" buttons to listen to actual songs. 
              You can also use the music player to browse through playlists.
            </div>
          </div>
        </div>

        <PlaylistDisplay 
          emotion={detectedEmotion} 
          languages={selectedLanguages}
        />
      </div>
    </div>
  );
}

export default Home;
