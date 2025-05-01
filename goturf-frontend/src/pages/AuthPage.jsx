import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthPage.css';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const BASE_URL = "http://localhost:5000";
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await axios.post(`${BASE_URL}${endpoint}`, formData);

      if (isLogin) {
        const { token, user } = res.data;
        const { role, name } = user;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ role, name }));

        alert("🎉 Login Successful!");

        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (user.role === 'manager') {
          navigate('/manager/dashboard');
        } else {
          navigate('/user/dashboard');
        }

      } else {
        alert("✅ Registered Successfully! Now please login.");
        setIsLogin(true);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Something went wrong.';
      alert(`🚨 ${errorMessage}`);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? 'Login to GoTurf' : 'Register for GoTurf'}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          {!isLogin && (
            <select name="role" onChange={handleChange}>
              <option value="user">User</option>
              <option value="manager">Manager</option>
            </select>
          )}
          <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register here' : 'Login here'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;












// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const AuthPage = () => {
//   const navigate = useNavigate();
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     role: 'user',
//   });

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     const BASE_URL = "http://localhost:5000";
//     const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
  
//     try {
//       const res = await axios.post(`${BASE_URL}${endpoint}`, formData);
      
//       if (isLogin) {
//         const { token, user } = res.data;
//         const { role, name } = user;
  
//         localStorage.setItem('token', token);
//         localStorage.setItem('user', JSON.stringify({ role, name }));
  
//         alert("🎉 Login Successful!");

//         if (user.role === 'admin') {
//           navigate('/admin/dashboard');
//         } else if (user.role === 'manager') {
//           navigate('/manager/dashboard');
//         } else {
//           navigate('/user/dashboard');
//         }
        
        
//       } else {
//         alert("✅ Registered Successfully! Now please login.");
//         setIsLogin(true);
//       }
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || 'Something went wrong.';
//       alert(`🚨 ${errorMessage}`);
//     }
//   };
  
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
//       <div className="w-full max-w-md p-6 rounded-2xl shadow-xl bg-white text-black">
//         <h2 className="text-2xl font-semibold mb-6 text-center">
//           {isLogin ? 'Login to GoTurf' : 'Register for GoTurf'}
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {!isLogin && (
//             <input
//               type="text"
//               name="name"
//               placeholder="Full Name"
//               className="w-full px-4 py-2 border border-gray-300 rounded"
//               onChange={handleChange}
//               required
//             />
//           )}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             className="w-full px-4 py-2 border border-gray-300 rounded"
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             className="w-full px-4 py-2 border border-gray-300 rounded"
//             onChange={handleChange}
//             required
//           />
//           {!isLogin && (
//             <select
//               name="role"
//               className="w-full px-4 py-2 border border-gray-300 rounded"
//               onChange={handleChange}
//             >
//               <option value="user">User</option>
//               <option value="manager">Manager</option>
//             </select>
//           )}
//           <button
//             type="submit"
//             className="w-full bg-black text-white py-2 rounded hover:bg-gray-900"
//           >
//             {isLogin ? 'Login' : 'Register'}
//           </button>
//         </form>
//         <p className="mt-4 text-center text-sm">
//           {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
//           <button
//             className="text-blue-600 hover:underline"
//             onClick={() => setIsLogin(!isLogin)}
//           >
//             {isLogin ? 'Register here' : 'Login here'}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default AuthPage;



// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';


// const AuthPage = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     role: 'user',
//   });

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     const BASE_URL = "http://localhost:5000"; // You can move this to .env later
//     const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
  
//     try {
//       const res = await axios.post(`${BASE_URL}${endpoint}`, formData);
  
//       if (isLogin) {
//         localStorage.setItem('token', res.data.token);
//         alert("🎉 Login Successful! Welcome back.");
//         // You can redirect user here, maybe navigate("/dashboard")
//       } else {
//         alert("✅ Registered Successfully! Now please login.");
//         setIsLogin(true); // switch to login view
//       }
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || 'Something went wrong. Please try again.';
//       alert(`🚨 ${errorMessage}`);
//     }
//   };
  

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
//       <div className="w-full max-w-md p-6 rounded-2xl shadow-xl bg-white text-black">
//         <h2 className="text-2xl font-semibold mb-6 text-center">
//           {isLogin ? 'Login to GoTurf' : 'Register for GoTurf'}
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {!isLogin && (
//             <input
//               type="text"
//               name="name"
//               placeholder="Full Name"
//               className="w-full px-4 py-2 border border-gray-300 rounded"
//               onChange={handleChange}
//               required
//             />
//           )}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             className="w-full px-4 py-2 border border-gray-300 rounded"
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             className="w-full px-4 py-2 border border-gray-300 rounded"
//             onChange={handleChange}
//             required
//           />
//           {!isLogin && (
//             <select
//               name="role"
//               className="w-full px-4 py-2 border border-gray-300 rounded"
//               onChange={handleChange}
//             >
//               <option value="user">User</option>
//               <option value="manager">Manager</option>
//             </select>
//           )}
//           <button
//             type="submit"
//             className="w-full bg-black text-white py-2 rounded hover:bg-gray-900"
//           >
//             {isLogin ? 'Login' : 'Register'}
//           </button>
//         </form>
//         <p className="mt-4 text-center text-sm">
//           {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
//           <button
//             className="text-blue-600 hover:underline"
//             onClick={() => setIsLogin(!isLogin)}
//           >
//             {isLogin ? 'Register here' : 'Login here'}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default AuthPage;
