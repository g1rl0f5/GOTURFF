import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AllTurfsPage = () => {
  const [turfs, setTurfs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/turfs", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTurfs(res.data);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to load turfs");
      }
    };

    fetchTurfs();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/turf/${id}`);
  };

  if (turfs.length === 0) return <div className="p-10 text-center">Loading Turfs...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Turfs 🏟️</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {turfs.map((turf) => (
          <div
            key={turf._id}
            className="border rounded-lg overflow-hidden shadow-md bg-white"
          >
            <img
              src={`http://localhost:5000/uploads/${turf.photo}`}
              alt={turf.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{turf.name}</h2>
              <p className="text-gray-600 text-sm mb-2">📍 {turf.location}</p>
              <p className="text-gray-800 font-semibold">₹{turf.price}</p>
              <button
                onClick={() => handleViewDetails(turf._id)}
                className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
              >
                More Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllTurfsPage;
