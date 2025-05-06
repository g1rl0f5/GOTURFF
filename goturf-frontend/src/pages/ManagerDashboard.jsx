import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ManagerDashboard.css';

const BACKEND_URL = "https://goturff.onrender.com";


const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));
  const userName = user?.name || 'Manager';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BACKEND_URL}/api/manager/my-turfs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTurfs(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch turfs:', error.message);
        setLoading(false);
      }
    };

    fetchTurfs();
  }, []);

  return (
    <div className="manager-container">
      <header className="manager-header">
        <h1 className="dashboard-title">Welcome, {userName} 👋</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      <div className="manager-buttons">
        <button onClick={() => navigate('/add-turf')}>➕ Add New Turf</button>
        <button onClick={() => navigate('/manager/my-turfs')}>📋 Manage Your Turfs</button>
        <button onClick={() => navigate('/manager/bookings')}>📅 Booking Approvals</button>
        <button onClick={() => navigate('/manager/slots')}>🕒 Manage Slots</button>
      </div>

      <div>
        <h2 className="section-title">Your Turfs</h2>
        {loading ? (
          <p>Loading...</p>
        ) : turfs.length === 0 ? (
          <p>No turfs found.</p>
        ) : (
          <div className="turf-grid">
            {turfs.map((turf) => (
              <div key={turf._id} className="turf-card">
                <h3 className="turf-name">{turf.name}</h3>
                <p><strong>📍 Location:</strong> {turf.location}</p>
                <p><strong>💰 Price:</strong> ₹{turf.price}</p>
                <p><strong>🏅 Sports:</strong> {turf.sports.join(', ')}</p>
                <p><strong>Status:</strong> {turf.isApproved ? '✅ Approved' : '⌛ Pending Approval'}</p>
                {turf.photo && (
                  <img
                    src={`${BACKEND_URL}/uploads/${turf.photo}`}
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
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;



// // src/pages/ManagerDashboard.jsx
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './ManagerDashboard.css'; // link the CSS file

// const ManagerDashboard = () => {
//   const navigate = useNavigate();
//   const [turfs, setTurfs] = useState([]);
//   const [loading, setLoading] = useState(true);

 

//   useEffect(() => {
//     const fetchTurfs = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get('http://localhost:5000/api/manager/my-turfs', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setTurfs(res.data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Failed to fetch turfs:', error.message);
//         setLoading(false);
//       }
//     };

//     fetchTurfs();
//   }, []);

//   return (
//     <div className="manager-container">
//       <h1 className="dashboard-title">Welcome, Manager 👋</h1>
 
//       <div className="manager-buttons">
//         <button onClick={() => navigate('/add-turf')}>➕ Add New Turf</button>
//         <button onClick={() => navigate('/manager/my-turfs')}>📋 Manage Your Turfs</button>
//         <button onClick={() => navigate('/manager/bookings')}>📅 Booking Approvals</button>
//         <button onClick={() => navigate('/manager/slots')}>🕒 Manage Slots</button>
//       </div>

//       <div>
//         <h2 className="section-title">Your Turfs</h2>
//         {loading ? (
//           <p>Loading...</p>
//         ) : turfs.length === 0 ? (
//           <p>No turfs found.</p>
//         ) : (
//           <div className="turf-grid">
//             {turfs.map((turf) => (
//               <div key={turf._id} className="turf-card">
//                 <h3 className="turf-name">{turf.name}</h3>
//                 <p><strong>📍 Location:</strong> {turf.location}</p>
//                 <p><strong>💰 Price:</strong> ₹{turf.price}</p>
//                 <p><strong>🏅 Sports:</strong> {turf.sports.join(', ')}</p>
//                 <p><strong>Status:</strong> {turf.isApproved ? '✅ Approved' : '⌛ Pending Approval'}</p>
//                 {turf.photo && (
//                   <img
//                     src={`http://localhost:5000/uploads/${turf.photo}`}
//                     alt="Turf"
//                     className="turf-image"
//                   />
//                 )}
//                 <button
//                   onClick={() => navigate(`/manager/edit-turf/${turf._id}`)}
//                   className="edit-button"
//                 >
//                   ✏️ Edit Turf
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManagerDashboard;










