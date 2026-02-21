const Doctor = require('../models/Doctor');

// Get all doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    return res.status(200).json(doctors);
  } catch (error) {
    console.error('Fetch doctors error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// Add doctor
exports.addDoctor = async (req, res) => {
  const { name, speciality, department } = req.body;

  if (!name || !speciality || !department)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    const newDoctor = new Doctor({ name, speciality, department });
    await newDoctor.save();
    return res.status(201).json({ message: 'Doctor added successfully', doctor: newDoctor });
  } catch (error) {
    console.error('Add Doctor error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// Update doctor
exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!doctor)
      return res.status(404).json({ message: 'Doctor not found' });

    return res.status(200).json({ message: 'Doctor updated', doctor });
  } catch (error) {
    console.error('Update doctor error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// Delete doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!deletedDoctor)
      return res.status(404).json({ message: 'Doctor not found' });

    return res.status(200).json({ message: 'Doctor deleted' });
  } catch (error) {
    console.error('Delete doctor error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};