const express = require('express');
const router = express.Router();
const { requireRole } = require('./middleware/roleMiddleware');
const verifyToken = require('./middleware/authMiddleware');

const {
  getDoctors,
  addDoctor,
  updateDoctor,
  deleteDoctor} = require('../controllers/doctorController');

// Routes
router.get('/', getDoctors);

router.post('/', verifyToken, requireRole('admin'), addDoctor);

router.patch('/:id', verifyToken, requireRole('admin'), updateDoctor);

router.delete('/:id', verifyToken, requireRole('admin'), deleteDoctor);

module.exports = router;