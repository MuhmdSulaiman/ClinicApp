import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/BookAppointments.css';

const BookAppointment = () => {
  const { doctorName } = useParams();

  const [formData, setFormData] = useState({
    doctor_name: '',
    patient_name: '',
    age: '',
    appointment_date: '',
    reason: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (doctorName) {
      setFormData((prev) => ({
        ...prev,
        doctor_name: decodeURIComponent(doctorName)
      }));
    }
  }, [doctorName]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:5000/appointment', formData);
      if (response.status === 201) {
        setSuccessMessage('Appointment booked successfully!');
        setFormData({
          doctor_name: decodeURIComponent(doctorName),
          patient_name: '',
          age: '',
          appointment_date: '',
          reason: ''
        });
      }
    } catch (err) {
      setErrorMessage('Failed to book appointment. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="book-appointment-container">
      <h2>Book Appointment</h2>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="form-group">
          <label>Doctor Name</label>
          <input
            type="text"
            name="doctor_name"
            value={formData.doctor_name}
            onChange={handleChange}
            required
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Patient Name</label>
          <input
            type="text"
            name="patient_name"
            value={formData.patient_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Appointment Date</label>
          <input
            type="date"
            name="appointment_date"
            value={formData.appointment_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Reason</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Confirm Appointment
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;
