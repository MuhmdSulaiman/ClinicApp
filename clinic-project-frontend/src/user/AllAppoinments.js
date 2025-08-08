import React, { useEffect, useState } from "react";
import axios from "axios";

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/appointments/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>All Appointments</h2>
      {appointments.map((a) => (
        <div key={a._id}>
          <strong>Patient:</strong> {a.patient_name} <br />
          <strong>Doctor:</strong> {a.doctor?.name} <br />
          <strong>Date:</strong> {new Date(a.appointment_date).toLocaleDateString()}
          <hr />
        </div>
      ))}
    </div>
  );
};

export default AllAppointments;
