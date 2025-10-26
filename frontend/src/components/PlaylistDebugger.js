// Debug component to check playlist data
import React from 'react';

function PlaylistDebugger({ playlist }) {
  if (!playlist) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      backgroundColor: '#000',
      color: '#fff',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4>Debug Info:</h4>
      <p><strong>Playlist:</strong> {playlist.name}</p>
      <p><strong>Current Track:</strong> {playlist.songs[0]?.title}</p>
      <p><strong>URL:</strong> {playlist.songs[0]?.url}</p>
      <p><strong>YouTube ID:</strong> {playlist.songs[0]?.youtubeId}</p>
      <p><strong>Is YouTube:</strong> {playlist.songs[0]?.url?.includes('youtube.com') ? 'YES' : 'NO'}</p>
    </div>
  );
}

export default PlaylistDebugger;
