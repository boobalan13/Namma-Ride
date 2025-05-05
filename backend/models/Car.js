const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Sedan', 'SUV', 'Hatchback', 'Luxury']
    },
    transmission: {
        type: String,
        required: true,
        enum: ['Automatic', 'Manual']
    },
    fuelType: {
        type: String,
        required: true,
        enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid']
    },
    seats: {
        type: Number,
        required: true
    },
    bags: {
        type: Number,
        required: true
    },
    doors: {
        type: Number,
        required: true
    },
    pricePerDay: {
        type: Number,
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    features: [{
        type: String
    }],
    isAvailable: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Car', carSchema); 