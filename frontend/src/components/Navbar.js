import React, { useState } from 'react';

function Navbar({ user, onLogout, onLanguageChange, selectedLanguages }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
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

  const getLanguageFlag = (lang) => {
    const flags = {
      'Odia': '🇮🇳',
      'Hindi': '🇮🇳', 
      'English': '🇺🇸'
    };
    return flags[lang] || '🌍';
  };

  return (
    <nav className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-xl">
      <div className="container mx-auto px-lg py-md">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-lg">
            {/* Logo */}
            <div className="flex items-center gap-sm">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-sm">🎵</span>
              </div>
              <span className="text-xl font-bold">MusicReco</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-md">
              <button className="btn btn-secondary btn-sm">
                <span>🏠</span>
                Home
              </button>
              
              <button className="btn btn-secondary btn-sm">
                <span>🔍</span>
                Search
              </button>
              
              <button className="btn btn-secondary btn-sm">
                <span>❤️</span>
                Favorites
              </button>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 max-w-md mx-lg hidden md:block">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search playlists, songs..." 
                className="form-input bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/20"
                style={{ paddingRight: '2.5rem' }}
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white">
                🔍
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-md">
            {/* Language Selector */}
            <div className="hidden lg:flex items-center gap-sm">
              <span className="text-sm text-white/80">Languages:</span>
              <div className="flex gap-xs">
                {languages.map(lang => (
                  <label key={lang} className="flex items-center gap-xs cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={selectedLanguages.includes(lang)}
                      onChange={() => toggleLanguage(lang)}
                      className="w-3 h-3 rounded border-white/30 bg-white/10 text-primary focus:ring-primary"
                    />
                    <span className="flex items-center gap-xs">
                      <span>{getLanguageFlag(lang)}</span>
                      <span>{lang}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Mobile Search Toggle */}
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden btn btn-secondary btn-sm"
            >
              🔍
            </button>

            {/* Profile Section */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-sm p-xs rounded-lg hover:bg-white/10 transition-colors"
              >
                <img
                  src={user?.profilePic || 'https://via.placeholder.com/40'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-white/20"
                />
                <span className="hidden sm:block text-sm font-medium">
                  {user?.name?.split(' ')[0]}
                </span>
                <span className="text-xs">▼</span>
              </button>
              
              {showProfile && (
                <div className="absolute right-0 top-full mt-sm bg-white text-gray-800 rounded-xl shadow-xl border border-gray-200 min-w-64 z-50">
                  <div className="p-md border-b border-gray-200">
                    <div className="flex items-center gap-sm">
                      <img
                        src={user?.profilePic || 'https://via.placeholder.com/40'}
                        alt="Profile"
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-semibold">{user?.name}</p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-sm">
                    <button className="btn btn-secondary btn-sm btn-full mb-sm">
                      <span>⚙️</span>
                      Edit Profile
                    </button>
                    
                    {/* Mobile Language Selector */}
                    <div className="lg:hidden mb-sm">
                      <p className="text-xs font-semibold text-gray-600 mb-xs">Languages:</p>
                      <div className="space-y-xs">
                        {languages.map(lang => (
                          <label key={lang} className="flex items-center gap-xs text-sm">
                            <input
                              type="checkbox"
                              checked={selectedLanguages.includes(lang)}
                              onChange={() => toggleLanguage(lang)}
                              className="w-3 h-3 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="flex items-center gap-xs">
                              <span>{getLanguageFlag(lang)}</span>
                              <span>{lang}</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <button 
                      onClick={onLogout}
                      className="btn btn-danger btn-sm btn-full"
                    >
                      <span>🚪</span>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        {showSearch && (
          <div className="md:hidden mt-md">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search playlists, songs..." 
                className="form-input bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/20"
                style={{ paddingRight: '2.5rem' }}
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white">
                🔍
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
