import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/SignupForm.css';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (formData.password !== formData.confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post('users/signup', formData);
      setIsError(false);
      setMessage(res.data.message || 'Signup successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setIsError(true);
      if (err.response) {
        setMessage(err.response.data.message || 'Signup failed');
      } else {
        setMessage('Server error. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-wrapper">
      <motion.div
        className="signup-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="header-container">
          <motion.h2
            className="title"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Create Account
          </motion.h2>
          <motion.p
            className="subtitle"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Join our platform to manage your clinics
          </motion.p>
        </div>

        <AnimatePresence>
          {message && (
            <motion.div
              className={`message ${isError ? 'error-message' : 'success-message'}`}
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <motion.div
              className="form-group full-width"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label>Full Name</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                name="name"
                placeholder="Dr. John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </motion.div>

            <motion.div
              className="form-group full-width"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label>Email Address</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="email"
                name="email"
                placeholder="doctor@clinic.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </motion.div>

            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label>Password</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </motion.div>

            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label>Confirm</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="password"
                name="confirmPassword"
                placeholder="Confirm"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </motion.div>

            <motion.div
              className="form-group full-width"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label>Role</label>
              <motion.select
                whileFocus={{ scale: 1.01 }}
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </motion.select>
            </motion.div>
          </div>

          <motion.button
            className="submit-btn full-width"
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </motion.button>
        </form>

        <motion.p
          className="footer-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Already have an account?
          <Link to="/">Login</Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SignupForm;
