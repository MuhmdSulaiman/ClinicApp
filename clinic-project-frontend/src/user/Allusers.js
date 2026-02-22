import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users/all");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err.response?.data);
      }
    }
  };

  const getRoleBadgeColor = (role) => {
    return role === 'admin'
      ? { bg: '#fee2e2', text: '#ef4444' }
      : { bg: '#e0f2fe', text: '#0284c7' };
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 100px)',
      padding: '40px 20px',
      backgroundColor: '#f4f7fb',
      fontFamily: '"Inter", sans-serif',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{ width: '100%', maxWidth: '1000px' }}>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: '2.2rem',
            fontWeight: '800',
            color: '#1e1e4a',
            marginBottom: '30px',
            textAlign: 'center',
            letterSpacing: '-0.5px'
          }}
        >
          User Management
        </motion.h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading users...</div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <tr>
                    <th style={{ padding: '20px', color: '#475569', fontWeight: '600', fontSize: '0.95rem' }}>User Profile</th>
                    <th style={{ padding: '20px', color: '#475569', fontWeight: '600', fontSize: '0.95rem' }}>Contact Info</th>
                    <th style={{ padding: '20px', color: '#475569', fontWeight: '600', fontSize: '0.95rem' }}>Role Status</th>
                    <th style={{ padding: '20px', color: '#475569', fontWeight: '600', fontSize: '0.95rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {users.map((user, index) => {
                      const roleColors = getRoleBadgeColor(user.role);
                      return (
                        <motion.tr
                          key={user._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, backgroundColor: '#fee2e2' }}
                          transition={{ delay: index * 0.05 }}
                          style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <td style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                              <div style={{
                                width: '45px', height: '45px', borderRadius: '12px',
                                background: 'linear-gradient(135deg, #009ffd 0%, #1e1e4a 100%)',
                                color: 'white', display: 'flex', justifyContent: 'center',
                                alignItems: 'center', fontWeight: '700', fontSize: '1.2rem',
                                boxShadow: '0 4px 10px rgba(0, 159, 253, 0.3)'
                              }}>
                                {getInitial(user.name)}
                              </div>
                              <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '1.05rem' }}>
                                {user.name}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '20px', color: '#64748b' }}>
                            {user.email}
                          </td>
                          <td style={{ padding: '20px' }}>
                            <span style={{
                              background: roleColors.bg,
                              color: roleColors.text,
                              padding: '6px 12px',
                              borderRadius: '50px',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              textTransform: 'capitalize',
                              letterSpacing: '0.5px'
                            }}>
                              {user.role}
                            </span>
                          </td>
                          <td style={{ padding: '20px', textAlign: 'right' }}>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDelete(user._id)}
                              style={{
                                background: '#fee2e2',
                                color: '#dc2626',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontSize: '0.9rem'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#ef4444';
                                e.currentTarget.style.color = 'white';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#fee2e2';
                                e.currentTarget.style.color = '#dc2626';
                              }}
                            >
                              Revoke Access
                            </motion.button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            {users.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                No registered users found.
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;