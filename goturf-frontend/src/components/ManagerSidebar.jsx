import { Link, useNavigate } from "react-router-dom";

const ManagerSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // You can clear auth tokens from localStorage/sessionStorage here
    alert("Logged out successfully!");
    navigate("/auth");
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-6">🏟️ GOTURF</h1>
      <nav className="space-y-4">
        <Link to="/manager/dashboard" className="block hover:text-gray-300">📊 Dashboard</Link>
        <Link to="/add-turf" className="block hover:text-gray-300">➕ Add Turf</Link>
        <Link to="/manager/manage-turf" className="block hover:text-gray-300">📅 Manage Turfs</Link>
        <Link to="/manager/profile" className="block hover:text-gray-300">👤 Profile</Link>
        <button
          onClick={handleLogout}
          className="block mt-6 bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          🔒 Logout
        </button>
      </nav>
    </div>
  );
};

export default ManagerSidebar;
