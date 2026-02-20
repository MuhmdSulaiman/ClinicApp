const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/userModel.js');
const Doctor = require('../models/Doctor');
const { requireRole } = require('../middleware/roleMiddleware');

//middlware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.userId,
      role: decoded.role, 
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    return res.status(200).json(doctors);
  } catch (error) {
    console.error('Fetch doctors error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});
//add doctor
router.post('/', verifyToken, requireRole('admin'), async (req, res) => {
  const { name, speciality, department } = req.body;
  if (!name || !speciality || !department)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    const newDoctor = new Doctor({ name, speciality, department });
    await newDoctor.save();
    return res.status(201).json({ message: 'Doctor added successfully', doctor: newDoctor });
  } catch (error) {
    console.error('Add Doctor error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});
// Update doctor
router.patch('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    return res.status(200).json({ message: 'Doctor updated', doctor });
  } catch (error) {
    console.error('Update doctor error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Delete doctor
router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!deletedDoctor) return res.status(404).json({ message: 'Doctor not found' });
    return res.status(200).json({ message: 'Doctor deleted' });
  } catch (error) {
    console.error('Delete doctor error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});
module.exports = router;
