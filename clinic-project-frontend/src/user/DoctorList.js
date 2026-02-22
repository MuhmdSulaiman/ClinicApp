import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from "../services/api";
import '../styles/Doctors.css';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/doctors');
        setDoctors(response.data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to load doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleBook = (doctorName) => {
    navigate(`/book/${encodeURIComponent(doctorName)}`);
  };

  const getInitial = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'DR';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="doctor-list-container">
      <div className="page-header">
        <motion.h2
          className="title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Our Specialists
        </motion.h2>
        <motion.p
          className="subtitle-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Book an appointment with our highly qualified medical professionals.
        </motion.p>
      </div>

      {loading && (
        <motion.div className="loading-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="info-text">Loading specialists...</p>
        </motion.div>
      )}

      {error && (
        <motion.div className="error-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="error-text">{error}</p>
        </motion.div>
      )}

      {!loading && !error && doctors.length === 0 && (
        <motion.div className="empty-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="info-text">No doctors available at the moment.</p>
        </motion.div>
      )}

      {!loading && !error && doctors.length > 0 && (
        <motion.div
          className="doctor-grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {doctors.map((doctor) => (
            <motion.div
              className="doctor-card"
              key={doctor._id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="doctor-top-section">
                <div className="doctor-avatar">
                  {getInitial(doctor.name)}
                </div>
                <div className="doctor-info">
                  <h3>{doctor.name}</h3>
                  <span className="specialty-badge">{doctor.speciality || 'General'}</span>
                </div>
              </div>

              <div className="doctor-details">
                {doctor.department && (
                  <div className="detail-row">
                    <span className="detail-label">Department</span>
                    <span className="detail-value">{doctor.department}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Experience</span>
                  <span className="detail-value">5+ Years</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Consultation Fee</span>
                  <span className="detail-value">$50</span>
                </div>
              </div>

              <motion.button
                className="book-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBook(doctor.name)}
              >
                Book Appointment
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default DoctorList;
