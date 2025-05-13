const Booking = require('../models/Booking');
const Car = require('../models/Car');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
exports.getBookings = async (req, res) => {
    try {
        let bookings;
        if (req.user.role === 'admin') {
            bookings = await Booking.find().populate('car', 'make model images').populate('user', 'name email');
        } else {
            bookings = await Booking.find({ user: req.user.id }).populate('car', 'make model images');
        }
        res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('user', 'name email')
            .populate('car', 'make model year pricePerDay');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Make sure user is booking owner or admin
        if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this booking'
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
    try {
        const { car, startDate, endDate, pickupLocation, dropoffLocation, driverLicense } = req.body;

        // Check if car exists and is available
        const carDetails = await Car.findById(car);
        if (!carDetails) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        if (!carDetails.availability) {
            return res.status(400).json({
                success: false,
                message: 'Car is not available for booking'
            });
        }

        // Check for existing bookings that overlap
        const existingBookings = await Booking.find({
            car,
            $or: [
                {
                    startDate: { $lte: endDate },
                    endDate: { $gte: startDate }
                }
            ]
        });

        if (existingBookings.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Car is already booked for the selected dates'
            });
        }

        // Calculate total price
        const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const totalPrice = diffDays * carDetails.pricePerDay;

        const booking = await Booking.create({
            user: req.user.id,
            car,
            startDate,
            endDate,
            totalDays: diffDays,
            totalPrice,
            pickupLocation,
            dropoffLocation,
            driverLicense,
            paymentMethod: req.body.paymentMethod
        });

        // Update car availability
        carDetails.availability = false;
        carDetails.status = 'Rented';
        await carDetails.save();

        res.status(201).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res) => {
    try {
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Make sure user is booking owner or admin
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this booking'
            });
        }

        // If dates are being updated, check for availability
        if (req.body.startDate || req.body.endDate) {
            const startDate = req.body.startDate || booking.startDate;
            const endDate = req.body.endDate || booking.endDate;

            const existingBookings = await Booking.find({
                car: booking.car,
                _id: { $ne: booking._id },
                $or: [
                    {
                        startDate: { $lte: endDate },
                        endDate: { $gte: startDate }
                    }
                ]
            });

            if (existingBookings.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Car is already booked for the selected dates'
                });
            }
        }

        booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Make sure user is booking owner or admin
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to cancel this booking'
            });
        }

        // Update booking status
        booking.status = 'Cancelled';
        booking.cancellationReason = req.body.reason;
        await booking.save();

        // Update car availability
        const car = await Car.findById(booking.car);
        car.availability = true;
        car.status = 'Available';
        await car.save();

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}; 