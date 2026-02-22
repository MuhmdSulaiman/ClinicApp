  // LoginForm.js
  import React, { useState } from 'react';
  // import axios from 'axios';
  import { useDispatch } from 'react-redux';
  import { useNavigate } from 'react-router-dom';
  import { setUser,setToken } from '../store/authSlice'; // Adjust the path if needed
  import '../styles/LoginForm.css'; // Import the CSS
  import { Link } from "react-router-dom";
  import { motion } from "framer-motion";
import api from "../services/api";
  
  function LoginForm() {
    const [formData, setFormData] = useState({
      name: '', email: '', password: '', role: ''
    });

    const [error, setError] = useState('');
    // const [token, setToken] = useState(null);
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
        const response = await api.post('/users/login', formData);
          console.log("RESPONSE:", response.data);
        dispatch(setUser(response.data.user));
        dispatch(setToken(response.data.token));              
        localStorage.setItem('token', response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
console.log("Before navigate");

        navigate('../doctors');
      } catch (err) {
        console.log("ERROR OBJECT:", err);
    console.log("ERROR RESPONSE:", err.response);
        setError(err.response?.data?.message || 'Login failed');
      }
    };

    return (
  <div className="login-wrapper">
    <motion.div
      className="login-card"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="title">Welcome Back 🚀</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <motion.input
          whileFocus={{ scale: 1.05 }}
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <motion.input
          whileFocus={{ scale: 1.05 }}
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
        >
          Login
        </motion.button>
       <p><Link to="/Signup">Dont have an Account?Signup</Link></p>
      </form>
    </motion.div>
  </div>
  );}
  export default LoginForm;
