const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
    label: { type: String, required: true },   // e.g. "3+GK", "4+GK"
    maxPlayers: { type: Number, required: true },
    pricePerHour: { type: Number, required: true },
});

const stadiumSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        location: { type: String, required: true },
        description: { type: String, default: '' },
        image: { type: String, default: '' },
        sizesAvailable: [sizeSchema],
        pricePerHour: { type: Number, required: true },  // base price
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Stadium', stadiumSchema);
