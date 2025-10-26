import React, { useState, useRef, useEffect } from 'react';

function MusicPlayer({ playlist, onClose }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef(null);

  const currentTrack = playlist?.songs[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      const handleEnded = () => {
        if (currentTrackIndex < playlist.songs.length - 1) {
          setCurrentTrackIndex(currentTrackIndex + 1);
        } else {
          setIsPlaying(false);
        }
      };
      
      const handleError = () => {
        setAudioError(true);
        setIsPlaying(false);
        console.warn('Audio source not available:', currentTrack?.url);
      };
      
      const handleLoadStart = () => {
        setAudioError(false);
      };

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
      audio.addEventListener('loadstart', handleLoadStart);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('loadstart', handleLoadStart);
      };
    }
  }, [currentTrackIndex, playlist, currentTrack]);

  const togglePlayPause = () => {
    console.log('Current track:', currentTrack);
    console.log('URL:', currentTrack?.url);
    console.log('YouTube ID:', currentTrack?.youtubeId);
    
    // Check if this is a YouTube URL
    if (currentTrack?.url?.includes('youtube.com') || currentTrack?.youtubeId) {
      const youtubeUrl = currentTrack.url || `https://www.youtube.com/watch?v=${currentTrack.youtubeId}`;
      console.log('Opening YouTube URL:', youtubeUrl);
      const shouldOpen = window.confirm(
        `🎵 Play "${currentTrack.title}" by ${currentTrack.artist}?\n\n` +
        `This will open YouTube in a new tab.\n\n` +
        `Click OK to open YouTube, or Cancel to stay here.`
      );
      
      if (shouldOpen) {
        window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
      }
      return;
    }
    
    // Check if this is a demo URL
    if (currentTrack?.url?.includes('example.com')) {
      alert('🎵 Demo Mode: This is a placeholder URL. To enable actual music playback, replace the URLs in the backend with real music file URLs.\n\nFor now, you can see the playlist structure and UI functionality!');
      return;
    }
    
    if (audioError) {
      alert('Audio source not available. Please check the audio URL.');
      return;
    }
    
    if (!audioRef.current) {
      alert('Audio player not ready. Please try again.');
      return;
    }
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error('Playback failed:', error);
        setAudioError(true);
        setIsPlaying(false);
        alert('Unable to play audio. Please check the audio source.');
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
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

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!playlist) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '20px',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
      zIndex: 1000
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ marginRight: '20px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#34495e',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                🎵
              </div>
            </div>
            
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>
                {currentTrack?.title || 'No track selected'}
              </h4>
              <p style={{ margin: 0, color: '#bdc3c7', fontSize: '14px' }}>
                {currentTrack?.artist || ''} • {playlist.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#bdc3c7',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '5px'
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
          <button
            onClick={prevTrack}
            disabled={currentTrackIndex === 0}
            style={{
              background: 'none',
              border: 'none',
              color: currentTrackIndex === 0 ? '#7f8c8d' : 'white',
              fontSize: '20px',
              cursor: currentTrackIndex === 0 ? 'not-allowed' : 'pointer',
              margin: '0 10px'
            }}
          >
            ⏮
          </button>

          <button
            onClick={togglePlayPause}
            style={{
              background: (audioError || currentTrack?.url?.includes('example.com')) ? '#f39c12' : 
                         (currentTrack?.url?.includes('youtube.com') || currentTrack?.youtubeId) ? '#ff0000' : '#3498db',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              margin: '0 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: audioError ? 0.7 : 1
            }}
            title={
              currentTrack?.url?.includes('youtube.com') || currentTrack?.youtubeId
                ? 'Play on YouTube' 
                : currentTrack?.url?.includes('example.com') 
                  ? 'Demo Mode - Click to see info' 
                  : audioError 
                    ? 'Audio source not available' 
                    : (isPlaying ? 'Pause' : 'Play')
            }
          >
            {(currentTrack?.url?.includes('youtube.com') || currentTrack?.youtubeId) ? '📺' : 
             currentTrack?.url?.includes('example.com') ? '🎵' : 
             (audioError ? '⚠️' : (isPlaying ? '⏸' : '▶'))}
          </button>

          <button
            onClick={nextTrack}
            disabled={currentTrackIndex === playlist.songs.length - 1}
            style={{
              background: 'none',
              border: 'none',
              color: currentTrackIndex === playlist.songs.length - 1 ? '#7f8c8d' : 'white',
              fontSize: '20px',
              cursor: currentTrackIndex === playlist.songs.length - 1 ? 'not-allowed' : 'pointer',
              margin: '0 10px'
            }}
          >
            ⏭
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '12px', marginRight: '10px', minWidth: '40px' }}>
            {formatTime(currentTime)}
          </span>
          
          <input
            type="range"
            min="0"
            max="100"
            value={duration ? (currentTime / duration) * 100 : 0}
            onChange={handleSeek}
            style={{
              flex: 1,
              height: '6px',
              background: '#34495e',
              outline: 'none',
              borderRadius: '3px',
              margin: '0 10px'
            }}
          />
          
          <span style={{ fontSize: '12px', marginLeft: '10px', minWidth: '40px' }}>
            {formatTime(duration)}
          </span>
        </div>

        <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px', color: '#bdc3c7' }}>
          Track {currentTrackIndex + 1} of {playlist.songs.length}
        </div>
        
        {(audioError || currentTrack?.url?.includes('example.com') || currentTrack?.url?.includes('youtube.com') || currentTrack?.youtubeId) && (
          <div style={{ 
            textAlign: 'center', 
            marginTop: '10px', 
            padding: '10px',
            backgroundColor: currentTrack?.url?.includes('youtube.com') || currentTrack?.youtubeId ? '#ff0000' :
                           currentTrack?.url?.includes('example.com') ? '#f39c12' : '#e74c3c',
            borderRadius: '4px',
            fontSize: '12px',
            color: 'white'
          }}>
            {currentTrack?.url?.includes('youtube.com') || currentTrack?.youtubeId
              ? '📺 YouTube Integration: Click play button to open song on YouTube'
              : currentTrack?.url?.includes('example.com') 
                ? '🎵 Demo Mode: Click play button to see instructions for enabling real music playback'
                : '⚠️ Audio Error: Unable to load audio source'
            }
          </div>
        )}
      </div>

      {currentTrack && currentTrack.url && !currentTrack.url.includes('example.com') && !currentTrack.url.includes('youtube.com') && !currentTrack.youtubeId && (
        <audio
          ref={audioRef}
          src={currentTrack.url}
          preload="metadata"
        />
      )}
      
      {/* Demo mode and YouTube mode - no actual audio element */}
      {currentTrack && currentTrack.url && (currentTrack.url.includes('example.com') || currentTrack.url.includes('youtube.com') || currentTrack.youtubeId) && (
        <div style={{ display: 'none' }}>
          {/* This prevents the audio error by not creating the audio element for demo/YouTube URLs */}
        </div>
      )}
    </div>
  );
}

export default MusicPlayer;
