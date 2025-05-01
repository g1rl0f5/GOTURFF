import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboardPage.css'; // Your existing CSS file

const AdminDashboardPage = () => {
  const [pendingTurfs, setPendingTurfs] = useState([]);
  const [users, setUsers] = useState([]);
  const [allTurfs, setAllTurfs] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [searchTurf, setSearchTurf] = useState('');
  const token = localStorage.getItem('token');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pendingRes, usersRes, allTurfsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/pending-turfs', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/admin/all-users', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/admin/all-turfs', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setPendingTurfs(pendingRes.data);
        setUsers(usersRes.data);
        setAllTurfs(allTurfsRes.data);
      } catch (err) {
        console.error('Error fetching admin data', err);
      }
    };

    fetchData();
  }, [token]);

  const approveTurf = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/admin/approve-turf/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingTurfs(prev => prev.filter(turf => turf._id !== id));
    } catch (err) {
      console.error('Failed to approve turf', err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/delete-user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(prev => prev.filter(user => user._id !== id));
    } catch (err) {
      console.error('Failed to delete user', err);
    }
  };

  const deleteTurf = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/delete-turf/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllTurfs(prev => prev.filter(turf => turf._id !== id));
    } catch (err) {
      console.error('Failed to delete turf', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  // ✅ Filtered lists with safe checks
  const filteredUsers = users.filter(user =>
    (user.name || '').toLowerCase().includes(searchUser.toLowerCase())
  );
  
  const filteredTurfs = allTurfs.filter(turf =>
    (turf.name || '').toLowerCase().includes(searchTurf.toLowerCase())
  );

  const filteredPendingTurfs = pendingTurfs.filter(turf =>
    (turf.name || '').toLowerCase().includes(searchTurf.toLowerCase())
  );

  // Sort function for table headers
  const sortHandler = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredPendingTurfs].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setPendingTurfs(sortedData);
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>👮 Admin Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <section className="pending-section">
        <h2>🟢 Pending Turf Approvals</h2>
        {filteredPendingTurfs.length === 0 ? (
          <p>No turfs to approve.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th onClick={() => sortHandler('name')}>Name</th>
                <th onClick={() => sortHandler('location')}>Location</th>
                <th onClick={() => sortHandler('manager')}>Created By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPendingTurfs.map(turf => (
                <tr key={turf._id}>
                  <td>{turf.name}</td>
                  <td>{turf.location}</td>
                  <td>{turf.manager && turf.manager.name ? turf.manager.name : 'N/A'}</td>
                  <td>
                    <button onClick={() => approveTurf(turf._id)}>Approve</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="split-section">
        <div className="half-section">
          <h2>👥 User Management</h2>
          <input
            type="text"
            placeholder="Search users..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="filter-input"
          />
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => deleteUser(user._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="half-section">
          <h2>⚽ All Turfs</h2>
          <input
            type="text"
            placeholder="Search turfs..."
            value={searchTurf}
            onChange={(e) => setSearchTurf(e.target.value)}
            className="filter-input"
          />
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Created By</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTurfs.map(turf => (
                <tr key={turf._id}>
                  <td>{turf.name}</td>
                  <td>{turf.location}</td>
                  <td>{turf.manager?.name || 'N/A'}</td>
                  <td>{turf.isApproved ? '✅ Approved' : '⏳ Pending'}</td>
                  <td>
                    <button onClick={() => deleteTurf(turf._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};


export default AdminDashboardPage;












// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './AdminDashboardPage.css'; // Your existing CSS file

// const AdminDashboardPage = () => {
//   const [pendingTurfs, setPendingTurfs] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [allTurfs, setAllTurfs] = useState([]);
//   const [searchUser, setSearchUser] = useState('');
//   const [searchTurf, setSearchTurf] = useState('');
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [pendingRes, usersRes, allTurfsRes] = await Promise.all([
//           axios.get('http://localhost:5000/api/admin/pending-turfs', {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get('http://localhost:5000/api/admin/all-users', {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get('http://localhost:5000/api/admin/all-turfs', {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         setPendingTurfs(pendingRes.data);
//         setUsers(usersRes.data);
//         setAllTurfs(allTurfsRes.data);
//       } catch (err) {
//         console.error('Error fetching admin data', err);
//       }
//     };

//     fetchData();
//   }, [token]);

//   const approveTurf = async (id) => {
//     try {
//       await axios.patch(`http://localhost:5000/api/admin/approve-turf/${id}`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPendingTurfs(prev => prev.filter(turf => turf._id !== id));
//     } catch (err) {
//       console.error('Failed to approve turf', err);
//     }
//   };

//   const deleteUser = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/admin/delete-user/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(prev => prev.filter(user => user._id !== id));
//     } catch (err) {
//       console.error('Failed to delete user', err);
//     }
//   };

//   const deleteTurf = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/admin/delete-turf/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAllTurfs(prev => prev.filter(turf => turf._id !== id));
//     } catch (err) {
//       console.error('Failed to delete turf', err);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     window.location.href = '/';
//   };

//   // ✅ Filtered lists with safe checks
//   const filteredUsers = users.filter(user =>
//     (user.name || '').toLowerCase().includes(searchUser.toLowerCase())
//   );
  
//   const filteredTurfs = allTurfs.filter(turf =>
//     (turf.name || '').toLowerCase().includes(searchTurf.toLowerCase())
//   );
  

//   return (
//     <div className="admin-container">
//       <header className="admin-header">
//         <h1>👮 Admin Dashboard</h1>
//         <button onClick={handleLogout}>Logout</button>
//       </header>

//       <section className="pending-section">
//         <h2>🟢 Pending Turf Approvals</h2>
//         {pendingTurfs.length === 0 ? (
//           <p>No turfs to approve.</p>
//         ) : (
//           <table>
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Location</th>
//                 <th>Created By</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {pendingTurfs.map(turf => (
//                 <tr key={turf._id}>
//                   <td>{turf.name}</td>
//                   <td>{turf.location}</td>
//                   <td>{turf.manager?.name || 'N/A'}</td>
//                   <td>
//                     <button onClick={() => approveTurf(turf._id)}>Approve</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </section>

//       <section className="split-section">
//         <div className="half-section">
//           <h2>👥 User Management</h2>
//           <input
//             type="text"
//             placeholder="Search users..."
//             value={searchUser}
//             onChange={(e) => setSearchUser(e.target.value)}
//           />
//           <table>
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Role</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredUsers.map(user => (
//                 <tr key={user._id}>
//                   <td>{user.name}</td>
//                   <td>{user.email}</td>
//                   <td>{user.role}</td>
//                   <td>
//                     <button onClick={() => deleteUser(user._id)}>Delete</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="half-section">
//           <h2>⚽ All Turfs</h2>
//           <input
//             type="text"
//             placeholder="Search turfs..."
//             value={searchTurf}
//             onChange={(e) => setSearchTurf(e.target.value)}
//           />
//           <table>
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Location</th>
//                 <th>Created By</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredTurfs.map(turf => (
//                 <tr key={turf._id}>
//                   <td>{turf.name}</td>
//                   <td>{turf.location}</td>
//                   <td>{turf.manager?.name || 'N/A'}</td>
//                   <td>{turf.isApproved ? '✅ Approved' : '⏳ Pending'}</td>
//                   <td>
//                     <button onClick={() => deleteTurf(turf._id)}>Delete</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default AdminDashboardPage;



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';




// const AdminDashboardPage = () => {
//   const [pendingTurfs, setPendingTurfs] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [allTurfs, setAllTurfs] = useState([]);
//   const [searchUser, setSearchUser] = useState('');
//   const [searchTurf, setSearchTurf] = useState('');
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [pendingRes, usersRes, allTurfsRes] = await Promise.all([
//           axios.get('http://localhost:5000/api/admin/pending-turfs', {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get('http://localhost:5000/api/admin/all-users', {
//             headers: { Authorization: `Bearer ${token}` },
            
//           }),
//           axios.get('http://localhost:5000/api/admin/all-turfs', {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);
//         console.log("Fetched users data:", usersRes.data); 

//         setPendingTurfs(pendingRes.data);
//         setUsers(usersRes.data);
//         setAllTurfs(allTurfsRes.data);
//       } catch (err) {
//         console.error('Error fetching admin data', err);
//       }
//     };

//     fetchData();
//   }, []);

//   const approveTurf = async (id) => {
//     try {
//       await axios.patch(`http://localhost:5000/api/admin/approve-turf/${id}`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPendingTurfs(prev => prev.filter(turf => turf._id !== id));
//     } catch (err) {
//       console.error('Failed to approve turf', err);
//     }
//   };

//   const deleteUser = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/admin/delete-user/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(prev => prev.filter(user => user._id !== id));
//     } catch (err) {
//       console.error('Failed to delete user', err);
//     }
//   };

//   const deleteTurf = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/admin/delete-turf/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAllTurfs(prev => prev.filter(turf => turf._id !== id));
//     } catch (err) {
//       console.error('Failed to delete turf', err);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     window.location.href = '/';
//   };

//   return (
//     <div className="p-6 space-y-10">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">👮 Admin Dashboard</h1>
//         <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
//       </div>

//       {/* Pending Approvals */}
//     {/* Pending Approvals */}
// <section>
//   <h2 className="text-2xl font-bold mb-4">🟢 Pending Turf Approvals</h2>
//   {pendingTurfs.length === 0 ? (
//     <p className="text-gray-600">No turfs to approve.</p>
//   ) : (
//     <table className="w-full table-auto border-collapse border border-gray-300">
//       <thead>
//         <tr className="bg-gray-100">
//           <th className="border p-2">Name</th>
//           <th className="border p-2">Location</th>
//           <th className="border p-2">Created By</th>
//           <th className="border p-2">Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {pendingTurfs.map(turf => (
//           <tr key={turf._id}>
//             <td className="border p-2">{turf.name}</td>
//             <td className="border p-2">{turf.location}</td>
//             <td className="border p-2">{turf.manager?.name || 'N/A'}</td>
//             <td className="border p-2">
//               <button
//                 onClick={() => approveTurf(turf._id)}
//                 className="px-2 py-1 bg-green-600 text-white rounded mr-2"
//               >
//                 Approve
//               </button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   )}
// </section>


//       {/* All Users */}
//       <section>
//         <h2 className="text-2xl font-bold mb-4">👥 User Management</h2>
//         <input
//           type="text"
//           placeholder="Search users..."
//           className="mb-3 p-2 border w-full rounded"
//           value={searchUser}
//           onChange={(e) => setSearchUser(e.target.value)}
//         />
//         <table className="w-full table-auto border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border p-2">Name</th>
//               <th className="border p-2">Email</th>
//               <th className="border p-2">Role</th>
//               <th className="border p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.filter(user => user.name.toLowerCase().includes(searchUser.toLowerCase())).map(user => (
//               <tr key={user._id}>
//                 <td className="border p-2">{user.name}</td>
//                 <td className="border p-2">{user.email}</td>
//                 <td className="border p-2">{user.role}</td>
//                 <td className="border p-2">
//                   <button
//                     onClick={() => deleteUser(user._id)}
//                     className="px-2 py-1 bg-red-500 text-white text-sm rounded"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </section>

//       {/* All Turfs */}
//       <section>
//         <h2 className="text-2xl font-bold mb-4">⚽ All Turfs</h2>
//         <input
//           type="text"
//           placeholder="Search turfs..."
//           className="mb-3 p-2 border w-full rounded"
//           value={searchTurf}
//           onChange={(e) => setSearchTurf(e.target.value)}
//         />
//         <table className="w-full table-auto border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border p-2">Name</th>
//               <th className="border p-2">Location</th>
//               <th className="border p-2">Created By</th>
//               <th className="border p-2">Status</th>
//               <th className="border p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {allTurfs.filter(turf => turf.name.toLowerCase().includes(searchTurf.toLowerCase())).map(turf => (
//               <tr key={turf._id}>
//                 <td className="border p-2">{turf.name}</td>
//                 <td className="border p-2">{turf.location}</td>
//                 <td className="border p-2">{turf.manager?.name || 'N/A'}</td>               
//                 <td className="border p-2">{turf.isApproved ? '✅ Approved' : '⏳ Pending'}</td>
//                 <td className="border p-2">
//                   <button
//                     onClick={() => deleteTurf(turf._id)}
//                     className="px-2 py-1 bg-red-500 text-white text-sm rounded"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </section>
//     </div>
//   );
// };

// export default AdminDashboardPage;