const express = require('express');
const router = express.Router();

// Import route files
const authRoutes = require('./authRoutes');
const carRoutes = require('./cars');
const bookingRoutes = require('./bookingRoutes');

// Use routes
router.use('/auth', authRoutes);
router.use('/cars', carRoutes);
router.use('/bookings', bookingRoutes);

module.exports = router; 