const express = require('express');
const router = express.Router();
const {
    getBookings,
    getBooking,
    createBooking,
    updateBooking,
    cancelBooking
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect, getBookings)
    .post(protect, createBooking);

router.route('/:id')
    .get(protect, getBooking)
    .put(protect, updateBooking);

router.route('/:id/cancel')
    .put(protect, cancelBooking);

module.exports = router; 