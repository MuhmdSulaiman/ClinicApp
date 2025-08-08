const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  patient_name: { type: String, required: true },
  age: { type: Number, required: true },
  appointment_date: { type: Date, required: true },
  reason: { type: String },
}, {
  timestamps: true
});

module.exports = mongoose.model('Appointment', appointmentSchema);
