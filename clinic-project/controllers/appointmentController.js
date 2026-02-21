const Appointment = require('../models/Appointment');



exports.GetAppointments=async (req, res) => {
  try {
    let appointments;

    if (req.user.role === 'admin') {
      // Admin sees all appointments
      appointments = await Appointment.find()
        .populate('doctor', 'name specialization')
        .populate('user', 'name email');
    } else {
      // User sees only their own
      appointments = await Appointment.find({ user: req.user.id })
        .populate('doctor', 'name specialization')
        .populate('user', 'name email');
    }

    return res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};


exports.bookAppointments=async (req, res) => {
       console.log("Role in token:", req.user.role);
    const { doctor_name, patient_name, age, appointment_date, reason } = req.body;
    if (!doctor_name || !patient_name || !age || !appointment_date)
        return res.status(400).json({ message: 'Required fields missing' });

    if (new Date(appointment_date) < new Date())
        return res.status(400).json({ message: 'Appointment date cannot be in the past' });

    try {
        const doctor = await Doctor.findOne({ name: doctor_name });
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

        const newAppointment = new Appointment({
        user: req.user.id,
        doctor: doctor._id,
        patient_name,
        age,
        appointment_date, 
        reason,
        });

        await newAppointment.save();
        return res.status(201).json({ message: 'Appointment booked successfully' });
    } catch (error) {
        console.error('Booking error:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
    };
    
