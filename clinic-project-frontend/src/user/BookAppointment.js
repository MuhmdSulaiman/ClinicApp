import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/BookAppointments.css";
import api from "../services/api";

const BookAppointment = () => {
  const { doctorName } = useParams();
  const navigate = useNavigate();

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

      const response = await api.post(
        "/appointments",
        {
          ...formData,
          age: Number(formData.age),
        }
      );

      if (response.status === 201) {
        setSuccessMessage("Appointment booked successfully! Redirecting...");
        setFormData((prev) => ({
          ...prev,
          patient_name: "",
          age: "",
          appointment_date: "",
          reason: "",
        }));

        setTimeout(() => {
          navigate('/appointments');
        }, 2000);
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

  const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="book-appointment-wrapper">
      <motion.div
        className="book-appointment-container"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="form-header">
          <motion.h2 variants={itemVariants}>Book Appointment</motion.h2>
          <motion.p variants={itemVariants}>Fill in the details below to schedule your visit.</motion.p>
        </div>

        <AnimatePresence mode="wait">
          {successMessage && (
            <motion.div
              className="message-box success-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7.5 12L10.5 15L16.5 9" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {successMessage}
            </motion.div>
          )}
          {errorMessage && (
            <motion.div
              className="message-box error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 8V12" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 16H12.01" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="appointment-form">
          <motion.div className="form-group" variants={itemVariants}>
            <label>Specialist Name</label>
            <input
              type="text"
              name="doctor_name"
              value={formData.doctor_name}
              readOnly
            />
          </motion.div>

          <div className="form-row">
            <motion.div className="form-group" variants={itemVariants}>
              <label>Patient Name</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                name="patient_name"
                value={formData.patient_name}
                onChange={handleChange}
                placeholder="Enter patient name"
                required
              />
            </motion.div>

            <motion.div className="form-group" variants={itemVariants}>
              <label>Patient Age</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="1"
                placeholder="Enter age"
                required
              />
            </motion.div>
          </div>

          <motion.div className="form-group" variants={itemVariants}>
            <label>Appointment Date</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="date"
              name="appointment_date"
              value={formData.appointment_date}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </motion.div>

          <motion.div className="form-group" variants={itemVariants}>
            <label>Reason for Visit</label>
            <motion.textarea
              whileFocus={{ scale: 1.01 }}
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Describe the reason for your visit..."
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            className="submit-button"
            disabled={loading}
            variants={itemVariants}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
          >
            {loading ? "Processing..." : "Confirm Appointment"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default BookAppointment;
