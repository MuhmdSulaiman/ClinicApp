var express = require('express');
var router = express.Router();

// const express = require('express');
// const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/userModel.js');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { requireRole } = require('../middleware/roleMiddleware');


/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.send('respond with a resource');
});
// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.userId,
      role: decoded.role, // attach role
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Signup API
router.post('/signup', async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;
  if (!name || !email || !password || !confirmPassword || !role)
    return res.status(400).json({ message: 'All fields are required' });

  if (password !== confirmPassword)
    return res.status(400).json({ message: 'Password and Confirm Password do not match' });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already taken' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'Account created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Login API
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'User not found' });
   
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });
      const token = jwt.sign(
      {
        userId: user._id,
        role: user.role, 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
      res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Get profile
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});



module.exports = router;
