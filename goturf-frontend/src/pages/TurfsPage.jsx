
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TurfsPage.css";

const TurfsPage = () => {
  const [turfs, setTurfs] = useState([]);
  const [filteredTurfs, setFilteredTurfs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sportFilter, setSportFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      navigate("/auth");
      return;
    }

    if (user.role === "manager") {
      alert("⚠️ Access Denied: Managers are not allowed to view this page.");
      navigate("/manager/dashboard");
      return;
    }

    const fetchTurfs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/turfs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTurfs(res.data);
        setFilteredTurfs(res.data);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to load turfs");
      }
    };

    fetchTurfs();
  }, [navigate]);

  useEffect(() => {
    let updatedTurfs = [...turfs];

    if (searchQuery) {
      updatedTurfs = updatedTurfs.filter(
        (turf) =>
          turf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          turf.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sportFilter) {
      updatedTurfs = updatedTurfs.filter(
        (turf) =>
          turf.sports &&
          turf.sports.some(
            (sport) => sport.toLowerCase() === sportFilter.toLowerCase()
          )
      );
    }
    
    if (sortOrder === "lowToHigh") {
      updatedTurfs.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
      updatedTurfs.sort((a, b) => b.price - a.price);
    }

    setFilteredTurfs(updatedTurfs);
  }, [searchQuery, sportFilter, sortOrder, turfs]);

  const handleTurfDetails = (id) => {
    navigate(`/turfs/${id}`);
  };

  return (
    <div className="turfs-page">
      <div className="turfs-container">
        <h1 className="turfs-heading">Explore Available Turfs 🏟️</h1>

        <div className="turfs-controls">
          <input
            type="text"
            placeholder="Search by turf name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />

          <select
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            className="filter-dropdown"
          >
            <option value="">All Sports</option>
            <option value="Football">Football</option>
            <option value="Cricket">Cricket</option>
            <option value="Badminton">Badminton</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-dropdown"
          >
            <option value="">Sort by Price</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>

        {filteredTurfs.length === 0 ? (
          <p className="no-turfs">No turfs found.</p>
        ) : (
          <div className="turfs-grid">
            {filteredTurfs.map((turf) => (
              <div
                key={turf._id}
                onClick={() => handleTurfDetails(turf._id)}
                className="turf-card"
              >
                <img
                  src={`http://localhost:5000/uploads/${turf.photo}`}
                  alt={turf.name}
                  className="turf-image"
                />
                <div className="turf-info">
                  <h2 className="turf-name">{turf.name}</h2>
                  <p className="turf-location">{turf.location}</p>
                  <p className="turf-price">₹{turf.price}</p>
                  <p className="turf-sport">{turf.sportType}</p>
                  <button
                    className="turf-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTurfDetails(turf._id);
                    }}
                  >
                    More Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TurfsPage;
















// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./TurfsPage.css"; // <-- make sure this CSS file exists

// const TurfsPage = () => {
//   const [turfs, setTurfs] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     const token = localStorage.getItem("token");

//     if (!user || !token) {
//       navigate("/auth");
//       return;
//     }

//     if (user.role === "manager") {
//       alert("⚠️ Access Denied: Managers are not allowed to view this page.");
//       navigate("/manager/dashboard");
//       return;
//     }

//     const fetchTurfs = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/turfs", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setTurfs(res.data);
//       } catch (err) {
//         alert(err.response?.data?.message || "Failed to load turfs");
//       }
//     };

//     fetchTurfs();
//   }, [navigate]);

//   const handleTurfDetails = (id) => {
//     navigate(`/turfs/${id}`);
//   };

//   return (
//     <div className="turfs-page">
//       <div className="turfs-container">
//         <h1 className="turfs-heading">Explore Available Turfs 🏟️</h1>

//         {turfs.length === 0 ? (
//           <p className="no-turfs">No turfs available yet.</p>
//         ) : (
//           <div className="turfs-grid">
//             {turfs.map((turf) => (
//               <div
//                 key={turf._id}
//                 onClick={() => handleTurfDetails(turf._id)}
//                 className="turf-card"
//               >
//                 <img
//                   src={`http://localhost:5000/uploads/${turf.photo}`}
//                   alt={turf.name}
//                   className="turf-image"
//                 />
//                 <div className="turf-info">
//                   <h2 className="turf-name">{turf.name}</h2>
//                   <p className="turf-location">{turf.location}</p>
//                   <p className="turf-price">₹{turf.price}</p>
//                   <button
//                     className="turf-button"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleTurfDetails(turf._id);
//                     }}
//                   >
//                     More Details
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TurfsPage;





// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const TurfsPage = () => {
//   const [turfs, setTurfs] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     const token = localStorage.getItem("token");

//     if (!user || !token) {
//       navigate("/auth");
//       return;
//     }

//     if (user.role === "manager") {
//       alert("⚠️ Access Denied: Managers are not allowed to view this page.");
//       navigate("/manager/dashboard");
//       return;
//     }

//     const fetchTurfs = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/turfs", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setTurfs(res.data);
//       } catch (err) {
//         alert(err.response?.data?.message || "Failed to load turfs");
//       }
//     };

//     fetchTurfs();
//   }, [navigate]);

//   const handleTurfDetails = (id) => {
//     navigate(`/turfs/${id}`);
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen py-12">
//       <div className="max-w-6xl mx-auto px-4">
//         <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
//           Explore Available Turfs 🏟️
//         </h1>

//         {turfs.length === 0 ? (
//           <p className="text-center text-gray-500">No turfs available yet.</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//             {turfs.map((turf) => (
//               <div
//                 key={turf._id}
//                 onClick={() => handleTurfDetails(turf._id)}
//                 className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-transform duration-200 cursor-pointer transform hover:scale-105"
//               >
//                 <img
//                   src={`http://localhost:5000/uploads/${turf.photo}`}
//                   alt={turf.name}
//                   className="w-full h-44 object-cover"
//                 />
//                 <div className="p-5">
//                   <h2 className="text-xl font-semibold text-gray-800">{turf.name}</h2>
//                   <p className="text-gray-600 text-sm mt-1">{turf.location}</p>
//                   <p className="text-emerald-600 font-bold text-lg mt-2">₹{turf.price}</p>
//                   <button
//                     className="mt-5 w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleTurfDetails(turf._id);
//                     }}
//                   >
//                     More Details
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };


// export default TurfsPage;



// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const TurfsPage = () => {
//   const [turfs, setTurfs] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     const token = localStorage.getItem("token");

//     // 🛑 If no user or token, redirect to login/auth page
//     if (!user || !token) {
//       navigate("/auth");
//       return;
//     }

//     // 🛑 If user is a manager, redirect to manager dashboard
//     if (user.role === "manager") {
//       alert("⚠️ Access Denied: Managers are not allowed to view this page.");
//       navigate("/manager/dashboard");
//       return;
//     }

//     // ✅ Otherwise, fetch turfs
//     const fetchTurfs = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/turfs", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setTurfs(res.data);
//       } catch (err) {
//         alert(err.response?.data?.message || "Failed to load turfs");
//       }
//     };

//     fetchTurfs();
//   }, [navigate]);

//   const handleTurfDetails = (id) => {
//     navigate(`/turfs/${id}`); // Navigate to TurfDetailsPage
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6">Available Turfs 🏟️</h1>

//       {turfs.length === 0 ? (
//         <p>No turfs available yet.</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {turfs.map((turf) => (
//             <div
//               key={turf._id}
//               className="border p-4 rounded-lg shadow hover:shadow-md cursor-pointer bg-white"
//               onClick={() => handleTurfDetails(turf._id)}
//             >
//               <img
//                 src={`http://localhost:5000/uploads/${turf.photo}`}
//                 alt={turf.name}
//                 className="h-48 w-full object-cover rounded mb-3"
//               />
//               <h2 className="text-xl font-bold">{turf.name}</h2>
//               <p className="text-gray-600">{turf.location}</p>
//               <p className="text-green-600 font-semibold mt-2">₹{turf.price}</p>

//               <button
//                 className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleTurfDetails(turf._id);
//                 }}
//               >
//                 More Details
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TurfsPage;














