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
          { title: "Mere Sapno Ki Rani", artist: "Kishore Kumar", url: "https://www.youtube.com/watch?v=TUD6lY8aPm0", youtubeId: "TUD6lY8aPm0" },
          { title: "Chaiyya Chaiyya", artist: "A.R. Rahman", url: "https://www.youtube.com/watch?v=3Fvj_HvDniU", youtubeId: "3Fvj_HvDniU" },
          { title: "Dil Chahta Hai", artist: "Shankar-Ehsaan-Loy", url: "https://www.youtube.com/watch?v=Cq-_TvQXSAk", youtubeId: "Cq-_TvQXSAk" },
          { title: "Tum Hi Ho", artist: "Arijit Singh", url: "https://www.youtube.com/watch?v=K0BUzMEdx50", youtubeId: "K0BUzMEdx50" }
        ]
      },
      {
        name: "ଖୁସିର ଗୀତ - Odia",
        language: "Odia",
        emotion: "happy",
        songs: [
          { title: "Rangabati", artist: "Jitendra Haripal", url: "https://www.youtube.com/watch?v=jUMHmMvjVN0", youtubeId: "jUMHmMvjVN0" },
          { title: "Mu Eka Tu Eka", artist: "Pranab Patnaik", url: "https://www.youtube.com/watch?v=vKjZlJcUVM8", youtubeId: "vKjZlJcUVM8" },
          { title: "Ae Mana Ae Mana", artist: "Akshaya Mohanty", url: "https://www.youtube.com/watch?v=tdqZGmQFBjc", youtubeId: "tdqZGmQFBjc" },
          { title: "Mu Tote Bhalapae", artist: "Pranab Patnaik", url: "https://www.youtube.com/watch?v=M5gY5HN55YY", youtubeId: "M5gY5HN55YY" },
          { title: "Jhia Jhia Jhia", artist: "Pranab Patnaik", url: "https://www.youtube.com/watch?v=z_XJ2ZqVP8k", youtubeId: "z_XJ2ZqVP8k" }
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
          { title: "Channa Mereya", artist: "Arijit Singh", url: "https://www.youtube.com/watch?v=0PQjnGrIB3o", youtubeId: "0PQjnGrIB3o" },
          { title: "Tere Bina", artist: "A.R. Rahman", url: "https://www.youtube.com/watch?v=7gz1P-QxWlY", youtubeId: "7gz1P-QxWlY" },
          { title: "Kabira", artist: "Arijit Singh", url: "https://www.youtube.com/watch?v=i1dHI7hS-Yk", youtubeId: "i1dHI7hS-Yk" },
          { title: "Ae Dil Hai Mushkil", artist: "Arijit Singh", url: "https://www.youtube.com/watch?v=fmOEKOjyDxU", youtubeId: "fmOEKOjyDxU" }
        ]
      },
      
      // Angry Playlists
      {
        name: "Rage & Energy - English",
        language: "English",
        emotion: "angry",
        songs: [
          { title: "Break Stuff", artist: "Limp Bizkit", url: "https://www.youtube.com/watch?v=vm32-tchedg", youtubeId: "vm32-tchedg" },
          { title: "Killing in the Name", artist: "Rage Against the Machine", url: "https://www.youtube.com/watch?v=bWXazVhlyxY", youtubeId: "bWXazVhlyxY" },
          { title: "Bodies", artist: "Drowning Pool", url: "https://www.youtube.com/watch?v=o81VNMXSr44", youtubeId: "o81VNMXSr44" },
          { title: "Down with the Sickness", artist: "Disturbed", url: "https://www.youtube.com/watch?v=09LTT0xwAbw", youtubeId: "09LTT0xwAbw" },
          { title: "Chop Suey!", artist: "System of a Down", url: "https://www.youtube.com/watch?v=CSvFpBOe8eY", youtubeId: "CSvFpBOe8eY" }
        ]
      },
      
      // Neutral/Calm Playlists
      {
        name: "Peaceful Vibes - English",
        language: "English",
        emotion: "neutral",
        songs: [
          { title: "Weightless", artist: "Marconi Union", url: "https://www.youtube.com/watch?v=UfcAVejslrU", youtubeId: "UfcAVejslrU" },
          { title: "Clair de Lune", artist: "Claude Debussy", url: "https://www.youtube.com/watch?v=CvFH_6DNRCY", youtubeId: "CvFH_6DNRCY" },
          { title: "Meditation", artist: "Massive Attack", url: "https://www.youtube.com/watch?v=FOt3oQ_k008", youtubeId: "FOt3oQ_k008" },
          { title: "Teardrop", artist: "Massive Attack", url: "https://www.youtube.com/watch?v=u7K72X4eo_s", youtubeId: "u7K72X4eo_s" },
          { title: "Porcelain", artist: "Moby", url: "https://www.youtube.com/watch?v=jH8C0SOdJTM", youtubeId: "jH8C0SOdJTM" }
        ]
      },
      {
        name: "शांति के गाने - Hindi",
        language: "Hindi",
        emotion: "neutral",
        songs: [
          { title: "Kun Faya Kun", artist: "A.R. Rahman", url: "https://www.youtube.com/watch?v=8PA8HPmNndU", youtubeId: "8PA8HPmNndU" },
          { title: "Maula Mere Maula", artist: "Roop Kumar Rathod", url: "https://www.youtube.com/watch?v=j-VxK9XM_A8", youtubeId: "j-VxK9XM_A8" },
          { title: "Tere Bina", artist: "A.R. Rahman", url: "https://www.youtube.com/watch?v=7gz1P-QxWlY", youtubeId: "7gz1P-QxWlY" },
          { title: "Khwabon Ke Parindey", artist: "Mohit Chauhan", url: "https://www.youtube.com/watch?v=dXHQBSDL-aA", youtubeId: "dXHQBSDL-aA" },
          { title: "Dil Se", artist: "A.R. Rahman", url: "https://www.youtube.com/watch?v=mURhkviJPo0", youtubeId: "mURhkviJPo0" }
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
