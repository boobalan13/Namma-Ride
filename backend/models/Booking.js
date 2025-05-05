const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    car: {
        type: mongoose.Schema.ObjectId,
        ref: 'Car',
        required: true
    },
    startDate: {
        type: Date,
        required: [true, 'Please enter start date']
    },
    endDate: {
        type: Date,
        required: [true, 'Please enter end date']
    },
    totalDays: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
        default: 'Pending'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Refunded', 'Failed'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        enum: ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer'],
        required: true
    },
    pickupLocation: {
        type: String,
        required: [true, 'Please enter pickup location']
    },
    dropoffLocation: {
        type: String,
        required: [true, 'Please enter dropoff location']
    },
    additionalRequests: {
        type: String
    },
    insurance: {
        type: Boolean,
        default: false
    },
    insurancePrice: {
        type: Number,
        default: 0
    },
    driverLicense: {
        type: String,
        required: true
    },
    cancellationReason: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate total days and price before saving
bookingSchema.pre('save', function(next) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    this.totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    next();
});

module.exports = mongoose.model('Booking', bookingSchema); 