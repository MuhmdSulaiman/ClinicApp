const bcrypt = require('bcrypt');
const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken');


exports.SignupUser=async (req, res) => {
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
};


exports.loginUser= async (req, res) => {
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
};

exports.getProfile=async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getAllUsers=async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteUser=async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};