require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();


app.use(cors({
  origin: [ 'http://localhost:5173/' , 'https://goturff-g1rl0f5s-projects.vercel.app','https://goturff.vercel.app'],
  credentials: true,
}));
// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/turfs', require('./routes/turfRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/public', require('./routes/public'));
app.use('/api/protected', require('./routes/protectedRoutes'));
app.use('/api/manager', require('./routes/managerRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

// ✅ Serve static frontend files (if deployed together)
const frontendPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendPath));

// ✅ Catch-all for frontend routes (e.g. React Router paths like /turfs/123)
app.get('*splat', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// 404 for unknown API routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));




// require('dotenv').config();
// const express = require('express');
// const path = require('path');
// const cors = require('cors');
// const connectDB = require('./db');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Connect to the database
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // API Routes
// app.use('/api/turfs', require('./routes/turfRoutes'));
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));
// app.use('/api/public', require('./routes/public'));
// app.use('/api/protected', require('./routes/protectedRoutes'));
// app.use('/api/manager', require('./routes/managerRoutes'));
// app.use('/api/bookings', require('./routes/bookingRoutes'));
// app.use('/api/payments', require('./routes/paymentRoutes'));

// // Serve static files from the Vite build
// app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// // Handle all other routes with the index.html from the Vite build
// app.get('*splat', (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
// });

// // 404 handler for unmatched routes
// app.use((req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });

// // Start the server
// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));




