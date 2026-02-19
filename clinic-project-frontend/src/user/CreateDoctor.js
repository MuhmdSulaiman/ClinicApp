import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const CreateDoctor = () => {
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    department: ''
  });
  const [message, setMessage] = useState('');
  const token = useSelector((state) => state.auth.token);
 console.log("Token from Redux:", token);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://clinicapp-1-rloo.onrender.com', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const addedDoctor = response.data.doctor;
      setMessage(`Doctor ${addedDoctor.name} added successfully in ${addedDoctor.department} department!`);

      setFormData({
        name: '',
        specialization: '',
        department: ''
      });
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Error creating doctor');
    }
    
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Create Doctor</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Doctor Name"
          value={formData.name}
          onChange={handleChange}
          required
        /><br />
        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          value={formData.specialization}
          onChange={handleChange}
          required
        /><br />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          required
        /><br />
        <button type="submit">Add Doctor</button>
      </form>
      {message && <p style={{ marginTop: '10px', color: 'green' }}>{message}</p>}
    </div>
  );
};

export default CreateDoctor;
