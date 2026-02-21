  // LoginForm.js
  import React, { useState } from 'react';
  import axios from 'axios';
  import { useDispatch } from 'react-redux';
  import { useNavigate } from 'react-router-dom';
  import { setUser } from '../store/authSlice'; // Adjust the path if needed
  import '../styles/LoginForm.css'; // Import the CSS
import { Link } from "react-router-dom";
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
        <h2>Login</h2>

        {error && <p className="message error">{error}</p>}
        {token && <p className="message success">Logged in successfully!</p>}

        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="login-form-group">
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="login-form-group">
            <label>Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="login-form-group">
            <label>Role:</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            
          </div>

          <button type="submit" className="login-button">Login</button>
        </form>
        <p>
  Don't have an account? <Link to="/signup">Sign up</Link>
</p>
      </div>
    );
  }

  export default LoginForm;
