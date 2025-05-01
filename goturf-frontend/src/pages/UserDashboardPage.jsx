import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './UserDashboardPage.css';

const UserDashboardPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("latest");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const handleBrowseTurfs = () => {
    navigate("/turfs");
  };

  const handleProceedPayment = (bookingId) => {
    navigate(`/payment/${bookingId}`);
  };

  const handleViewDetails = (turfId) => {
    navigate(`/turfs/${turfId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const getFilteredAndSortedBookings = () => {
    let filtered = [...bookings];
    if (statusFilter !== "all") {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }
    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date);
      const dateB = new Date(b.createdAt || b.date);
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });
  };

  const filteredBookings = getFilteredAndSortedBookings();

  if (loading) return <div className="loading-message">Loading your dashboard...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to Your Dashboard 👋</h1>
        <div className="header-actions">
          <button onClick={handleBrowseTurfs} className="primary-button">Browse Turfs</button>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>

      <div className="bookings-section">
        <div className="bookings-header">
          <h2>Your Bookings 📋</h2>
          <div className="filter-sort-controls">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <p className="no-bookings-message">No bookings match the selected filter.</p>
        ) : (
          <div className="booking-cards">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-info">
                  <p><strong>Turf:</strong> {booking.turf ? booking.turf.name : "Turf Deleted"}</p>
                  <p><strong>Date:</strong> {booking.date}</p>
                  <p><strong>Time Slot:</strong> {booking.timeSlot}</p>
                  <p><strong>Status:</strong> {booking.status}</p>
                </div>
                <div className="booking-actions">
                  {booking.turf && (
                    <button onClick={() => handleViewDetails(booking.turf._id)} className="action-button blue">
                      View Turf Details
                    </button>
                  )}
                  {booking.status === "approved" && (
                    <button onClick={() => handleProceedPayment(booking._id)} className="action-button green">
                      Proceed to Payment
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboardPage;






// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import './UserDashboardPage.css';

// const UserDashboardPage = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sortOrder, setSortOrder] = useState("latest");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [theme, setTheme] = useState("light"); // New state
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           navigate("/login");
//           return;
//         }

//         const res = await axios.get("http://localhost:5000/api/bookings", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setBookings(res.data);
//       } catch (err) {
//         console.error(err);
//         setError(err.response?.data?.message || "Failed to load bookings");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, [navigate]);

//   const handleBrowseTurfs = () => {
//     navigate("/turfs");
//   };

//   const handleProceedPayment = (bookingId) => {
//     navigate(`/payment/${bookingId}`);
//   };

//   const handleViewDetails = (turfId) => {
//     navigate(`/turfs/${turfId}`);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   const toggleTheme = () => {
//     setTheme(prev => (prev === "light" ? "dark" : "light"));
//   };

//   const getFilteredAndSortedBookings = () => {
//     let filtered = [...bookings];
//     if (statusFilter !== "all") {
//       filtered = filtered.filter((b) => b.status === statusFilter);
//     }
//     return filtered.sort((a, b) => {
//       const dateA = new Date(a.createdAt || a.date);
//       const dateB = new Date(b.createdAt || b.date);
//       return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
//     });
//   };

//   const filteredBookings = getFilteredAndSortedBookings();

//   if (loading) return <div className="loading-message">Loading your dashboard...</div>;
//   if (error) return <div className="error-message">{error}</div>;

//   return (
//     <div className={`dashboard-container ${theme}`}>
//       <div className="dashboard-header">
//         <h1>Welcome to Your Dashboard 👋</h1>
//         <div className="header-actions">
//           <button onClick={handleBrowseTurfs} className="primary-button">Browse Turfs</button>
//           <button onClick={toggleTheme} className="theme-button">
//             {theme === "light" ? "🌙 Dark" : "☀️ Light"}
//           </button>
//           <button onClick={handleLogout} className="logout-button">Logout</button>
//         </div>
//       </div>

//       <div className="bookings-section">
//         <div className="bookings-header">
//           <h2>Your Bookings 📋</h2>
//           <div className="filter-sort-controls">
//             <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
//               <option value="all">All Statuses</option>
//               <option value="approved">Approved</option>
//               <option value="pending">Pending</option>
//               <option value="rejected">Rejected</option>
//             </select>
//             <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
//               <option value="latest">Latest First</option>
//               <option value="oldest">Oldest First</option>
//             </select>
//           </div>
//         </div>

//         {filteredBookings.length === 0 ? (
//           <p className="no-bookings-message">No bookings match the selected filter.</p>
//         ) : (
//           <div className="booking-cards">
//             {filteredBookings.map((booking) => (
//               <div key={booking._id} className="booking-card">
//                 <div className="booking-info">
//                   <p><strong>Turf:</strong> {booking.turf ? booking.turf.name : "Turf Deleted"}</p>
//                   <p><strong>Date:</strong> {booking.date}</p>
//                   <p><strong>Time Slot:</strong> {booking.timeSlot}</p>
//                   <p><strong>Status:</strong> {booking.status}</p>
//                 </div>
//                 <div className="booking-actions">
//                   {booking.turf && (
//                     <button onClick={() => handleViewDetails(booking.turf._id)} className="action-button blue">
//                       View Turf Details
//                     </button>
//                   )}
//                   {booking.status === "approved" && (
//                     <button onClick={() => handleProceedPayment(booking._id)} className="action-button green">
//                       Proceed to Payment
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserDashboardPage;






















// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import './UserDashboardPage.css'; // <-- make sure this file exists

// const UserDashboardPage = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sortOrder, setSortOrder] = useState("latest");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           navigate("/login");
//           return;
//         }

//         const res = await axios.get("http://localhost:5000/api/bookings", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setBookings(res.data);
//       } catch (err) {
//         console.error(err);
//         setError(err.response?.data?.message || "Failed to load bookings");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, [navigate]);

//   const handleBrowseTurfs = () => {
//     navigate("/turfs");
//   };

//   const handleProceedPayment = (bookingId) => {
//     navigate(`/payment/${bookingId}`);
//   };

//   const handleViewDetails = (turfId) => {
//     navigate(`/turfs/${turfId}`);
//   };

//   const getFilteredAndSortedBookings = () => {
//     let filtered = [...bookings];
//     if (statusFilter !== "all") {
//       filtered = filtered.filter((b) => b.status === statusFilter);
//     }

//     return filtered.sort((a, b) => {
//       const dateA = new Date(a.createdAt || a.date);
//       const dateB = new Date(b.createdAt || b.date);
//       return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
//     });
//   };

//   const filteredBookings = getFilteredAndSortedBookings();

//   if (loading) return <div className="loading-message">Loading your dashboard...</div>;
//   if (error) return <div className="error-message">{error}</div>;

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-header">
//         <h1>Welcome to Your Dashboard 👋</h1>
//         <h2>Want to book another Turf? 🏟️</h2>
//         <button onClick={handleBrowseTurfs} className="primary-button">Browse Turfs</button>
//       </div>

//       <div className="bookings-section">
//         <div className="bookings-header">
//           <h2>Your Bookings 📋</h2>
//           <div className="filter-sort-controls">
//             <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
//               <option value="all">All Statuses</option>
//               <option value="approved">Approved</option>
//               <option value="pending">Pending</option>
//               <option value="rejected">Rejected</option>
//             </select>
//             <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
//               <option value="latest">Latest First</option>
//               <option value="oldest">Oldest First</option>
//             </select>
//           </div>
//         </div>

//         {filteredBookings.length === 0 ? (
//           <p className="no-bookings-message">No bookings match the selected filter.</p>
//         ) : (
//           <div className="booking-cards">
//             {filteredBookings.map((booking) => (
//               <div key={booking._id} className="booking-card">
//                 <div className="booking-info">
//                   <p><strong>Turf:</strong> {booking.turf ? booking.turf.name : "Turf Deleted"}</p>
//                   <p><strong>Date:</strong> {booking.date}</p>
//                   <p><strong>Time Slot:</strong> {booking.timeSlot}</p>
//                   <p><strong>Status:</strong> {booking.status}</p>
//                 </div>
//                 <div className="booking-actions">
//                   {booking.turf && (
//                     <button onClick={() => handleViewDetails(booking.turf._id)} className="action-button blue">
//                       View Turf Details
//                     </button>
//                   )}
//                   {booking.status === "approved" && (
//                     <button onClick={() => handleProceedPayment(booking._id)} className="action-button green">
//                       Proceed to Payment
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserDashboardPage;













// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const UserDashboardPage = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sortOrder, setSortOrder] = useState("latest");
//   const [statusFilter, setStatusFilter] = useState("all"); // new filter
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           navigate("/login");
//           return;
//         }

//         const res = await axios.get("http://localhost:5000/api/bookings", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setBookings(res.data);
//       } catch (err) {
//         console.error(err);
//         setError(err.response?.data?.message || "Failed to load bookings");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, [navigate]);

//   const handleBrowseTurfs = () => {
//     navigate("/turfs");
//   };

//   const handleProceedPayment = (bookingId) => {
//     navigate(`/payment/${bookingId}`);
//   };

//   const handleViewDetails = (turfId) => {
//     navigate(`/turfs/${turfId}`);
//   };

//   // Filter and sort bookings
//   const getFilteredAndSortedBookings = () => {
//     let filtered = [...bookings];
//     if (statusFilter !== "all") {
//       filtered = filtered.filter((b) => b.status === statusFilter);
//     }

//     return filtered.sort((a, b) => {
//       const dateA = new Date(a.createdAt || a.date);
//       const dateB = new Date(b.createdAt || b.date);
//       return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
//     });
//   };

//   const filteredBookings = getFilteredAndSortedBookings();

//   if (loading) {
//     return <div className="p-6 text-center text-lg">Loading your dashboard...</div>;
//   }

//   if (error) {
//     return <div className="p-6 text-center text-red-600">{error}</div>;
//   }

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       {/* Browse Turfs Section */}
//       <div className="text-center mb-10">
//         <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard 👋</h1>
//         <h2 className="text-2xl font-semibold mb-4">Want to book another Turf? 🏟️</h2>
//         <button
//           onClick={handleBrowseTurfs}
//           className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
//         >
//           Browse Turfs
//         </button>
//       </div>

//       {/* Bookings Section */}
//       <div>
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//           <h2 className="text-2xl font-semibold">Your Bookings 📋</h2>

//           <div className="flex gap-4">
//             {/* Status Filter */}
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="border border-gray-300 rounded px-3 py-2"
//             >
//               <option value="all">All Statuses</option>
//               <option value="approved">Approved</option>
//               <option value="pending">Pending</option>
//               <option value="rejected">Rejected</option>
//             </select>

//             {/* Sort Order */}
//             <select
//               value={sortOrder}
//               onChange={(e) => setSortOrder(e.target.value)}
//               className="border border-gray-300 rounded px-3 py-2"
//             >
//               <option value="latest">Latest First</option>
//               <option value="oldest">Oldest First</option>
//             </select>
//           </div>
//         </div>

//         {filteredBookings.length === 0 ? (
//           <p>No bookings match the selected filter.</p>
//         ) : (
//           <div className="space-y-4">
//             {filteredBookings.map((booking) => (
//               <div
//                 key={booking._id}
//                 className="border p-4 rounded-lg shadow-sm bg-white flex justify-between items-center"
//               >
//                 {/* Left: Booking Info */}
//                 <div>
//                   <p><strong>Turf:</strong> {booking.turf ? booking.turf.name : "Turf Deleted"}</p>
//                   <p><strong>Date:</strong> {booking.date}</p>
//                   <p><strong>Time Slot:</strong> {booking.timeSlot}</p>
//                   <p><strong>Status:</strong> {booking.status}</p>
//                 </div>

//                 {/* Right: Buttons */}
//                 <div className="flex flex-col gap-2">
//                   {booking.turf && (
//                     <button
//                       onClick={() => handleViewDetails(booking.turf._id)}
//                       className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                     >
//                       View Turf Details
//                     </button>
//                   )}
//                   {booking.status === "approved" && (
//                     <button
//                       onClick={() => handleProceedPayment(booking._id)}
//                       className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                     >
//                       Proceed to Payment
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserDashboardPage;





















// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const UserDashboardPage = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sortOrder, setSortOrder] = useState("latest"); // latest by default
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           navigate("/login");
//           return;
//         }

//         const res = await axios.get("http://localhost:5000/api/bookings", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setBookings(res.data);
//       } catch (err) {
//         console.error(err);
//         setError(err.response?.data?.message || "Failed to load bookings");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, [navigate]);

//   const handleBrowseTurfs = () => {
//     navigate("/turfs");
//   };

//   const handleProceedPayment = (bookingId) => {
//     navigate(`/payment/${bookingId}`);
//   };

//   const handleViewDetails = (turfId) => {
//     navigate(`/turfs/${turfId}`);
//   };

//   // 📜 Sort bookings based on sortOrder
//   const getSortedBookings = () => {
//     const sorted = [...bookings].sort((a, b) => {
//       const dateA = new Date(a.createdAt || a.date);  // fallback to date if no createdAt
//       const dateB = new Date(b.createdAt || b.date);
//       return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
//     });
//     return sorted;
//   };

//   const sortedBookings = getSortedBookings();

//   // 🔵 Loading
//   if (loading) {
//     return <div className="p-6 text-center text-lg">Loading your dashboard...</div>;
//   }

//   // 🔴 Error
//   if (error) {
//     return <div className="p-6 text-center text-red-600">{error}</div>;
//   }

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       {/* Browse Turfs Section */}
//       <div className="text-center mb-10">
//         <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard 👋</h1>
//         <h2 className="text-2xl font-semibold mb-4">Want to book another Turf? 🏟️</h2>
//         <button
//           onClick={handleBrowseTurfs}
//           className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
//         >
//           Browse Turfs
//         </button>
//       </div>

//       {/* Bookings Section */}
//       <div>
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-semibold">Your Bookings 📋</h2>

//           {/* Sorting Filter */}
//           <select
//             value={sortOrder}
//             onChange={(e) => setSortOrder(e.target.value)}
//             className="border border-gray-300 rounded px-3 py-2"
//           >
//             <option value="latest">Latest First</option>
//             <option value="oldest">Oldest First</option>
//           </select>
//         </div>

//         {sortedBookings.length === 0 ? (
//           <p>No bookings yet.</p>
//         ) : (
//           <div className="space-y-4">
//             {sortedBookings.map((booking) => (
//               <div
//                 key={booking._id}
//                 className="border p-4 rounded-lg shadow-sm bg-white flex justify-between items-center"
//               >
//                 {/* Left: Booking Info */}
//                 <div>
//                   <p><strong>Turf:</strong> {booking.turf ? booking.turf.name : "Turf Deleted"}</p>
//                   <p><strong>Date:</strong> {booking.date}</p>
//                   <p><strong>Time Slot:</strong> {booking.timeSlot}</p>
//                   <p><strong>Status:</strong> {booking.status}</p>
//                 </div>

//                 {/* Right: Buttons */}
//                 <div className="flex flex-col gap-2">
//                   {booking.turf && (
//                     <button
//                       onClick={() => handleViewDetails(booking.turf._id)}
//                       className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                     >
//                       View Turf Details
//                     </button>
//                   )}
//                   {booking.status === "approved" && (
//                     <button
//                       onClick={() => handleProceedPayment(booking._id)}
//                       className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                     >
//                       Proceed to Payment
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };



// export default UserDashboardPage;




