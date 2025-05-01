import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./TurfDetailsPage.css";

const TurfDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [turf, setTurf] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: "",
    timeSlot: "",
    sports: [],
    message: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.name || "User";

  useEffect(() => {
    const fetchTurf = async () => {
      try {
        const token = localStorage.getItem("token");
        const turfRes = await axios.get(`http://localhost:5000/api/turfs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTurf(turfRes.data);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to fetch turf details");
      }
    };

    fetchTurf();
  }, [id]);

  const handleChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleSportChange = (sport) => {
    const newSelected = bookingData.sports.includes(sport)
      ? bookingData.sports.filter((s) => s !== sport)
      : [...bookingData.sports, sport];

    setBookingData({ ...bookingData, sports: newSelected });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/bookings/${turf._id}`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Booking request sent! Please wait for manager to confirm.");
      setShowBookingForm(false);
      setBookingData({ date: "", timeSlot: "", sports: [], message: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  if (!turf) return <div className="loading">Loading...</div>;

  return (
    <div className="details-container">
      <div className="header">
        <button onClick={() => navigate("/user/dashboard")} className="back-button">
          User Dashboard
        </button>
        <span className="welcome-text">Welcome, {userName}!</span>
      </div>

      <h1 className="turf-title">{turf.name}</h1>
      <img
        src={`http://localhost:5000/uploads/${turf.photo}`}
        alt={turf.name}
        className="turf-image"
      />

      <div className="details-card">
        <div className="field">
          <p className="field-label"><strong>📍 Location:</strong></p>
          <p className="field-value">{turf.location}</p>
        </div>

        <div className="field">
          <p className="field-label"><strong>💰 Price Hourly:</strong></p>
          <p className="field-value">₹{turf.price}</p>
        </div>

        <div className="field">
          <p className="field-label"><strong>📝 Description:</strong></p>
          <p className="field-value">{turf.description}</p>
        </div>

        <div className="field">
          <p className="field-label"><strong>⚽ Sports Available:</strong></p>
          <ul className="sports-list">
            {turf.sports?.length > 0 ? (
              turf.sports.map((sport) => <li key={sport}>{sport}</li>)
            ) : (
              <li>No sports listed</li>
            )}
          </ul>
        </div>

        <div className="field">
          <p className="field-label"><strong>🏟️ Amenities:</strong></p>
          <div className="amenities-inline">
            {Array.isArray(turf.amenities) && turf.amenities.length > 0 ? (
              turf.amenities.map((amenity, index) => (
                <span key={index} className="amenity-item">
                  {amenity}
                  {index !== turf.amenities.length - 1 && <span className="separator"> | </span>}
                </span>
              ))
            ) : (
              <span>No amenities listed</span>
            )}
          </div>
        </div>
      </div>

      <button onClick={() => setShowBookingForm(true)} className="book-button">
        Book Now
      </button>

      {showBookingForm && (
        <form onSubmit={handleBookingSubmit} className="booking-form">
          <div className="form-section">
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={bookingData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-section">
            <label>Time Slot:</label>
            <select
              name="timeSlot"
              value={bookingData.timeSlot}
              onChange={handleChange}
              required
            >
              <option value="">Select a time slot</option>
              {[
                "5-6 AM", "6-7 AM", "7-8 AM", "8-9 AM", "9-10 AM", "10-11 AM",
                "11-12 PM", "12-1 PM", "1-2 PM", "2-3 PM", "3-4 PM", "4-5 PM",
                "5-6 PM", "6-7 PM", "7-8 PM", "8-9 PM", "9-10 PM", "10-11 PM", "11-12 AM"
              ].map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          <div className="form-section">
            <p>Select Sports:</p>
            {turf.sports?.map((sport) => (
              <label key={sport}>
                <input
                  type="checkbox"
                  checked={bookingData.sports.includes(sport)}
                  onChange={() => handleSportChange(sport)}
                />
                {sport}
              </label>
            ))}
          </div>

          <div className="form-section">
            <label>Suggestions / Concerns:</label>
            <textarea
              name="message"
              value={bookingData.message}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <button type="submit" className="confirm-button">Confirm Booking</button>
        </form>
      )}
    </div>
  );
};

export default TurfDetailsPage;














// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./TurfDetailsPage.css";

// const TurfDetailsPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [turf, setTurf] = useState(null);
//   const [showBookingForm, setShowBookingForm] = useState(false);
//   const [bookingData, setBookingData] = useState({
//     date: "",
//     timeSlot: "",
//     sports: [],
//     message: "",
//   });

//   const user = JSON.parse(localStorage.getItem("user"));
//   const userName = user?.name || "User";

//   useEffect(() => {
//     const fetchTurf = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const turfRes = await axios.get(`http://localhost:5000/api/turfs/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setTurf(turfRes.data);
//       } catch (err) {
//         alert(err.response?.data?.message || "Failed to fetch turf details");
//       }
//     };

//     fetchTurf();
//   }, [id]);

//   const handleChange = (e) => {
//     setBookingData({ ...bookingData, [e.target.name]: e.target.value });
//   };

//   const handleSportChange = (sport) => {
//     const newSelected = bookingData.sports.includes(sport)
//       ? bookingData.sports.filter((s) => s !== sport)
//       : [...bookingData.sports, sport];

//     setBookingData({ ...bookingData, sports: newSelected });
//   };

//   const handleBookingSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         `http://localhost:5000/api/bookings/${turf._id}`,
//         bookingData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       alert("✅ Booking request sent! Please wait for manager to confirm.");
//       setShowBookingForm(false);
//       setBookingData({ date: "", timeSlot: "", sports: [], message: "" });
//     } catch (err) {
//       alert(err.response?.data?.message || "Booking failed");
//     }
//   };

//   if (!turf) return <div className="loading">Loading...</div>;

//   return (
//     <div className="details-container">
//       <div className="header">
//         <button onClick={() => navigate("/user/dashboard")} className="back-button">
//           User Dashboard
//         </button>
//         <span className="welcome-text">Welcome, {userName}!</span>
//       </div>

//       <h1 className="turf-title">{turf.name}</h1>
//       <img src={`http://localhost:5000/uploads/${turf.photo}`} alt={turf.name} className="turf-image" />
//       <p><strong>📍 Location:</strong> {turf.location}</p>
//       <p><strong>💰 Price:</strong> ₹{turf.price}</p>
//       <p><strong>📝 Description:</strong> {turf.description}</p>
//       <p><strong>⚽ Sports:</strong> {turf.sports?.join(', ') || 'N/A'}</p>
//       <p><strong>🏟️ Amenities:</strong> {turf.amenities || 'N/A'}</p>

//       <button onClick={() => setShowBookingForm(true)} className="book-button">
//         Book Now
//       </button>

//       {showBookingForm && (
//         <form onSubmit={handleBookingSubmit} className="booking-form">
//           <label>
//             Date:
//             <input type="date" name="date" value={bookingData.date} onChange={handleChange} required />
//           </label>

//           <label>
//             Time Slot:
//             <select name="timeSlot" value={bookingData.timeSlot} onChange={handleChange} required>
//               <option value="">Select a time slot</option>
//               {[
//                 "5-6 AM", "6-7 AM", "7-8 AM", "8-9 AM", "9-10 AM", "10-11 AM",
//                 "11-12 PM", "12-1 PM", "1-2 PM", "2-3 PM", "3-4 PM", "4-5 PM",
//                 "5-6 PM", "6-7 PM", "7-8 PM", "8-9 PM", "9-10 PM", "10-11 PM", "11-12 AM"
//               ].map(slot => (
//                 <option key={slot} value={slot}>{slot}</option>
//               ))}
//             </select>
//           </label>

//           <div className="sports-select">
//             <p>Select Sports:</p>
//             {turf.sports?.map((sport) => (
//               <label key={sport}>
//                 <input
//                   type="checkbox"
//                   checked={bookingData.sports.includes(sport)}
//                   onChange={() => handleSportChange(sport)}
//                 />
//                 {sport}
//               </label>
//             ))}
//           </div>

//           <label>
//             Suggestions / Concerns:
//             <textarea name="message" value={bookingData.message} onChange={handleChange} rows="4" />
//           </label>

//           <button type="submit" className="confirm-button">Confirm Booking</button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default TurfDetailsPage;











// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";

// const TurfDetailsPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [turf, setTurf] = useState(null);
//   const [showBookingForm, setShowBookingForm] = useState(false);
//   const [bookingData, setBookingData] = useState({
//     date: "",
//     timeSlot: "",
//     sports: [],
//     message: "",
//   });

//   // Retrieve user name from localStorage
//   const user = JSON.parse(localStorage.getItem("user"));
//   const userName = user?.name || "User";
//   const userRole = user?.role;

 

//   useEffect(() => {
//     const fetchTurf = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const turfRes = await axios.get(`http://localhost:5000/api/turfs/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setTurf(turfRes.data);
//       } catch (err) {
//         alert(err.response?.data?.message || "Failed to fetch turf details");
//       }
//     };

//     fetchTurf();
//   }, [id]);

//   const handleChange = (e) => {
//     setBookingData({ ...bookingData, [e.target.name]: e.target.value });
//   };

//   const handleSportChange = (sport) => {
//     const newSelected = bookingData.sports.includes(sport)
//       ? bookingData.sports.filter((s) => s !== sport)
//       : [...bookingData.sports, sport];

//     setBookingData({ ...bookingData, sports: newSelected });
//   };

//   const handleBookingSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         `http://localhost:5000/api/bookings/${turf._id}`,
//         {
//           date: bookingData.date,
//           timeSlot: bookingData.timeSlot,
//           sports: bookingData.sports,
//           message: bookingData.message,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       alert("✅ Booking request sent! Please wait for manager to confirm.");
//       setShowBookingForm(false);
//       setBookingData({ date: "", timeSlot: "", sports: [], message: "" });

//       // // Redirect to user dashboard
//       // navigate("/userdashboard");

//       <button
//       onClick={() => navigate('/user/dashboard')}
//       className="absolute top-4 left-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
//     >
//       🏠 Dashboard
//     </button>
    
 

//     } catch (err) {
//       alert(err.response?.data?.message || "Booking failed");
//     }
//   };

//   if (!turf) return <div className="p-10 text-center">Loading...</div>;

//   return (
//     <div className="p-10 max-w-3xl mx-auto text-gray-800">
//       {/* Static Header */}
//       <div className="flex justify-between items-center mb-6 bg-gray-200 p-4 rounded">
//         <button
//           onClick={() => navigate("/user/dashboard")}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           User Dashboard
//         </button>
//         <span className="text-lg font-semibold">Welcome, {userName}!</span>
//       </div>

//       <h1 className="text-3xl font-bold mb-2">{turf.name}</h1>
//       <img
//         src={`http://localhost:5000/uploads/${turf.photo}`}
//         alt={turf.name}
//         className="w-full max-w-xl mb-4 rounded-lg"
//       />
//       <p><strong>📍 Location:</strong> {turf.location}</p>
//       <p><strong>💰 Price:</strong> ₹{turf.price}</p>
//       <p><strong>📝 Description:</strong> {turf.description}</p>
//       <p><strong>⚽ Sports:</strong> {turf.sports?.join(', ') || 'N/A'}</p>
//       <p><strong>🏟️ Amenities:</strong> {turf.amenities || 'N/A'}</p>

//       <button
//         onClick={() => setShowBookingForm(true)}
//         className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//       >
//         Book Now
//       </button>

//       {showBookingForm && (
//         <form
//           onSubmit={handleBookingSubmit}
//           className="mt-6 bg-gray-100 p-4 rounded shadow-md"
//         >
//           <label className="block mb-2">
//             Date:
//             <input
//               type="date"
//               name="date"
//               value={bookingData.date}
//               onChange={handleChange}
//               className="w-full p-2 mt-1 rounded border"
//               required
//             />
//           </label>

//           <label className="block mb-2 mt-4">
//             Time Slot:
//             <select
//               name="timeSlot"
//               value={bookingData.timeSlot}
//               onChange={handleChange}
//               className="w-full p-2 mt-1 rounded border"
//               required
//             >
//               <option value="">Select a time slot</option>
//               {[
//                 "5-6 AM", "6-7 AM", "7-8 AM", "8-9 AM", "9-10 AM", "10-11 AM",
//                 "11-12 PM", "12-1 PM", "1-2 PM", "2-3 PM", "3-4 PM", "4-5 PM",
//                 "5-6 PM", "6-7 PM", "7-8 PM", "8-9 PM", "9-10 PM", "10-11 PM", "11-12 AM"
//               ].map(slot => (
//                 <option key={slot} value={slot}>{slot}</option>
//               ))}
//             </select>
//           </label>

//           <div className="mt-4">
//             <p className="font-semibold mb-1">Select Sports:</p>
//             {turf.sports?.map((sport) => (
//               <label key={sport} className="block">
//                 <input
//                   type="checkbox"
//                   checked={bookingData.sports.includes(sport)}
//                   onChange={() => handleSportChange(sport)}
//                   className="mr-2"
//                 />
//                 {sport}
//               </label>
//             ))}
//           </div>

//           <label className="block mt-4">
//             Suggestions / Concerns:
//             <textarea
//               name="message"
//               value={bookingData.message}
//               onChange={handleChange}
//               rows={4}
//               placeholder="Type here..."
//               className="w-full mt-1 p-2 border rounded"
//             />
//           </label>

//           <button
//             type="submit"
//             className="mt-4 px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
//           >
//             Confirm Booking
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };





// export default TurfDetailsPage;






















// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// const TurfDetailsPage = () => {
//   const { id } = useParams();
//   const [turf, setTurf] = useState(null);
//   const [showBookingForm, setShowBookingForm] = useState(false);
//   const [bookingData, setBookingData] = useState({
//     date: "",
//     timeSlot: "",
//     sports: [],
//     message: "",
//   });
//   const [existingBooking, setExistingBooking] = useState(null);

//   useEffect(() => {
//     const fetchTurf = async () => {
//       try {
//         const token = localStorage.getItem("token");
        
//         const turfRes = await axios.get(`http://localhost:5000/api/turfs/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setTurf(turfRes.data);

//         const bookingRes = await axios.get(`http://localhost:5000/api/bookings/mybookings`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const bookingForThisTurf = bookingRes.data.find(
//           (booking) => booking.turf._id === id
//         );

//         setExistingBooking(bookingForThisTurf || null);
//       } catch (err) {
//         alert(err.response?.data?.message || "Failed to fetch data");
//       }
//     };

//     fetchTurf();
//   }, [id]);

//   const handleChange = (e) => {
//     setBookingData({ ...bookingData, [e.target.name]: e.target.value });
//   };

//   const handleSportChange = (sport) => {
//     const newSelected = bookingData.sports.includes(sport)
//       ? bookingData.sports.filter((s) => s !== sport)
//       : [...bookingData.sports, sport];

//     setBookingData({ ...bookingData, sports: newSelected });
//   };

//   const handleBookingSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         `http://localhost:5000/api/bookings/${turf._id}`,
//         {
//           date: bookingData.date,
//           timeSlot: bookingData.timeSlot,
//           sports: bookingData.sports,
//           message: bookingData.message,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       alert("✅ Booking request sent! Please wait for the manager to confirm your booking.");
//       setShowBookingForm(false);
//       setBookingData({ date: "", timeSlot: "", sports: [], message: "" });
      
//       const refreshedBookings = await axios.get(`http://localhost:5000/api/bookings/mybookings`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const bookingForThisTurf = refreshedBookings.data.find(
//         (booking) => booking.turf._id === id
//       );
//       setExistingBooking(bookingForThisTurf || null);

//     } catch (err) {
//       alert(err.response?.data?.message || "Booking failed");
//     }
//   };

//   if (!turf) return <div className="p-10 text-center">Loading...</div>;

//   return (
//     <div className="p-10 max-w-3xl mx-auto text-gray-800">
//       <h1 className="text-3xl font-bold mb-2">{turf.name}</h1>
//       <img
//         src={`http://localhost:5000/uploads/${turf.photo}`}
//         alt={turf.name}
//         className="w-full max-w-xl mb-4 rounded-lg"
//       />
//       <p><strong>📍 Location:</strong> {turf.location}</p>
//       <p><strong>💰 Price:</strong> ₹{turf.price}</p>
//       <p><strong>📝 Description:</strong> {turf.description}</p>
//       <p><strong>⚽ Sports:</strong> {turf.sports?.join(', ') || 'N/A'}</p>
//       <p><strong>🏟️ Amenities:</strong> {turf.amenities || 'N/A'}</p>

//       <button
//         onClick={() => setShowBookingForm(true)}
//         className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//       >
//         Book Now
//       </button>

//       {showBookingForm && (
//         <form
//           onSubmit={handleBookingSubmit}
//           className="mt-6 bg-gray-100 p-4 rounded shadow-md"
//         >
//           <label className="block mb-2">
//             Date:
//             <input
//               type="date"
//               name="date"
//               value={bookingData.date}
//               onChange={handleChange}
//               className="w-full p-2 mt-1 rounded border"
//               required
//             />
//           </label>

//           <label className="block mb-2 mt-4">
//             Time Slot:
//             <select
//               name="timeSlot"
//               value={bookingData.timeSlot}
//               onChange={handleChange}
//               className="w-full p-2 mt-1 rounded border"
//               required
//             >
//               <option value="">Select a time slot</option>
//               {[
//                 "5-6 AM", "6-7 AM", "7-8 AM", "8-9 AM", "9-10 AM", "10-11 AM",
//                 "11-12 PM", "12-1 PM", "1-2 PM", "2-3 PM", "3-4 PM", "4-5 PM",
//                 "5-6 PM", "6-7 PM", "7-8 PM", "8-9 PM", "9-10 PM", "10-11 PM", "11-12 AM"
//               ].map(slot => (
//                 <option key={slot} value={slot}>{slot}</option>
//               ))}
//             </select>
//           </label>

//           <div className="mt-4">
//             <p className="font-semibold mb-1">Select Sports:</p>
//             {turf.sports?.map((sport) => (
//               <label key={sport} className="block">
//                 <input
//                   type="checkbox"
//                   checked={bookingData.sports.includes(sport)}
//                   onChange={() => handleSportChange(sport)}
//                   className="mr-2"
//                 />
//                 {sport}
//               </label>
//             ))}
//           </div>

//           <label className="block mt-4">
//             Suggestions / Concerns:
//             <textarea
//               name="message"
//               value={bookingData.message}
//               onChange={handleChange}
//               rows={4}
//               placeholder="Type here..."
//               className="w-full mt-1 p-2 border rounded"
//             />
//           </label>
       
//           <button
//             type="submit"
//             className="mt-4 px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
//           >
//             Confirm Booking
//           </button>

//           {existingBooking && (
//             <div className="mt-6 p-4 bg-white rounded shadow border text-center">
//               <p className="text-lg font-semibold mb-2">Your Booking Status:</p>
//               {existingBooking.status === "approved" && (
//                 <span className="text-green-600 font-bold">✅ Approved</span>
//               )}
//               {existingBooking.status === "waiting" && (
//                 <span className="text-yellow-600 font-bold">⏳ Waiting for Approval</span>
//               )}
//               {existingBooking.status === "rejected" && (
//                 <span className="text-red-600 font-bold">❌ Rejected</span>
//               )}
//             </div>
//           )}
//         </form>
//       )}
//     </div>
//   );
// };








