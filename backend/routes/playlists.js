const express = require('express');
const router = express.Router();
const Playlist = require('../models/playlist');

// Get playlists by emotion and languages
router.get('/', async (req, res) => {
  try {
    const { emotion, languages } = req.query;
    
    let query = {};
    if (emotion) query.emotion = emotion;
    if (languages) {
      const langArray = languages.split(',');
      query.language = { $in: langArray };
    }
    
    const playlists = await Playlist.find(query);
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create playlist (for testing)
router.post('/', async (req, res) => {
  try {
    const playlist = new Playlist(req.body);
    await playlist.save();
    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Seed sample playlists
router.post('/seed', async (req, res) => {
  try {
    // Clear existing playlists
    await Playlist.deleteMany({});
    
    const samplePlaylists = [
      // Happy Playlists
      {
        name: "Happy Vibes - English",
        language: "English",
        emotion: "happy",
        songs: [
          { title: "Happy", artist: "Pharrell Williams", url: "https://www.youtube.com/watch?v=y6Sxv-sUYtM", youtubeId: "y6Sxv-sUYtM" },
          { title: "Good Vibrations", artist: "The Beach Boys", url: "https://www.youtube.com/watch?v=Eab_beh07HU", youtubeId: "Eab_beh07HU" },
          { title: "Walking on Sunshine", artist: "Katrina and the Waves", url: "https://www.youtube.com/watch?v=iPUmE-tne5U", youtubeId: "iPUmE-tne5U" },
          { title: "Don't Stop Me Now", artist: "Queen", url: "https://www.youtube.com/watch?v=HgzGwKwLmgM", youtubeId: "HgzGwKwLmgM" },
          { title: "I Gotta Feeling", artist: "Black Eyed Peas", url: "https://www.youtube.com/watch?v=uSD4vsh1zDA", youtubeId: "uSD4vsh1zDA" }
        ]
      },
      {
        name: "खुशी के गाने - Hindi",
        language: "Hindi",
        emotion: "happy",
        songs: [
          { title: "Bole Chudiyan", artist: "Jatin-Lalit", url: "https://www.youtube.com/watch?v=YQHsXMglC9A", youtubeId: "YQHsXMglC9A" },
          { title: "Mere Sapno Ki Rani", artist: "Kishore Kumar", url: "https://www.youtube.com/watch?v=HhHvQjJhQjQ", youtubeId: "HhHvQjJhQjQ" },
          { title: "Chaiyya Chaiyya", artist: "A.R. Rahman", url: "https://www.youtube.com/watch?v=HhHvQjJhQjQ", youtubeId: "HhHvQjJhQjQ" },
          { title: "Dil Chahta Hai", artist: "Shankar-Ehsaan-Loy", url: "https://www.youtube.com/watch?v=HhHvQjJhQjQ", youtubeId: "HhHvQjJhQjQ" },
          { title: "Tum Hi Ho", artist: "Arijit Singh", url: "https://www.youtube.com/watch?v=HhHvQjJhQjQ", youtubeId: "HhHvQjJhQjQ" }
        ]
      },
      {
        name: "ଖୁସିର ଗୀତ - Odia",
        language: "Odia",
        emotion: "happy",
        songs: [
          { title: "Rangabati", artist: "Jitendra Haripal", url: "https://www.youtube.com/watch?v=9wXLruT4g0M", youtubeId: "9wXLruT4g0M" },
          { title: "Mu Eka Tu Eka", artist: "Pranab Patnaik", url: "https://www.youtube.com/watch?v=0xXLruT4g0M", youtubeId: "0xXLruT4g0M" },
          { title: "Ae Mana Ae Mana", artist: "Akshaya Mohanty", url: "https://www.youtube.com/watch?v=1yXLruT4g0M", youtubeId: "1yXLruT4g0M" },
          { title: "Mu Tote Bhalapae", artist: "Pranab Patnaik", url: "https://www.youtube.com/watch?v=2zXLruT4g0M", youtubeId: "2zXLruT4g0M" },
          { title: "Jhia Jhia Jhia", artist: "Pranab Patnaik", url: "https://www.youtube.com/watch?v=3aXLruT4g0M", youtubeId: "3aXLruT4g0M" }
        ]
      },
      
      // Sad Playlists
      {
        name: "Melancholy Moments - English",
        language: "English",
        emotion: "sad",
        songs: [
          { title: "Someone Like You", artist: "Adele", url: "https://www.youtube.com/watch?v=hLQl3WQQoQ0", youtubeId: "hLQl3WQQoQ0" },
          { title: "Hurt", artist: "Johnny Cash", url: "https://www.youtube.com/watch?v=8AHCfZTRGiI", youtubeId: "8AHCfZTRGiI" },
          { title: "Mad World", artist: "Gary Jules", url: "https://www.youtube.com/watch?v=4N3N1MlvVc4", youtubeId: "4N3N1MlvVc4" },
          { title: "The Sound of Silence", artist: "Simon & Garfunkel", url: "https://www.youtube.com/watch?v=4zLfCn1Ve4U", youtubeId: "4zLfCn1Ve4U" },
          { title: "Everybody Hurts", artist: "R.E.M.", url: "https://www.youtube.com/watch?v=5rOiW_xY-kc", youtubeId: "5rOiW_xY-kc" }
        ]
      },
      {
        name: "दुःख के गाने - Hindi",
        language: "Hindi",
        emotion: "sad",
        songs: [
          { title: "Tum Hi Aana", artist: "Jubin Nautiyal", url: "https://www.youtube.com/watch?v=7wtfhZwyrcc", youtubeId: "7wtfhZwyrcc" },
          { title: "Channa Mereya", artist: "Arijit Singh", url: "https://www.youtube.com/watch?v=0P0j7Kj7Kj7", youtubeId: "0P0j7Kj7Kj7" },
          { title: "Tere Bina", artist: "A.R. Rahman", url: "https://www.youtube.com/watch?v=8Kj7Kj7Kj7", youtubeId: "8Kj7Kj7Kj7" },
          { title: "Kabira", artist: "Arijit Singh", url: "https://www.youtube.com/watch?v=9Kj7Kj7Kj7", youtubeId: "9Kj7Kj7Kj7" },
          { title: "Ae Dil Hai Mushkil", artist: "Arijit Singh", url: "https://www.youtube.com/watch?v=1Kj7Kj7Kj7", youtubeId: "1Kj7Kj7Kj7" }
        ]
      },
      
      // Angry Playlists
      {
        name: "Rage & Energy - English",
        language: "English",
        emotion: "angry",
        songs: [
          { title: "Break Stuff", artist: "Limp Bizkit", url: "https://www.youtube.com/watch?v=4bXLruT4g0M", youtubeId: "4bXLruT4g0M" },
          { title: "Killing in the Name", artist: "Rage Against the Machine", url: "https://www.youtube.com/watch?v=5cXLruT4g0M", youtubeId: "5cXLruT4g0M" },
          { title: "Bodies", artist: "Drowning Pool", url: "https://www.youtube.com/watch?v=6dXLruT4g0M", youtubeId: "6dXLruT4g0M" },
          { title: "Down with the Sickness", artist: "Disturbed", url: "https://www.youtube.com/watch?v=7eXLruT4g0M", youtubeId: "7eXLruT4g0M" },
          { title: "Chop Suey!", artist: "System of a Down", url: "https://www.youtube.com/watch?v=8fXLruT4g0M", youtubeId: "8fXLruT4g0M" }
        ]
      },
      
      // Neutral/Calm Playlists
      {
        name: "Peaceful Vibes - English",
        language: "English",
        emotion: "neutral",
        songs: [
          { title: "Weightless", artist: "Marconi Union", url: "https://www.youtube.com/watch?v=9gXLruT4g0M", youtubeId: "9gXLruT4g0M" },
          { title: "Clair de Lune", artist: "Claude Debussy", url: "https://www.youtube.com/watch?v=0hXLruT4g0M", youtubeId: "0hXLruT4g0M" },
          { title: "Meditation", artist: "Massive Attack", url: "https://www.youtube.com/watch?v=1iXLruT4g0M", youtubeId: "1iXLruT4g0M" },
          { title: "Teardrop", artist: "Massive Attack", url: "https://www.youtube.com/watch?v=2jXLruT4g0M", youtubeId: "2jXLruT4g0M" },
          { title: "Porcelain", artist: "Moby", url: "https://www.youtube.com/watch?v=3kXLruT4g0M", youtubeId: "3kXLruT4g0M" }
        ]
      },
      {
        name: "शांति के गाने - Hindi",
        language: "Hindi",
        emotion: "neutral",
        songs: [
          { title: "Kun Faya Kun", artist: "A.R. Rahman", url: "https://www.youtube.com/watch?v=4rXLruT4g0M", youtubeId: "4rXLruT4g0M" },
          { title: "Maula Mere Maula", artist: "Roop Kumar Rathod", url: "https://www.youtube.com/watch?v=5sXLruT4g0M", youtubeId: "5sXLruT4g0M" },
          { title: "Tere Bina", artist: "A.R. Rahman", url: "https://www.youtube.com/watch?v=6tXLruT4g0M", youtubeId: "6tXLruT4g0M" },
          { title: "Khwabon Ke Parindey", artist: "Mohit Chauhan", url: "https://www.youtube.com/watch?v=7uXLruT4g0M", youtubeId: "7uXLruT4g0M" },
          { title: "Dil Se", artist: "A.R. Rahman", url: "https://www.youtube.com/watch?v=8vXLruT4g0M", youtubeId: "8vXLruT4g0M" }
        ]
      },
      
      // Surprised Playlists
      {
        name: "Unexpected Beats - English",
        language: "English",
        emotion: "surprised",
        songs: [
          { title: "Bohemian Rhapsody", artist: "Queen", url: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ", youtubeId: "fJ9rUzIMcZQ" },
          { title: "Stairway to Heaven", artist: "Led Zeppelin", url: "https://www.youtube.com/watch?v=QkF3oxziUI4", youtubeId: "QkF3oxziUI4" },
          { title: "Hotel California", artist: "Eagles", url: "https://www.youtube.com/watch?v=BciS5krYL80", youtubeId: "BciS5krYL80" },
          { title: "Sweet Child O' Mine", artist: "Guns N' Roses", url: "https://www.youtube.com/watch?v=1w7OgIMMRc4", youtubeId: "1w7OgIMMRc4" },
          { title: "Smells Like Teen Spirit", artist: "Nirvana", url: "https://www.youtube.com/watch?v=hTWKbfoikeg", youtubeId: "hTWKbfoikeg" }
        ]
      }
    ];
    
    const createdPlaylists = await Playlist.insertMany(samplePlaylists);
    res.json({ message: `${createdPlaylists.length} sample playlists created successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error seeding playlists', error: error.message });
  }
});

module.exports = router;
