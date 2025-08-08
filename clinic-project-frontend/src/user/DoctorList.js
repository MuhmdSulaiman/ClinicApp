// DoctorList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Doctors.css';
import { useNavigate } from 'react-router-dom';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/doctors');
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


  return (
    <div className="doctor-list-container">
      <h2 className="title">Our Doctors</h2>

      {loading && <p className="info-text">Loading doctors...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && doctors.length === 0 && (
        <p className="info-text">No doctors available.</p>
      )}

      {!loading && !error && doctors.length > 0 && (
        <div className="doctor-grid">
          {doctors.map((doctor) => (
            <div className="doctor-card" key={doctor._id}>
              <div className="doctor-header">
                <h3>{doctor.name}</h3>
                <button
                  className="book-btn"
                  onClick={() => handleBook(doctor.name)}
                >
                  Book Appointment
                </button>
              </div>
              <p><strong>Specialization:</strong> {doctor.specialization || 'N/A'}</p>
              {doctor.department && (
                <p><strong>Department:</strong> {doctor.department}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorList;
