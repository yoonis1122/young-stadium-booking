const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        stadiumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stadium', required: true },
        timeSlotId: { type: mongoose.Schema.Types.ObjectId, ref: 'TimeSlot', required: true },
        size: { type: String, required: true },  // e.g. "3+GK"
        totalPrice: { type: Number, required: true },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        bookingStatus: {
            type: String,
            enum: ['reserved', 'confirmed', 'cancelled'],
            default: 'reserved',
        },
        stripeSessionId: { type: String, default: '' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
