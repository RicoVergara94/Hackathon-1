const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check is user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ messsage: 'User already exists' });
    }

    // Hash the password
    const hashedPasswrods = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ usermame, password: hashedPasswrod });
    await newUser.save();

    res.status(201).json({ message: 'User registered succesfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Log in a user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Log out a user
exports.logout = (req, res) => {
  // Invalidate JWT on client-side (remove token)
  res.json({ message: 'Logged out successfully' });
};
