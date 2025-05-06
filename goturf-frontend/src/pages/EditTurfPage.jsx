import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditTurfPage.css';

const BACKEND_URL = "https://goturff.onrender.com";


const EditTurfPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    description: '',
    sports: '',
    amenities: '',
    photo: null,
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchTurf = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/turfs/${id}`);
        const turf = res.data;
        setFormData({
          name: turf.name,
          location: turf.location,
          price: turf.price,
          description: turf.description,
          sports: turf.sports.join(', '),
          amenities: turf.amenities.join(', '),
          photo: null,
        });
      } catch (err) {
        console.error('Error fetching turf:', err);
      }
    };

    fetchTurf();
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    setFormData(prev => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();

    for (let key in formData) {
      if (formData[key]) data.append(key, formData[key]);
    }

    try {
      await axios.put(`${BACKEND_URL}/api/manager/edit-turf/${id}`, data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      setSuccessMessage('✅ Turf updated successfully!');
      setTimeout(() => {
        navigate('/manager'); // Redirect to manager dashboard
      }, 1500);
    } catch (err) {
      console.error('Error updating turf:', err);
    }
  };

  return (
    <div className="edit-turf-form">
      <h1>Edit Turf</h1>
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" required />
        <input name="price" value={formData.price} onChange={handleChange} placeholder="Price" required />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
        <input name="sports" value={formData.sports} onChange={handleChange} placeholder="Sports (comma-separated)" />
        <input name="amenities" value={formData.amenities} onChange={handleChange} placeholder="Amenities (comma-separated)" />
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Update Turf</button>
      </form>
    </div>
  );
};





export default EditTurfPage;
