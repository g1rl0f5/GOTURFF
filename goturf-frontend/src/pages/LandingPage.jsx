import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const [turfs, setTurfs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    axios
      .get("http://localhost:5000/api/public/approved-turfs")
      .then((res) => setTurfs(res.data))
      .catch((err) => console.error("Error fetching turfs", err));
  }, []);

  const handleMoreDetails = (turfId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate(`/auth?redirect=/turfs/${turfId}`);
    } else {
      navigate(`/turfs/${turfId}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/auth");
  };

  return (
    <div className="landing-container">
      <nav className="navbar">
        <h1 className="logo">GoTurf</h1>
        {!isLoggedIn ? (
          <div className="auth-buttons">
            <button onClick={() => navigate("/auth")} className="btn">Login</button>
            <button onClick={() => navigate("/auth")} className="btn">Register</button>
          </div>
        ) : (
          <button onClick={handleLogout} className="btn">Logout</button>
        )}
      </nav>

      <section className="hero">
        <h2 className="hero-title">Book Your Turf Effortlessly</h2>
        <p className="hero-subtitle">Browse premium turfs near you. Sign in to get started!</p>
      </section>

      <section className="turfs-section">
        <h2 className="section-title">Available Turfs</h2>
        <div className="turfs-grid">
          {turfs.length === 0 ? (
            <p className="no-turfs">No turfs available right now.</p>
          ) : (
            turfs.map((turf) => (
              <div key={turf._id} className="turf-card">
                <img src={`http://localhost:5000/uploads/${turf.photo}`} alt={turf.name} className="turf-image" />
                <div className="card-content">
                  <h3 className="turf-name">{turf.name}</h3>
                  <p className="turf-location">{turf.location}</p>
                  <button onClick={() => handleMoreDetails(turf._id)} className="details-btn">More Details</button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div>
            <h2 className="footer-logo">GoTurf</h2>
            <p>Book your turf effortlessly anytime, anywhere.</p>
          </div>
          <div></div>
          <div>
            <h3 className="footer-contact-heading">Contact</h3>
            <p>Email: support@goturf.com</p>
            <p>Phone: +91 12345 67890</p>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} GoTurf. All rights reserved.
        </div>
      </footer>
    </div>
  );;
}




export default LandingPage;




// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const LandingPage = () => {
//   const navigate = useNavigate();
//   const [turfs, setTurfs] = useState([]);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     // Check if user is logged in by checking token
//     const token = localStorage.getItem("token");
//     setIsLoggedIn(!!token);

//     // Fetch all approved turfs
//     axios
//       .get("http://localhost:5000/api/public/approved-turfs")
//       .then((res) => {
//         setTurfs(res.data);
//       })
//       .catch((err) => console.error("Error fetching turfs", err));
//   }, []);

//   const handleMoreDetails = (turfId) => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       // If not logged in, redirect to login with intended page
//       navigate(`/auth?redirect=/turfs/${turfId}`);
//     } else {
//       // If logged in, go directly to details
//       navigate(`/turfs/${turfId}`);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setIsLoggedIn(false);
//     navigate("/auth"); // Redirect to login page after logout
//   };

//   return (
//     <div className="min-h-screen bg-white text-black">
//       {/* Navbar */}
//       <nav className="flex justify-between items-center px-8 py-4 shadow-md">
//         <h1 className="text-xl font-bold">GoTurf</h1>
//         <div className="space-x-4">
//           {isLoggedIn ? (
//             <button
//               onClick={handleLogout}
//               className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
//             >
//               Logout
//             </button>
//           ) : (
//             <>
//               <button
//                 onClick={() => navigate("/auth")}
//                 className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
//               >
//                 Login
//               </button>
//               <button
//                 onClick={() => navigate("/auth")}
//                 className="border border-black px-4 py-2 rounded hover:bg-black hover:text-white"
//               >
//                 Register
//               </button>
//             </>
//           )}
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <div className="p-10 text-center">
//         <h2 className="text-3xl font-semibold mb-4">Book Your Turf Effortlessly</h2>
//         <p className="text-gray-700">Explore available turf listings. Sign in to book now!</p>
//       </div>

//       {/* Turf Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
//         {turfs.map((turf) => (
//           <div key={turf._id} className="bg-white rounded-lg shadow-md overflow-hidden">
//             <img
//               src={`http://localhost:5000/uploads/${turf.photo}`}
//               alt={turf.name}
//               className="w-full h-48 object-cover"
//             />
//             <div className="p-4">
//               <h3 className="text-xl font-semibold">{turf.name}</h3>
//               <p className="text-gray-600 mb-2">{turf.location}</p>
//               <button
//                 onClick={() => handleMoreDetails(turf._id)}
//                 className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 More Details
//               </button>
//             </div>
//           </div>
//         ))}



  
//       </div>



// {/* Footer */}
// <footer className="bg-black text-white py-8 mt-8">
//   <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
//     {/* Brand */}
//     <div>
//       <h2 className="text-xl font-bold mb-2">GoTurf</h2>
//       <p className="text-gray-400">Book your turf effortlessly anytime, anywhere.</p>
//     </div>


//     {/* Contact */}
//     <div>
//       <h3 className="font-semibold mb-2">Contact</h3>
//       <p className="text-gray-400">Email: support@goturf.com</p>
//       <p className="text-gray-400">Phone: +91 12345 67890</p>
//     </div>
//   </div>

//   <div className="text-center text-gray-500 text-xs mt-6 border-t border-gray-800 pt-4">
//     &copy; {new Date().getFullYear()} GoTurf. All rights reserved.
//   </div>
// </footer>


//     </div>
//   );
// };

// export default LandingPage;



















// import React, { useEffect, useState } from "react";

// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const LandingPage = () => {
//   const navigate = useNavigate();
//   const [turfs, setTurfs] = useState([]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/public/approved-turfs")
//       .then((res) => {
//         setTurfs(res.data);
//       })
//       .catch((err) => console.error("Error fetching turfs", err));
//   }, []);

//   const handleMoreDetails = (turfId) => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       // ❗ If not logged in, redirect to login and include turfId in query
//       navigate(`/auth?redirect=/turfs/${turfId}`);
//     } else {
//       navigate(`/turfs/${turfId}`);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white text-black">
//       {/* Navbar */}
//       <nav className="flex justify-between items-center px-8 py-4 shadow-md">
//         <h1 className="text-xl font-bold">GoTurf</h1>
//         <div className="space-x-4">
//           <button
//             onClick={() => navigate("/auth")}
//             className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
//           >
//             Login
//           </button>
//           <button
//             onClick={() => navigate("/auth")}
//             className="border border-black px-4 py-2 rounded hover:bg-black hover:text-white"
//           >
//             Register
//           </button>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <div className="p-10 text-center">
//         <h2 className="text-3xl font-semibold mb-4">Book Your Turf Effortlessly</h2>
//         <p className="text-gray-700">Explore available turf listings. Sign in to book now!</p>
//       </div>

//       {/* Turf Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
//         {turfs.map((turf) => (
//           <div key={turf._id} className="bg-white rounded-lg shadow-md overflow-hidden">
//             <img
//               src={`http://localhost:5000/uploads/${turf.photo}`}
//               alt={turf.name}
//               className="w-full h-48 object-cover"
//             />
//             <div className="p-4">
//               <h3 className="text-xl font-semibold">{turf.name}</h3>
//               <p className="text-gray-600 mb-2">{turf.location}</p>
//               <button
//                 onClick={() => handleMoreDetails(turf._id)}
//                 className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 More Details
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };




// export default LandingPage;

