const express = require('express');
const router = express.Router();
const { createCheckoutSession, stripeWebhook, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

// Webhook must use raw body — handled in server.js before json middleware
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
router.post('/create-checkout-session', protect, createCheckoutSession);
router.get('/verify/:sessionId', protect, verifyPayment);

module.exports = router;
