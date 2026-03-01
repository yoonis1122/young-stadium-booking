const Booking = require('../models/Booking');
const TimeSlot = require('../models/TimeSlot');
const Stadium = require('../models/Stadium');

// @POST /api/bookings (auth user)
const createBooking = async (req, res, next) => {
    try {
        const { stadiumId, timeSlotId, size } = req.body;

        const slot = await TimeSlot.findById(timeSlotId);
        if (!slot) return res.status(404).json({ message: 'Time slot not found' });
        if (slot.isBooked) return res.status(400).json({ message: 'This slot is already booked' });

        const stadium = await Stadium.findById(stadiumId);
        if (!stadium) return res.status(404).json({ message: 'Stadium not found' });

        const selectedSize = stadium.sizesAvailable.find((s) => s.label === size);
        const totalPrice = selectedSize ? selectedSize.pricePerHour : stadium.pricePerHour;

        const booking = await Booking.create({
            userId: req.user._id,
            stadiumId,
            timeSlotId,
            size,
            totalPrice,
            paymentStatus: 'pending',
            bookingStatus: 'reserved',
        });

        res.status(201).json(booking);
    } catch (error) {
        next(error);
    }
};

// @GET /api/bookings/my (auth user)
const getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .populate('stadiumId', 'name location image')
            .populate('timeSlotId', 'date startTime endTime')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        next(error);
    }
};

// @GET /api/bookings (admin)
const getAllBookings = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.date) {
            const slots = await TimeSlot.find({ date: req.query.date }).select('_id');
            filter.timeSlotId = { $in: slots.map((s) => s._id) };
        }
        if (req.query.stadiumId) filter.stadiumId = req.query.stadiumId;

        const bookings = await Booking.find(filter)
            .populate('userId', 'name email phone')
            .populate('stadiumId', 'name location')
            .populate('timeSlotId', 'date startTime endTime')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        next(error);
    }
};

// @PUT /api/bookings/:id/status (admin)
const updateBookingStatus = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        booking.bookingStatus = req.body.bookingStatus || booking.bookingStatus;
        booking.paymentStatus = req.body.paymentStatus || booking.paymentStatus;
        await booking.save();
        res.json(booking);
    } catch (error) {
        next(error);
    }
};

module.exports = { createBooking, getMyBookings, getAllBookings, updateBookingStatus };
