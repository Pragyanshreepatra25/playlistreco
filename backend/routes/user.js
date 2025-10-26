const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Playlist = require('../models/playlist');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, profilePic, languages } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, profilePic, languages },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user favorites
router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('favorites');
    res.json(user.favorites || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add to favorites
router.post('/favorites/:playlistId', authMiddleware, async (req, res) => {
  try {
    const { playlistId } = req.params;
    const user = await User.findById(req.userId);
    
    // Check if playlist exists
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    // Check if already in favorites
    if (user.favorites.includes(playlistId)) {
      return res.status(400).json({ message: 'Playlist already in favorites' });
    }
    
    user.favorites.push(playlistId);
    await user.save();
    
    res.json({ message: 'Added to favorites', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove from favorites
router.delete('/favorites/:playlistId', authMiddleware, async (req, res) => {
  try {
    const { playlistId } = req.params;
    const user = await User.findById(req.userId);
    
    user.favorites = user.favorites.filter(id => id.toString() !== playlistId);
    await user.save();
    
    res.json({ message: 'Removed from favorites', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
