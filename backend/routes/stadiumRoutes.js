const express = require('express');
const router = express.Router();
const {
    getStadiums, getStadiumById, createStadium, updateStadium, deleteStadium, getAllStadiums
} = require('../controllers/stadiumController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/adminMiddleware');

router.get('/', getStadiums);
router.get('/admin/all', protect, adminOnly, getAllStadiums);
router.get('/:id', getStadiumById);
router.post('/', protect, adminOnly, createStadium);
router.put('/:id', protect, adminOnly, updateStadium);
router.delete('/:id', protect, adminOnly, deleteStadium);

module.exports = router;
