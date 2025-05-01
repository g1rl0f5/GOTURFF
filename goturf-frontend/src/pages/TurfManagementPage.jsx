import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import './TurfManagementPage.css';

const TurfManagementPage = () => {
  const [turfs, setTurfs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        const response = await axios.get('http://localhost:5000/api/manager/my-turfs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTurfs(response.data);
      } catch (error) {
        console.error('Failed to fetch turfs:', error);
      }
    };

    fetchTurfs();
  }, []);

  return (
    <div className="turf-management-container">
      <h1 className="turf-page-title">📋 Your Turfs</h1>
      <div className="turf-grid">
        {turfs.map((turf) => (
          <div key={turf._id} className="turf-card">
            <h2 className="turf-name">{turf.name}</h2>
            <p><strong>📍 Location:</strong> {turf.location}</p>
            <p><strong>💰 Price:</strong> ₹{turf.price}</p>
            <p><strong>🏅 Sports:</strong> {turf.sports.join(', ')}</p>
            <p><strong>Status:</strong> {turf.isApproved ? '✅ Approved' : '⌛ Pending'}</p>
            {turf.photo && (
              <img
                src={`http://localhost:5000/uploads/${turf.photo}`}
                alt="Turf"
                className="turf-image"
              />
            )}
            <button
              onClick={() => navigate(`/manager/edit-turf/${turf._id}`)}
              className="edit-button"
            >
              ✏️ Edit Turf
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TurfManagementPage;












// // src/pages/TurfManagementPage.jsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';

// const TurfManagementPage = () => {
//   const [turfs, setTurfs] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchTurfs = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const decoded = jwtDecode(token);
//         const response = await axios.get('http://localhost:5000/api/manager/my-turfs', {
//           // http://localhost:5000/api/manager/my-turfs'
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log('Fetched turfs:', response.data); // Debug
//         setTurfs(response.data);
//       } catch (error) {
//         console.error('Failed to fetch turfs:', error);
//       }
//     };
  
//     fetchTurfs();
//   }, []);
  
//   return (
//     <div className="min-h-screen bg-white p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center">📋 Your Turfs</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {turfs.map(turf => (
//           <div key={turf._id} className="bg-gray-100 p-4 rounded-xl shadow-md">
//             <h2 className="text-xl font-semibold mb-2">{turf.name}</h2>
//             <p><strong>📍 Location:</strong> {turf.location}</p>
//             <p><strong>💰 Price:</strong> ₹{turf.price}</p>
//             <p><strong>🏅 Sports:</strong> {turf.sports.join(', ')}</p>
//             <p><strong>Status:</strong> {turf.isApproved ? '✅ Approved' : '⌛ Pending'}</p>
//             {turf.photo && (
//               <img
//                 src={`http://localhost:5000/uploads/${turf.photo}`}
//                 alt="Turf"
//                 className="w-full h-40 object-cover mt-3 rounded"
//               />
//             )}
//             <button
//               onClick={() => navigate(`/manager/edit-turf/${turf._id}`)}
//               className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
//             >
//               ✏️ Edit Turf
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TurfManagementPage;
