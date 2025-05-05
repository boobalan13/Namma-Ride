const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
    booking: {
        type: mongoose.Schema.ObjectId,
        ref: 'Booking',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Please add a rating'],
        min: 1,
        max: 5
    },
    title: {
        type: String,
        required: [true, 'Please add a title for your review'],
        trim: true
    },
    comment: {
        type: String,
        required: [true, 'Please add a comment'],
        trim: true
    },
    images: [{
        type: String
    }],
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    dislikes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent user from submitting more than one review per car
reviewSchema.index({ car: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema); 