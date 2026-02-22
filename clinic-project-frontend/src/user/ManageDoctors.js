import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import "../styles/ManageDoctors.css";

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    speciality: "",
    department: "",
  });
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/doctors");
      setDoctors(res.data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.patch(
          `/doctors/${editingId}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await api.post(
          "/doctors",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setFormData({ name: "", speciality: "", department: "" });
      setEditingId(null);
      fetchDoctors();
    } catch (err) {
      console.error("Error saving doctor:", err.response?.data);
    }
  };

  const handleEdit = (doctor) => {
    setFormData({
      name: doctor.name,
      speciality: doctor.speciality,
      department: doctor.department,
    });
    setEditingId(doctor._id);

    // Scroll to top when editing
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this doctor?")) {
      try {
        await api.delete(
          `/doctors/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchDoctors();
      } catch (err) {
        console.error("Error deleting doctor:", err.response?.data);
      }
    }
  };

  const getInitial = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'DR';
  };

  return (
    <div className="manage-wrapper">
      <div className="manage-doctors">
        <motion.h2
          className="page-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Manage Doctors
        </motion.h2>

        <motion.div
          className="form-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2>{editingId ? "Edit Doctor Profile" : "Add New Doctor"}</h2>
          <form onSubmit={handleSubmit} className="doctor-form">
            <motion.input
              whileFocus={{ scale: 1.01 }}
              className="form-group full"
              name="name"
              placeholder="Doctor Full Name (e.g., Dr. Jane Smith)"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <motion.input
              whileFocus={{ scale: 1.01 }}
              name="speciality"
              placeholder="Speciality (e.g., Cardiologist)"
              value={formData.speciality}
              onChange={handleChange}
              required
            />
            <motion.input
              whileFocus={{ scale: 1.01 }}
              name="department"
              placeholder="Department (e.g., Cardiology)"
              value={formData.department}
              onChange={handleChange}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="submit-btn"
            >
              {editingId ? "Update Doctor Information" : "Add Doctor to Database"}
            </motion.button>
          </form>
        </motion.div>

        <div className="list-header">
          <h3>Registered Doctors</h3>
        </div>

        {doctors.length === 0 ? (
          <div className="empty-state">No doctors registered yet. Add one above.</div>
        ) : (
          <ul className="doctors-list">
            <AnimatePresence>
              {doctors.map((doctor, index) => (
                <motion.li
                  key={doctor._id}
                  className="doctor-list-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="doc-info">
                    <div className="doc-avatar">{getInitial(doctor.name)}</div>
                    <div className="doc-details">
                      <h4>{doctor.name}</h4>
                      <p>
                        <span className="doc-badge">{doctor.speciality}</span>
                        {doctor.department}
                      </p>
                    </div>
                  </div>
                  <div className="action-buttons">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(doctor)}
                      className="edit-btn"
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(doctor._id)}
                      className="delete-btn"
                    >
                      Remove
                    </motion.button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageDoctors;