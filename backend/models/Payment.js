const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.ObjectId,
        ref: 'Booking',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Please enter payment amount']
    },
    currency: {
        type: String,
        default: 'USD'
    },
    paymentMethod: {
        type: String,
        required: [true, 'Please enter payment method'],
        enum: ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer']
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    transactionId: {
        type: String,
        required: [true, 'Please enter transaction ID']
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    cardDetails: {
        last4: String,
        brand: String,
        expiryMonth: Number,
        expiryYear: Number
    },
    billingAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    refundDetails: {
        amount: Number,
        reason: String,
        processedAt: Date
    },
    paymentGateway: {
        type: String,
        required: [true, 'Please enter payment gateway'],
        enum: ['Stripe', 'PayPal', 'Bank Transfer']
    },
    paymentNotes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
paymentSchema.index({ transactionId: 1 }, { unique: true });
paymentSchema.index({ booking: 1 });
paymentSchema.index({ user: 1 });

module.exports = mongoose.model('Payment', paymentSchema); 