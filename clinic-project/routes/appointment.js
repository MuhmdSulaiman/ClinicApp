const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/userModel.js');
const Appointment = require('../models/Appointment');
const { requireRole } = require('../middleware/roleMiddleware');
const Doctor = require('../models/Doctor');


// 
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};
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
// Get appointments
router.get('/', verifyToken, async (req, res) => {
  try {
    let appointments;

    if (req.user.role === 'admin') {
      // Admin sees all appointments
      appointments = await Appointment.find()
        .populate('doctor', 'name specialization')
        .populate('user', 'name email');
    } else {
      // User sees only their own
      appointments = await Appointment.find({ user: req.user.id })
        .populate('doctor', 'name specialization')
        .populate('user', 'name email');
    }

    return res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});


    // Book appointment
    router.post('/', verifyToken, requireRole('user','admin'), async (req, res) => {
       console.log("Role in token:", req.user.role);
    const { doctor_name, patient_name, age, appointment_date, reason } = req.body;
    if (!doctor_name || !patient_name || !age || !appointment_date)
        return res.status(400).json({ message: 'Required fields missing' });

    if (new Date(appointment_date) < new Date())
        return res.status(400).json({ message: 'Appointment date cannot be in the past' });

    try {
        const doctor = await Doctor.findOne({ name: doctor_name });
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

        const newAppointment = new Appointment({
        user: req.user.id,
        doctor: doctor._id,
        patient_name,
        age,
        appointment_date, 
        reason,
        });

        await newAppointment.save();
        return res.status(201).json({ message: 'Appointment booked successfully' });
    } catch (error) {
        console.error('Booking error:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
    });

module.exports = router;
