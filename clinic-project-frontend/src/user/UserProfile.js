import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import api from "../services/api";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/me');
        setProfile(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Error fetching profile');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
      setError('Please log in to view your profile.');
    }
  }, [token]);

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div style={{ minHeight: 'calc(100vh - 100px)', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f4f7fb' }}>
        <p style={{ color: '#64748b', fontSize: '1.2rem' }}>Loading profile...</p>
      </div>
    );
  }

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
      <div style={{ width: '100%', maxWidth: '600px' }}>
        {error ? (
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
        ) : profile ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
              border: '1px solid rgba(0,0,0,0.03)'
            }}
          >
            {/* Cover Photo Area */}
            <div style={{
              height: '160px',
              background: 'linear-gradient(135deg, #009ffd 0%, #1e1e4a 100%)',
              position: 'relative'
            }}>
              {/* Profile Avatar */}
              <motion.div
                initial={{ scale: 0, x: '-50%' }}
                animate={{ scale: 1, x: '-50%' }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                style={{
                  position: 'absolute',
                  bottom: '-50px',
                  left: '50%',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '5px'
                }}
              >
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                  color: '#0369a1',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '2.5rem',
                  fontWeight: '800'
                }}>
                  {getInitial(profile.name)}
                </div>
              </motion.div>
            </div>

            <div style={{ padding: '70px 40px 40px 40px', textAlign: 'center' }}>
              <motion.h2
                variants={itemVariants}
                style={{
                  margin: '0 0 5px 0', fontSize: '2rem',
                  color: '#1e1e4a', fontWeight: '800', letterSpacing: '-0.5px'
                }}
              >
                {profile.name}
              </motion.h2>

              <motion.div variants={itemVariants} style={{ marginBottom: '30px' }}>
                <span style={{
                  background: profile.role === 'admin' ? '#fee2e2' : '#e0f2fe',
                  color: profile.role === 'admin' ? '#dc2626' : '#0284c7',
                  padding: '6px 16px', borderRadius: '50px',
                  fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {profile.role || 'User'}
                </span>
              </motion.div>

              <motion.div
                variants={itemVariants}
                style={{
                  background: '#f8fafc', padding: '20px',
                  borderRadius: '16px', border: '1px solid #e2e8f0',
                  textAlign: 'left'
                }}
              >
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', color: '#64748b', fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Email Address
                  </label>
                  <div style={{ color: '#1e293b', fontSize: '1.1rem', fontWeight: '500' }}>
                    {profile.email}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#64748b', fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Account ID
                  </label>
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                    {profile._id}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
};

export default UserProfile;
