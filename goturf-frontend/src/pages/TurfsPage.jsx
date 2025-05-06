
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TurfsPage.css";

const BACKEND_URL = "https://goturff.onrender.com";


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

    // Fetch turfs from the updated backend URL
    const fetchTurfs = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/turfs`, {
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
                  src={`${BACKEND_URL}/uploads/${turf.photo}`}
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
// import "./TurfsPage.css";

// const TurfsPage = () => {
//   const [turfs, setTurfs] = useState([]);
//   const [filteredTurfs, setFilteredTurfs] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sportFilter, setSportFilter] = useState("");
//   const [sortOrder, setSortOrder] = useState("");

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
//         setFilteredTurfs(res.data);
//       } catch (err) {
//         alert(err.response?.data?.message || "Failed to load turfs");
//       }
//     };

//     fetchTurfs();
//   }, [navigate]);

//   useEffect(() => {
//     let updatedTurfs = [...turfs];

//     if (searchQuery) {
//       updatedTurfs = updatedTurfs.filter(
//         (turf) =>
//           turf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           turf.location.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     if (sportFilter) {
//       updatedTurfs = updatedTurfs.filter(
//         (turf) =>
//           turf.sports &&
//           turf.sports.some(
//             (sport) => sport.toLowerCase() === sportFilter.toLowerCase()
//           )
//       );
//     }
    
//     if (sortOrder === "lowToHigh") {
//       updatedTurfs.sort((a, b) => a.price - b.price);
//     } else if (sortOrder === "highToLow") {
//       updatedTurfs.sort((a, b) => b.price - a.price);
//     }

//     setFilteredTurfs(updatedTurfs);
//   }, [searchQuery, sportFilter, sortOrder, turfs]);

//   const handleTurfDetails = (id) => {
//     navigate(`/turfs/${id}`);
//   };

//   return (
//     <div className="turfs-page">
//       <div className="turfs-container">
//         <h1 className="turfs-heading">Explore Available Turfs 🏟️</h1>

//         <div className="turfs-controls">
//           <input
//             type="text"
//             placeholder="Search by turf name or location..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="search-bar"
//           />

//           <select
//             value={sportFilter}
//             onChange={(e) => setSportFilter(e.target.value)}
//             className="filter-dropdown"
//           >
//             <option value="">All Sports</option>
//             <option value="Football">Football</option>
//             <option value="Cricket">Cricket</option>
//             <option value="Badminton">Badminton</option>
//           </select>

//           <select
//             value={sortOrder}
//             onChange={(e) => setSortOrder(e.target.value)}
//             className="sort-dropdown"
//           >
//             <option value="">Sort by Price</option>
//             <option value="lowToHigh">Price: Low to High</option>
//             <option value="highToLow">Price: High to Low</option>
//           </select>
//         </div>

//         {filteredTurfs.length === 0 ? (
//           <p className="no-turfs">No turfs found.</p>
//         ) : (
//           <div className="turfs-grid">
//             {filteredTurfs.map((turf) => (
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
//                   <p className="turf-sport">{turf.sportType}</p>
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



