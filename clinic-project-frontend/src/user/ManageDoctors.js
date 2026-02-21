import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ManageDoctors.css';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    speciality: '',
    department: ''
  });
  const [editingDoctorId, setEditingDoctorId] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/doctors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(res.data);
    } catch (err) {
      console.error('Error fetching doctors', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingDoctorId) {
        await axios.patch(
          `https://clinicapp-1-rloo.onrender.com/doctors${editingDoctorId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'https://clinicapp-1-rloo.onrender.com',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setFormData({ name: '', speciality: '', department: '' });
      setEditingDoctorId(null);
      fetchDoctors();
    } catch (err) {
      console.error('Error saving doctor', err);
    }
  };

  const handleEdit = (doctor) => {
    setFormData({
      name: doctor.name,
      speciality: doctor.speciality, // fixed spelling
      department: doctor.department
    });
    setEditingDoctorId(doctor._id);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/doctors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDoctors();
    } catch (err) {
      console.error('Error deleting doctor', err);
    }
  };

  return (
    <div className="manage-doctors">
      <h2>{editingDoctorId ? 'Edit Doctor' : 'Add Doctor'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="speciality"
          placeholder="Speciality"
          value={formData.speciality}
          onChange={handleChange}
          required
        />
        <input
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
        />
        <button type="submit">{editingDoctorId ? 'Update' : 'Add'}</button>
      </form>

      <h3>Doctor List</h3>
      <ul>
        {doctors.map((doctor) => (
          <li key={doctor._id}>
            <strong>{doctor.name}</strong> - {doctor.speciality} - {doctor.department}
            <button onClick={() => handleEdit(doctor)}>Edit</button>
            <button onClick={() => handleDelete(doctor._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageDoctors;
