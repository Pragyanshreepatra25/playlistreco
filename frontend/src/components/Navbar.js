import React, { useState } from 'react';

function Navbar({ user, onLogout, onLanguageChange, selectedLanguages }) {
  const [showProfile, setShowProfile] = useState(false);
  const languages = ['Odia', 'Hindi', 'English'];

  const toggleLanguage = (lang) => {
    let newLanguages;
    if (selectedLanguages.includes(lang)) {
      newLanguages = selectedLanguages.filter(l => l !== lang);
    } else {
      newLanguages = [...selectedLanguages, lang];
    }
    onLanguageChange(newLanguages);
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '15px 20px', 
      backgroundColor: '#2c3e50',
      color: 'white'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button style={navButtonStyle}>Home</button>
        <input 
          type="text" 
          placeholder="Search..." 
          style={{ padding: '8px', borderRadius: '4px', border: 'none' }}
        />
        <button style={navButtonStyle}>Fav Playlist</button>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span>Languages:</span>
          {languages.map(lang => (
            <label key={lang} style={{ marginLeft: '5px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={selectedLanguages.includes(lang)}
                onChange={() => toggleLanguage(lang)}
                style={{ marginRight: '3px' }}
              />
              {lang}
            </label>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', position: 'relative' }}>
        <img
          src={user?.profilePic || 'https://via.placeholder.com/40'}
          alt="Profile"
          style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            cursor: 'pointer',
            border: '2px solid white'
          }}
          onClick={() => setShowProfile(!showProfile)}
        />
        
        {showProfile && (
          <div style={{
            position: 'absolute',
            top: '50px',
            right: '0',
            backgroundColor: 'white',
            color: 'black',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            minWidth: '200px',
            zIndex: 1000
          }}>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <button style={{ ...navButtonStyle, backgroundColor: '#3498db', width: '100%', marginTop: '10px' }}>
              Edit Profile
            </button>
          </div>
        )}
        
        <button onClick={onLogout} style={{ ...navButtonStyle, backgroundColor: '#e74c3c' }}>
          Logout
        </button>
      </div>
    </div>
  );
}

const navButtonStyle = {
  padding: '8px 15px',
  backgroundColor: '#34495e',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default Navbar;
