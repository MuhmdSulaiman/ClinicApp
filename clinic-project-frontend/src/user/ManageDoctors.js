import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../services/api";

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    speciality: "",
    department: "",
  });
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  // 🔹 Fetch doctors
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await api.get(
        "/doctors",
        
      );
      setDoctors(res.data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  // 🔹 Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Add or Update doctor
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // UPDATE
        await api.patch(
          `/doctors/${editingId}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        // CREATE
        await axios.post(
          "https://clinicapp-1-rloo.onrender.com/doctors",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setFormData({ name: "", speciality: "", department: "" });
      setEditingId(null);
      fetchDoctors(); // refresh list
    } catch (err) {
      console.error("Error saving doctor:", err.response?.data);
    }
  };

  // 🔹 Edit
  const handleEdit = (doctor) => {
    setFormData({
      name: doctor.name,
      speciality: doctor.speciality,
      department: doctor.department,
    });
    setEditingId(doctor._id);
  };

  // 🔹 Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://clinicapp-1-rloo.onrender.com/doctors/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchDoctors();
    } catch (err) {
      console.error("Error deleting doctor:", err.response?.data);
    }
  };

  return (
    <div>
      <h2>{editingId ? "Edit Doctor" : "Add Doctor"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Doctor Name"
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
        <button type="submit">
          {editingId ? "Update Doctor" : "Add Doctor"}
        </button>
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