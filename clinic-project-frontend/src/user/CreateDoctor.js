import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import api from "../services/api";

const CreateDoctor = () => {
  const [formData, setFormData] = useState({
    name: '',
    speciality: '',
    department: ''
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.auth.token);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await api.post('/doctors', formData);
      const addedDoctor = response.data.doctor;

      setIsError(false);
      setMessage(`${addedDoctor.name} added successfully to ${addedDoctor.department}!`);

      setFormData({
        name: '',
        speciality: '',
        department: ''
      });

      setTimeout(() => setMessage(''), 4000);
    } catch (error) {
      console.error(error);
      setIsError(true);
      setMessage(error.response?.data?.message || 'Error creating doctor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 100px)',
      padding: '40px 20px',
      backgroundColor: '#f4f7fb',
      fontFamily: '"Inter", sans-serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%',
          maxWidth: '500px',
          background: '#ffffff',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{
            color: '#1e1e4a', fontSize: '2rem',
            fontWeight: '800', margin: '0 0 10px 0', letterSpacing: '-0.5px'
          }}>
            Onboard Doctor
          </h2>
          <p style={{ color: '#64748b', margin: 0 }}>Add a new specialist to the clinic database.</p>
        </div>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: isError ? '#fee2e2' : '#ecfdf5',
                color: isError ? '#dc2626' : '#059669',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '20px',
                textAlign: 'center',
                fontWeight: '500',
                border: `1px solid ${isError ? '#fecaca' : '#a7f3d0'}`,
              }}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
              Full Name
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              name="name"
              placeholder="e.g. Dr. Sarah Jenkins"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%', padding: '14px 16px', background: '#f8fafc',
                border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '15px', color: '#1e293b',
                boxSizing: 'border-box', outline: 'none', transition: 'all 0.3s'
              }}
              onFocus={(e) => {
                e.target.style.background = '#ffffff';
                e.target.style.borderColor = '#009ffd';
                e.target.style.boxShadow = '0 0 0 4px rgba(0, 159, 253, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.background = '#f8fafc';
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
              Specialization
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              name="speciality"
              placeholder="e.g. Neurologist"
              value={formData.speciality}
              onChange={handleChange}
              required
              style={{
                width: '100%', padding: '14px 16px', background: '#f8fafc',
                border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '15px', color: '#1e293b',
                boxSizing: 'border-box', outline: 'none', transition: 'all 0.3s'
              }}
              onFocus={(e) => {
                e.target.style.background = '#ffffff';
                e.target.style.borderColor = '#009ffd';
                e.target.style.boxShadow = '0 0 0 4px rgba(0, 159, 253, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.background = '#f8fafc';
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
              Department
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              name="department"
              placeholder="e.g. Neurology Wing"
              value={formData.department}
              onChange={handleChange}
              required
              style={{
                width: '100%', padding: '14px 16px', background: '#f8fafc',
                border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '15px', color: '#1e293b',
                boxSizing: 'border-box', outline: 'none', transition: 'all 0.3s'
              }}
              onFocus={(e) => {
                e.target.style.background = '#ffffff';
                e.target.style.borderColor = '#009ffd';
                e.target.style.boxShadow = '0 0 0 4px rgba(0, 159, 253, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.background = '#f8fafc';
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <motion.button
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            type="submit"
            disabled={loading}
            style={{
              marginTop: '10px', width: '100%', padding: '16px', background: loading ? '#94a3b8' : '#1e1e4a',
              color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem',
              fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s',
              boxShadow: loading ? 'none' : '0 8px 20px rgba(30, 30, 74, 0.2)'
            }}
          >
            {loading ? 'Adding...' : 'Onboard Doctor'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateDoctor;
