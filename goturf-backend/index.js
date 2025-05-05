

require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware
app.use(cors());
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

// Serve static files from the Vite build
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// Handle all other routes with the index.html from the Vite build
app.get('*splat', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));







// require('dotenv').config();
// const express = require('express');
// const app = express(); 
// // const mongoose = require('mongoose');
// const cors = require('cors');
// const connectDB = require ('./db');
// const path = require('path');



// const turfRoutes = require('./routes/turfRoutes');
// const authRoutes = require('./routes/authRoutes');
// const adminRoutes = require('./routes/adminRoutes')
// const publicRoutes = require('./routes/public');
// const ProtectedRoute = require('./routes/protectedRoutes');
// const managerRoutes = require('./routes/managerRoutes');
// const bookingRoutes = require('./routes/bookingRoutes');
// const paymentRoutes = require('./routes/paymentRoutes');
// const PORT = process.env.PORT || 5000;

// connectDB();

// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// app.get('/', (req, res) => res.send('API Running'));
// app.use('/api/turfs', turfRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/public', publicRoutes);
// app.use('/api/protected', ProtectedRoute);
// app.use('/api/manager', managerRoutes);
// app.use('/api/bookings', bookingRoutes);
// app.use('/api/payments', paymentRoutes);


// app.use((req, res) => {
//     res.status(404).json({ message: 'Route not found' });
//   });

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
