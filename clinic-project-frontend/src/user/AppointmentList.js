import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to view appointments.");
      return;
    }

    axios.get("https://clinicapp-1-rloo.onrender.com/appointments", {
      headers: {  
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setAppointments(res.data);
    })
    .catch(err => {
      console.error("Error fetching appointments:", err);
      setError("Failed to fetch appointments. Please try again later.");
    });
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        appointments.map((appt, index) => (
          <div key={index} style={{ border: "1px solid #ccc", marginBottom: "15px", padding: "10px" }}>
            <h4>Patient: {appt.patient_name} ({appt.age} yrs)</h4>
            <p><strong>Date:</strong> {new Date(appt.appointment_date).toLocaleDateString()}</p>
            <p><strong>Doctor:</strong> {appt.doctor?.name} ({appt.doctor?.specialization})</p>
          </div>
        ))
      )}
    </div>
  );
}
