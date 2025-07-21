const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();








module.exports = router;


// POST /register
router.post('/register', (req, res) => {
  const { username } = req.body;
  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ username, token });

  try {
    // Check for existing user
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed });
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /login

router.post('/login', (req, res) => {
  const { username } = req.body;
  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.status(200).json({ username, token });

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, username }, process.env.JWT_SECRET);
  res.json({ token, user: { id: user._id, username } });
});

module.exports = router;
