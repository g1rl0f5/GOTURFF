import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SlotManagementPage.css';

const SlotManagementPage = () => {
  const [slots, setSlots] = useState([]);
  const [time, setTime] = useState('');

  useEffect(() => {
    const fetchSlots = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/manager/slots', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlots(res.data);
    };
    fetchSlots();
  }, []);

  const handleAddSlot = async () => {
    if (!time.trim()) return;
    const token = localStorage.getItem('token');
    const res = await axios.post('http://localhost:5000/api/manager/slots', 
      { time }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSlots([...slots, res.data]);
    setTime('');
  };

  return (
    <div className="slot-page-container">
      <h1 className="slot-title">🕒 Slot Management</h1>

      <div className="slot-form">
        <input
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="Enter time (e.g., 4PM - 5PM)"
          className="slot-input"
        />
        <button onClick={handleAddSlot} className="slot-add-btn">Add Slot</button>
      </div>

      <div className="slot-list">
        {slots.length === 0 ? (
          <p className="no-slots">No slots added yet.</p>
        ) : (
          slots.map(slot => (
            <div key={slot._id} className="slot-card">
              {slot.time}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SlotManagementPage;


// // src/pages/SlotManagementPage.jsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const SlotManagementPage = () => {
//   const [slots, setSlots] = useState([]);
//   const [time, setTime] = useState('');

//   useEffect(() => {
//     const fetchSlots = async () => {
//       const token = localStorage.getItem('token');
//       const res = await axios.get('http://localhost:5000/api/manager/slots', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSlots(res.data);
//     };
//     fetchSlots();
//   }, []);

//   const handleAddSlot = async () => {
//     const token = localStorage.getItem('token');
//     const res = await axios.post('http://localhost:5000/api/manager/slots', 
//       { time }, 
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setSlots([...slots, res.data]);
//     setTime('');
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Slot Management</h1>
//       <div className="mb-4">
//         <input
//           type="text"
//           value={time}
//           onChange={(e) => setTime(e.target.value)}
//           placeholder="Enter time (e.g., 4PM - 5PM)"
//           className="border p-2 mr-2"
//         />
//         <button onClick={handleAddSlot} className="bg-blue-600 text-white px-4 py-2 rounded">Add Slot</button>
//       </div>
//       <ul>
//         {slots.map(slot => (
//           <li key={slot._id} className="mb-2 border p-2 rounded">{slot.time}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SlotManagementPage;
