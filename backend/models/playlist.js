const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  songs: [{ 
    title: String,
    artist: String,
    url: String,
    youtubeId: String
  }],
  language: { type: String, required: true }, // Odia, Hindi, English
  emotion: { type: String, required: true }, // happy, sad, angry, neutral, etc.
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Playlist', playlistSchema);
