var express = require('express');
var router = express.Router();
const { requireRole } = require('../middleware/roleMiddleware');
const { validateEmail, validatePassword } = require('../middleware/validationMiddleware');
const verifyToken = require('../middleware/authmiddleware');
const {
  SignupUser,
  loginUser,
  getProfile,
  getAllUsers,
  deleteUser
} = require('../controllers/userController');

router.post('/signup',validateEmail,validatePassword,SignupUser);
router.post('/login',loginUser);
router.get('/me', verifyToken,getProfile);
router.get('/all', verifyToken, requireRole('admin'),getAllUsers);
router.delete('/:id', verifyToken, requireRole('admin'), deleteUser);

module.exports = router;
