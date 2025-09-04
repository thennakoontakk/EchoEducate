const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
  
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      // ✅ Send role in response too
      res.json({ token, role: user.role });
    } catch (err) {
      res.status(500).json({ error: 'Login failed' });
    }
  });
  router.get('/', async (req, res) => {
    try {
      const users = await User.find({}, '_id username'); // Fetch only ID and username
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });
  

module.exports = router;
