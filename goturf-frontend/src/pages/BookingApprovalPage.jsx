import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookingApprovalPage.css';

const BookingApprovalPage = () => {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('latest');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/manager/bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  const handleApproval = async (bookingId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/manager/bookings/${bookingId}/approve`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      setBookings(prev =>
        prev.map(booking =>
          booking._id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const filteredBookings = bookings
    .filter(booking => statusFilter === 'all' || booking.status === statusFilter)
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="booking-grid-container">
      <h1 className="booking-title">📋 Booking Requests</h1>

      {/* Filters */}
      <div className="filters-container">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="latest">Latest to Oldest</option>
          <option value="oldest">Oldest to Latest</option>
        </select>
      </div>

      {filteredBookings.length === 0 ? (
        <p className="no-bookings">No booking requests found.</p>
      ) : (
        <div className="booking-grid">
          {filteredBookings.map(booking => (
            <div key={booking._id} className="booking-card">
              <div className="card-header">
                <h3>{booking.turf?.name}</h3>
                <p>{booking.turf?.location}</p>
              </div>

              <div className="card-body">
                <p><strong>User:</strong> {booking.user?.name}</p>
                <p><strong>Email:</strong> {booking.user?.email}</p>
                <p><strong>Date:</strong> {booking.date}</p>
                <p><strong>Time Slot:</strong> {booking.timeSlot}</p>
                <p><strong>Sports:</strong> {booking.sports?.join(', ')}</p>
                <p><strong>Message:</strong> {booking.message || 'No message'}</p>
              </div>

              <div className="card-footer">
                <p className={`status ${booking.status}`}>
                  Status: {booking.status === 'approved' ? '✅ Approved' : booking.status === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
                </p>

                {booking.status === 'pending' && (
                  <div className="card-actions">
                    <button onClick={() => handleApproval(booking._id, 'approved')} className="approve-btn">
                      Approve
                    </button>
                    <button onClick={() => handleApproval(booking._id, 'rejected')} className="reject-btn">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingApprovalPage;









// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './BookingApprovalPage.css';

// const BookingApprovalPage = () => {
//   const [bookings, setBookings] = useState([]);

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get('http://localhost:5000/api/manager/bookings', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setBookings(res.data);
//       } catch (error) {
//         console.error('Error fetching bookings:', error);
//       }
//     };

//     fetchBookings();
//   }, []);

//   const handleApproval = async (bookingId, newStatus) => {
//     try {
//       await axios.put(
//         `http://localhost:5000/api/manager/bookings/${bookingId}/approve`,
//         {},
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );

//       setBookings(prev =>
//         prev.map(booking =>
//           booking._id === bookingId ? { ...booking, status: newStatus } : booking
//         )
//       );
//     } catch (error) {
//       console.error('Error updating booking status:', error);
//     }
//   };

//   return (
//     <div className="booking-grid-container">
//       <h1 className="booking-title">📋 Booking Requests</h1>

//       {bookings.length === 0 ? (
//         <p className="no-bookings">No booking requests yet.</p>
//       ) : (
//         <div className="booking-grid">
//           {bookings.map(booking => (
//             <div key={booking._id} className="booking-card">
//               <div className="card-header">
//                 <h3>{booking.turf?.name}</h3>
//                 <p>{booking.turf?.location}</p>
//               </div>

//               <div className="card-body">
//                 <p><strong>User:</strong> {booking.user?.name}</p>
//                 <p><strong>Email:</strong> {booking.user?.email}</p>
//                 <p><strong>Date:</strong> {booking.date}</p>
//                 <p><strong>Time Slot:</strong> {booking.timeSlot}</p>
//                 <p><strong>Sports:</strong> {booking.sports?.join(', ')}</p>
//                 <p><strong>Message:</strong> {booking.message || 'No message'}</p>
//               </div>

//               <div className="card-footer">
//                 <p className={`status ${booking.status}`}>
//                   Status: {booking.status === 'approved' ? '✅ Approved' : booking.status === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
//                 </p>

//                 {booking.status === 'pending' && (
//                   <div className="card-actions">
//                     <button onClick={() => handleApproval(booking._id, 'approved')} className="approve-btn">
//                       Approve
//                     </button>
//                     <button onClick={() => handleApproval(booking._id, 'rejected')} className="reject-btn">
//                       Reject
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookingApprovalPage;


















 // src/pages/BookingApprovalPage.jsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const BookingApprovalPage = () => {
//   const [bookings, setBookings] = useState([]);

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get('http://localhost:5000/api/manager/bookings', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setBookings(res.data);
//       } catch (error) {
//         console.error('Error fetching bookings:', error);
//       }
//     };

//     fetchBookings();
//   }, []);



//   const handleApproval = async (bookingId, newStatus) => {
//     try {
//       const res = await axios.put(
//         `http://localhost:5000/api/manager/bookings/${bookingId}/approve`,
//         {},
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );
  
//       // After approving, update the local state manually
//       setBookings(prevBookings =>
//         prevBookings.map(booking =>
//           booking._id === bookingId ? { ...booking, status: newStatus } : booking
//         )
//       );
//     } catch (error) {
//       console.error('Error updating booking status:', error);
//     }
//   };
 

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Booking Requests</h1>

//       {bookings.length === 0 ? (
//         <p>No booking requests yet.</p>
//       ) : (
//         bookings.map(booking => (
//           <div
//             key={booking._id}
//             className="border p-4 rounded mb-4 shadow-md bg-white"
//           >
//             <p><strong>User:</strong> {booking.user?.name}</p>
//             <p><strong>Email:</strong> {booking.user?.email}</p>
//             <p><strong>Turf:</strong> {booking.turf?.name}</p>
//             <p><strong>Location:</strong> {booking.turf?.location}</p>
//             <p><strong>Date:</strong> {booking.date}</p>
//             <p><strong>Time Slot:</strong> {booking.timeSlot}</p>
//             <p><strong>Sports:</strong> {booking.sports?.join(', ')}</p>
//             <p><strong>Message:</strong> {booking.message || 'No message'}</p>
//             <p><strong>Status:</strong> 
//               {booking.status === 'approved' ? '✅ Approved' : booking.status === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
//             </p>

//             {booking.status === 'pending' && (
//               <div className="mt-4 flex gap-2">
//                 <button
//                   onClick={() => handleApproval(booking._id, 'approved')}
//                   className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                 >
//                   Approve
//                 </button>
//                 <button
//                   onClick={() => handleApproval(booking._id, 'rejected')}
//                   className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//                 >
//                   Reject
//                 </button>
//               </div>
//             )}
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default BookingApprovalPage;


