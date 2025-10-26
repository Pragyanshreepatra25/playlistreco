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
          { title: "Rangabati", artist: "Jitendra Haripal", url: "https://example.com/rangabati" },
          { title: "Mu Eka Tu Eka", artist: "Pranab Patnaik", url: "https://example.com/mu-eka-tu-eka" },
          { title: "Ae Mana Ae Mana", artist: "Akshaya Mohanty", url: "https://example.com/ae-mana" },
          { title: "Mu Tote Bhalapae", artist: "Pranab Patnaik", url: "https://example.com/mu-tote" },
          { title: "Jhia Jhia Jhia", artist: "Pranab Patnaik", url: "https://example.com/jhia-jhia" }
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
          { title: "Tum Hi Aana", artist: "Jubin Nautiyal", url: "https://example.com/tum-hi-aana" },
          { title: "Channa Mereya", artist: "Arijit Singh", url: "https://example.com/channa-mereya" },
          { title: "Tere Bina", artist: "A.R. Rahman", url: "https://example.com/tere-bina" },
          { title: "Kabira", artist: "Arijit Singh", url: "https://example.com/kabira" },
          { title: "Ae Dil Hai Mushkil", artist: "Arijit Singh", url: "https://example.com/ae-dil-hai" }
        ]
      },
      
      // Angry Playlists
      {
        name: "Rage & Energy - English",
        language: "English",
        emotion: "angry",
        songs: [
          { title: "Break Stuff", artist: "Limp Bizkit", url: "https://example.com/break-stuff" },
          { title: "Killing in the Name", artist: "Rage Against the Machine", url: "https://example.com/killing-name" },
          { title: "Bodies", artist: "Drowning Pool", url: "https://example.com/bodies" },
          { title: "Down with the Sickness", artist: "Disturbed", url: "https://example.com/down-sickness" },
          { title: "Chop Suey!", artist: "System of a Down", url: "https://example.com/chop-suey" }
        ]
      },
      
      // Neutral/Calm Playlists
      {
        name: "Peaceful Vibes - English",
        language: "English",
        emotion: "neutral",
        songs: [
          { title: "Weightless", artist: "Marconi Union", url: "https://example.com/weightless" },
          { title: "Clair de Lune", artist: "Claude Debussy", url: "https://example.com/clair-de-lune" },
          { title: "Meditation", artist: "Massive Attack", url: "https://example.com/meditation" },
          { title: "Teardrop", artist: "Massive Attack", url: "https://example.com/teardrop" },
          { title: "Porcelain", artist: "Moby", url: "https://example.com/porcelain" }
        ]
      },
      {
        name: "शांति के गाने - Hindi",
        language: "Hindi",
        emotion: "neutral",
        songs: [
          { title: "Kun Faya Kun", artist: "A.R. Rahman", url: "https://example.com/kun-faya-kun" },
          { title: "Maula Mere Maula", artist: "Roop Kumar Rathod", url: "https://example.com/maula-mere" },
          { title: "Tere Bina", artist: "A.R. Rahman", url: "https://example.com/tere-bina-neutral" },
          { title: "Khwabon Ke Parindey", artist: "Mohit Chauhan", url: "https://example.com/khwabon-ke" },
          { title: "Dil Se", artist: "A.R. Rahman", url: "https://example.com/dil-se" }
        ]
      },
      
      // Surprised Playlists
      {
        name: "Unexpected Beats - English",
        language: "English",
        emotion: "surprised",
        songs: [
          { title: "Bohemian Rhapsody", artist: "Queen", url: "https://example.com/bohemian-rhapsody" },
          { title: "Stairway to Heaven", artist: "Led Zeppelin", url: "https://example.com/stairway-heaven" },
          { title: "Hotel California", artist: "Eagles", url: "https://example.com/hotel-california" },
          { title: "Sweet Child O' Mine", artist: "Guns N' Roses", url: "https://example.com/sweet-child" },
          { title: "Smells Like Teen Spirit", artist: "Nirvana", url: "https://example.com/smells-like-teen" }
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
