const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Register a new user
router.post('/register', (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    
    // Create user
    const user = User.create({ username, email, password });
    
    res.status(201).json({
      message: 'User registered successfully',
      user
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login user
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Authenticate user
    const user = User.authenticate(email, password);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    res.json({
      message: 'Login successful',
      user
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get current user (for testing)
router.get('/users', (req, res) => {
  const users = User.getAll();
  res.json(users);
});

module.exports = router; 