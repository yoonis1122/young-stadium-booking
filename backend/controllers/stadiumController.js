const Stadium = require('../models/Stadium');

// @GET /api/stadiums
const getStadiums = async (req, res, next) => {
    try {
        const stadiums = await Stadium.find({ isActive: true });
        res.json(stadiums);
    } catch (error) {
        next(error);
    }
};

// @GET /api/stadiums/:id
const getStadiumById = async (req, res, next) => {
    try {
        const stadium = await Stadium.findById(req.params.id);
        if (!stadium) return res.status(404).json({ message: 'Stadium not found' });
        res.json(stadium);
    } catch (error) {
        next(error);
    }
};

// @POST /api/stadiums (admin)
const createStadium = async (req, res, next) => {
    try {
        const { name, location, description, image, sizesAvailable, pricePerHour } = req.body;
        const stadium = await Stadium.create({
            name, location, description, image, sizesAvailable, pricePerHour,
        });
        res.status(201).json(stadium);
    } catch (error) {
        next(error);
    }
};

// @PUT /api/stadiums/:id (admin)
const updateStadium = async (req, res, next) => {
    try {
        const stadium = await Stadium.findById(req.params.id);
        if (!stadium) return res.status(404).json({ message: 'Stadium not found' });
        Object.assign(stadium, req.body);
        const updated = await stadium.save();
        res.json(updated);
    } catch (error) {
        next(error);
    }
};

// @DELETE /api/stadiums/:id (admin)
const deleteStadium = async (req, res, next) => {
    try {
        const stadium = await Stadium.findById(req.params.id);
        if (!stadium) return res.status(404).json({ message: 'Stadium not found' });
        stadium.isActive = false;
        await stadium.save();
        res.json({ message: 'Stadium deactivated' });
    } catch (error) {
        next(error);
    }
};

// @GET /api/stadiums/all (admin - includes inactive)
const getAllStadiums = async (req, res, next) => {
    try {
        const stadiums = await Stadium.find({});
        res.json(stadiums);
    } catch (error) {
        next(error);
    }
};

module.exports = { getStadiums, getStadiumById, createStadium, updateStadium, deleteStadium, getAllStadiums };
