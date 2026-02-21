import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    console.log("Redux token:", token);

    const fetchProfile = async () => {
      try {
        const res = await axios.get('https://clinicapp-1-rloo.onrender.com/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfile(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Error fetching profile');
      }
    };

    if (token) {
      fetchProfile();
      } else {
      setError('No token found');
    }
  }, [token]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!profile) return <p>Loading profile...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>User Profile</h2>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      {/* Add more fields if needed */}
    </div>
  );
};

export default UserProfile;
