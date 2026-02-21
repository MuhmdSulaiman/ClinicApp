  // LoginForm.js
  import React, { useState } from 'react';
  import axios from 'axios';
  import { useDispatch } from 'react-redux';
  import { useNavigate } from 'react-router-dom';
  import { setUser } from '../store/authSlice'; // Adjust the path if needed
  import '../styles/LoginForm.css'; // Import the CSS
  import { Link } from "react-router-dom";
  import { motion } from "framer-motion";
  
  function LoginForm() {
    const [formData, setFormData] = useState({
      name: '', email: '', password: '', role: ''
    });

    const [error, setError] = useState('');
    const [token, setToken] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');

      try {
        const response = await axios.post('https://clinicapp-1-rloo.onrender.com/users/login', formData);
        setToken(response.data.token);
        dispatch(setUser({ user: response.data.user, token: response.data.token }));
        localStorage.setItem('token', response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        navigate('../doctors');
      } catch (err) {
        setError(err.response?.data?.message || 'Login failed');
      }
    };

    return (
  <div className="login-container">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="login-box"
    >
      <h2>Login</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
        >
          Login
        </motion.button>
      </form>
    </motion.div>
  </div>
);
  }

  export default LoginForm;
