import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ManageDoctors.css';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    department: ''
  });
  const [editingDoctorId, setEditingDoctorId] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/doctors');
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
      if (editingDoctorId) {
        await axios.put(`http://localhost:5000/doctors/${editingDoctorId}`, formData);
      } else {
        await axios.post('http://localhost:5000/doctors', formData);
      }
      setFormData({ name: '', specialization: '', department: '' });
      setEditingDoctorId(null);
      fetchDoctors();
    } catch (err) {
      console.error('Error saving doctor', err);
    }
  };

  const handleEdit = (doctor) => {
    setFormData({
      name: doctor.name,
      speciality: doctor.speciality,
      department: doctor.department
    });
    setEditingDoctorId(doctor._id);
  };

  const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem('token'); // or wherever you store it
    await axios.delete(`http://localhost:5000/doctors/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="specialization" placeholder="Specialization" value={formData.specialization} onChange={handleChange} required />
        <input name="department" placeholder="Department" value={formData.department} onChange={handleChange} />
        <button type="submit">{editingDoctorId ? 'Update' : 'Add'}</button>
      </form>

      <h3>Doctor List</h3>
      <ul>
        {doctors.map((doctor) => (
          <li key={doctor._id}>
            <strong>{doctor.name}</strong> - {doctor.specialization} - {doctor.department}
            <button onClick={() => handleEdit(doctor)}>Edit</button>
            <button onClick={() => handleDelete(doctor._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageDoctors;
