import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddTurfPage.css';

const AddTurfPage = () => {
  const navigate = useNavigate();
  const [turfData, setTurfData] = useState({
    name: '',
    location: '',
    price: '',
    description: '',
    sports: [],
    amenities: [],
    photo: null,
  });
  const [amenityInput, setAmenityInput] = useState('');

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setTurfData((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === 'checkbox') {
      setTurfData((prev) => {
        const updatedSports = prev.sports.includes(value)
          ? prev.sports.filter((sport) => sport !== value)
          : [...prev.sports, value];
        return { ...prev, sports: updatedSports };
      });
    } else {
      setTurfData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAmenityAdd = (e) => {
    e.preventDefault();
    if (amenityInput.trim()) {
      setTurfData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()],
      }));
      setAmenityInput('');
    }
  };

  const handleAmenityRemove = (index) => {
    setTurfData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();

    for (const key in turfData) {
      if (key === 'sports') {
        turfData.sports.forEach((sport) => formData.append('sports', sport));
      } else if (key === 'amenities') {
        turfData.amenities.forEach((amenity) => formData.append('amenities', amenity));
      } else {
        formData.append(key, turfData[key]);
      }
    }

    try {
      await axios.post('http://localhost:5000/api/manager/add-turf', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/add-success');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add turf');
    }
  };

  return (
    <div className="add-turf-container">
      <form onSubmit={handleSubmit} className="add-turf-form" encType="multipart/form-data">
        <h2 className="form-title">Add New Turf</h2>

        <input
          type="text"
          name="name"
          placeholder="Turf Name"
          required
          onChange={handleChange}
          className="form-input"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          required
          onChange={handleChange}
          className="form-input"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          required
          onChange={handleChange}
          className="form-input"
        />
        <textarea
          name="description"
          placeholder="Description"
          required
          onChange={handleChange}
          className="form-textarea"
        />

        <label>Select Sports:</label>
        <div className="checkbox-group">
          {['Football', 'Cricket', 'Badminton', 'Tennis'].map((sport) => (
            <label key={sport} className="checkbox-item">
              <input
                type="checkbox"
                value={sport}
                onChange={handleChange}
              />
              {sport}
            </label>
          ))}
        </div>

        <label>Add Amenities:</label>
        <div className="amenity-input-group">
          <input
            type="text"
            value={amenityInput}
            placeholder="Enter an amenity"
            onChange={(e) => setAmenityInput(e.target.value)}
            className="form-input"
          />
          <button onClick={handleAmenityAdd} className="add-amenity-button">Add</button>
        </div>
        <ul className="amenities-list">
          {turfData.amenities.map((amenity, index) => (
            <li key={index} className="amenity-item">
              {amenity}
              <button type="button" onClick={() => handleAmenityRemove(index)} className="remove-button">×</button>
            </li>
          ))}
        </ul>

        <label>Upload Turf Photo:</label>
        <input
          type="file"
          name="photo"
          accept="image/*"
          required
          onChange={handleChange}
          className="form-file-input"
        />

        <button type="submit" className="submit-button">Add Turf</button>
      </form>
    </div>
  );
};

export default AddTurfPage;





















// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './AddTurfPage.css';

// const AddTurfPage = () => {
//   const navigate = useNavigate();
//   const [turfData, setTurfData] = useState({
//     name: '',
//     location: '',
//     price: '',
//     description: '',
//     sports: [],
//     amenities: '',
//     photo: null,
//   });

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;
//     if (type === 'file') {
//       setTurfData((prev) => ({ ...prev, [name]: files[0] }));
//     } else if (type === 'checkbox') {
//       setTurfData((prev) => {
//         const updatedSports = prev.sports.includes(value)
//           ? prev.sports.filter((sport) => sport !== value)
//           : [...prev.sports, value];
//         return { ...prev, sports: updatedSports };
//       });
//     } else {
//       setTurfData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     const formData = new FormData();

//     for (const key in turfData) {
//       if (key === 'sports') {
//         turfData.sports.forEach((sport) => formData.append('sports', sport));
//       } else if (key === 'amenities') {
//         turfData.amenities
//           .split(',')
//           .map((item) => item.trim())
//           .forEach((amenity) => formData.append('amenities', amenity));
//       } else {
//         formData.append(key, turfData[key]);
//       }
//     }

//     try {
//       await axios.post('http://localhost:5000/api/manager/add-turf', formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       navigate('/add-success');
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to add turf');
//     }
//   };

//   return (
//     <div className="add-turf-container">
//       <form onSubmit={handleSubmit} className="add-turf-form" encType="multipart/form-data">
//         <h2 className="form-title">Add New Turf</h2>

//         <input
//           type="text"
//           name="name"
//           placeholder="Turf Name"
//           required
//           onChange={handleChange}
//           className="form-input"
//         />
//         <input
//           type="text"
//           name="location"
//           placeholder="Location"
//           required
//           onChange={handleChange}
//           className="form-input"
//         />
//         <input
//           type="number"
//           name="price"
//           placeholder="Price"
//           required
//           onChange={handleChange}
//           className="form-input"
//         />
//         <textarea
//           name="description"
//           placeholder="Description"
//           required
//           onChange={handleChange}
//           className="form-textarea"
//         />

//         <label>Select Sports:</label>
//         <div className="checkbox-group">
//           {['Football', 'Cricket', 'Badminton', 'Tennis'].map((sport) => (
//             <label key={sport} className="checkbox-item">
//               <input
//                 type="checkbox"
//                 value={sport}
//                 onChange={handleChange}
//               />
//               {sport}
//             </label>
//           ))}
//         </div>

//         <textarea
//           name="amenities"
//           placeholder="Amenities (comma-separated)"
//           onChange={handleChange}
//           className="form-textarea"
//         />

//         <label>Upload Turf Photo:</label>
//         <input
//           type="file"
//           name="photo"
//           accept="image/*"
//           required
//           onChange={handleChange}
//           className="form-file-input"
//         />

//         <button type="submit" className="submit-button">
//           Add Turf
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddTurfPage;
















