import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BACKEND_URL = "https://goturff.onrender.com";


const ManagerProfilePage = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('${BACKEND_URL}/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data);
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Manager Profile</h2>
      <div className="space-y-2 text-lg">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Role:</strong> {profile.role}</p>
      </div>
    </div>
  );
};

export default ManagerProfilePage;
