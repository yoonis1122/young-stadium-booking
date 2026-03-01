const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema(
    {
        stadiumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stadium', required: true },
        date: { type: String, required: true },        // "YYYY-MM-DD"
        startTime: { type: String, required: true },   // "09:00"
        endTime: { type: String, required: true },     // "10:00"
        isBooked: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Prevent double booking on the same stadium + date + time
timeSlotSchema.index({ stadiumId: 1, date: 1, startTime: 1 }, { unique: true });

module.exports = mongoose.model('TimeSlot', timeSlotSchema);
