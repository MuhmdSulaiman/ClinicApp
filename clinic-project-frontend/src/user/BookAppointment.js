import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/BookAppointments.css";

const BookAppointment = () => {
  const { doctorName } = useParams();

  const [formData, setFormData] = useState({
    doctor_name: "",
    patient_name: "",
    age: "",
    appointment_date: "",
    reason: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (doctorName) {
      setFormData((prev) => ({
        ...prev,
        doctor_name: decodeURIComponent(doctorName),
      }));
    }
  }, [doctorName]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.patient_name.trim()) {
      setErrorMessage("Please enter the patient name.");
      return false;
    }
    if (formData.age <= 0) {
      setErrorMessage("Please enter a valid age.");
      return false;
    }
    if (!formData.appointment_date) {
      setErrorMessage("Please select an appointment date.");
      return false;
    }
    if (!formData.reason.trim()) {
      setErrorMessage("Please provide a reason for the appointment.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("You must be logged in to book an appointment.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "https://clinicapp-1-rloo.onrender.com/doctors",
        {
          ...formData,
          age: Number(formData.age), // ensure age is a number
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage("Appointment booked successfully!");
        setFormData((prev) => ({
          ...prev,
          patient_name: "",
          age: "",
          appointment_date: "",
          reason: "",
        }));
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err) {
      console.error("Booking error:", err.response?.data || err.message);
      setErrorMessage(
        err.response?.data?.message ||
          "Failed to book appointment. Please try again."
      );
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setLoading(false);
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
            placeholder="Enter patient name"
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
            min="1"
            placeholder="Enter age"
            required
          />
        </div>

        <div className="form-group">
          <label>Appointment Date</label>
          <input
            type="date"
            name="appointment_date"
            value={formData.appointment_date}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]} // disable past dates
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
            placeholder="Describe the reason for appointment"
            required
          />
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={loading}
        >
          {loading ? "Booking..." : "Confirm Appointment"}
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;
