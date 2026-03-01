const TimeSlot = require('../models/TimeSlot');

// @GET /api/timeslots/:stadiumId?date=YYYY-MM-DD
const getTimeSlots = async (req, res, next) => {
    try {
        const { stadiumId } = req.params;
        const { date } = req.query;
        const filter = { stadiumId };
        if (date) filter.date = date;
        const slots = await TimeSlot.find(filter).sort({ startTime: 1 });
        res.json(slots);
    } catch (error) {
        next(error);
    }
};

// @POST /api/timeslots (admin) - create one or many slots
const createTimeSlots = async (req, res, next) => {
    try {
        const { stadiumId, date, slots } = req.body;
        const docs = slots.map((s) => ({ stadiumId, date, startTime: s.startTime, endTime: s.endTime }));
        const created = await TimeSlot.insertMany(docs, { ordered: false }).catch((err) => {
            if (err.code === 11000) throw { status: 409, message: 'One or more slots already exist for this time' };
            throw err;
        });
        res.status(201).json(created);
    } catch (error) {
        next(error);
    }
};

// @DELETE /api/timeslots/:id (admin)
const deleteTimeSlot = async (req, res, next) => {
    try {
        const slot = await TimeSlot.findById(req.params.id);
        if (!slot) return res.status(404).json({ message: 'Time slot not found' });
        if (slot.isBooked) return res.status(400).json({ message: 'Cannot delete a booked slot' });
        await slot.deleteOne();
        res.json({ message: 'Time slot deleted' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getTimeSlots, createTimeSlots, deleteTimeSlot };
