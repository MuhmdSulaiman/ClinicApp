const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const verifyToken=require('../middleware/authmiddleware')
const { requireRole } = require('../middleware/roleMiddleware');

const{
  GetAppointments,
  bookAppointments
}= require('../controllers/appointmentController');

router.get('/', verifyToken,GetAppointments);
router.post('/', verifyToken, requireRole('user','admin'),bookAppointments); 


module.exports = router;
