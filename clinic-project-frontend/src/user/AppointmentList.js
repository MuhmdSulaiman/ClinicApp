import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from "../services/api";

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to view appointments.");
      setLoading(false);
      return;
    }

    api.get("/appointments")
      .then(res => {
        setAppointments(res.data);
      })
      .catch(err => {
        console.error("Error fetching appointments:", err);
        setError("Failed to fetch appointments. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  const getStatusColor = (dateString) => {
    const apptDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (apptDate < today) return { bg: '#f1f5f9', color: '#64748b', text: 'Completed', dot: '#cbd5e1' };
    if (apptDate.toDateString() === today.toDateString()) return { bg: '#ecfdf5', color: '#059669', text: 'Today', dot: '#10b981' };
    return { bg: '#eff6ff', color: '#2563eb', text: 'Upcoming', dot: '#3b82f6' };
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 100px)',
      padding: '40px 20px',
      backgroundColor: '#f4f7fb',
      fontFamily: '"Inter", sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{ width: '100%', maxWidth: '900px' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#1e1e4a',
            margin: '0 0 10px 0',
            letterSpacing: '-1px'
          }}>
            My Bookings
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem', margin: '0' }}>
            Manage and view your scheduled clinic visits.
          </p>
        </motion.div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '1.1rem' }}>
            Retrieving your appointments...
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: '#fee2e2', color: '#dc2626', padding: '20px',
              borderRadius: '16px', textAlign: 'center', border: '1px solid #fecaca',
              fontWeight: '500'
            }}
          >
            {error}
          </motion.div>
        )}

        {!loading && !error && appointments.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: '#ffffff', padding: '60px 20px',
              borderRadius: '24px', textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📅</div>
            <h3 style={{ margin: '0 0 10px 0', color: '#1e1e4a' }}>No Appointments Yet</h3>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>You haven't booked any clinic visits recently.</p>
          </motion.div>
        )}

        {!loading && !error && appointments.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {appointments.map((appt, index) => {
              const status = getStatusColor(appt.appointment_date);

              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                    padding: '24px',
                    borderLeft: `6px solid ${status.dot}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '20px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ flex: '1 1 min-content' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <span style={{
                        background: status.bg, color: status.color,
                        padding: '6px 14px', borderRadius: '50px',
                        fontSize: '0.85rem', fontWeight: '600',
                        display: 'flex', alignItems: 'center', gap: '6px'
                      }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: status.dot }}></div>
                        {status.text}
                      </span>
                      <span style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>
                        {formatDate(appt.appointment_date)}
                      </span>
                    </div>

                    <h4 style={{ margin: '0 0 8px 0', fontSize: '1.3rem', color: '#1e293b', fontWeight: '700' }}>
                      Consultation
                    </h4>

                    <div style={{ color: '#475569', fontSize: '1rem', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <div><strong>Patient:</strong> {appt.patient_name} <span style={{ color: '#94a3b8' }}>({appt.age} yrs)</span></div>
                    </div>
                  </div>

                  <div style={{
                    background: '#f8fafc', padding: '16px 24px',
                    borderRadius: '16px', display: 'flex',
                    alignItems: 'center', gap: '15px', border: '1px solid #f1f5f9',
                    minWidth: '250px'
                  }}>
                    <div style={{
                      width: '45px', height: '45px', borderRadius: '12px',
                      background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                      color: '#0369a1', display: 'flex', justifyContent: 'center',
                      alignItems: 'center', fontWeight: '700', fontSize: '1.2rem'
                    }}>
                      DR
                    </div>
                    <div>
                      <div style={{ color: '#1e1e4a', fontWeight: '700' }}>{appt.doctor?.name || appt.doctor_name || 'Assigned Doctor'}</div>
                      <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '500' }}>{appt.doctor?.speciality || 'General Medicine'}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
