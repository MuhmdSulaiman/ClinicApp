const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  return password && password.length >= 8;
};

const validateEmail = (req, res, next) => {
  const { email } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  next();
};

const validatePassword = (req, res, next) => {
  const { password } = req.body;

  if (!isValidPassword(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters'
    });
  }

  next();
};

module.exports = {
  validateEmail,
  validatePassword
};