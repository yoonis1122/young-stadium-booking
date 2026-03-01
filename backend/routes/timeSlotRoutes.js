const express = require('express');
const router = express.Router();
const { getTimeSlots, createTimeSlots, deleteTimeSlot } = require('../controllers/timeSlotController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/adminMiddleware');

router.get('/:stadiumId', getTimeSlots);
router.post('/', protect, adminOnly, createTimeSlots);
router.delete('/:id', protect, adminOnly, deleteTimeSlot);

module.exports = router;
