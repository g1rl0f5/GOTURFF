require('dotenv').config();
const express = require('express');
const app = express(); 
// const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require ('./db');
const path = require('path');



const turfRoutes = require('./routes/turfRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes')
const publicRoutes = require('./routes/public');
const ProtectedRoute = require('./routes/protectedRoutes');
const managerRoutes = require('./routes/managerRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.get('/', (req, res) => res.send('API Running'));
app.use('/api/turfs', turfRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/protected', ProtectedRoute);
app.use('/api/manager', managerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);


app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
