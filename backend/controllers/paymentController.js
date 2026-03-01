const stripe = require('../config/stripe');
const Booking = require('../models/Booking');
const TimeSlot = require('../models/TimeSlot');
const Stadium = require('../models/Stadium');

// @POST /api/payment/create-checkout-session
const createCheckoutSession = async (req, res, next) => {
    try {
        const { bookingId } = req.body;

        const booking = await Booking.findById(bookingId)
            .populate('stadiumId')
            .populate('timeSlotId');

        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.userId.toString() !== req.user._id.toString())
            return res.status(403).json({ message: 'Not your booking' });

        if (process.env.STRIPE_SECRET_KEY === 'mock') {
            // Mock implementation: confirm booking immediately and skip Stripe
            booking.paymentStatus = 'paid';
            booking.bookingStatus = 'confirmed';
            await booking.save();

            // Lock the time slot
            await TimeSlot.findByIdAndUpdate(booking.timeSlotId, { isBooked: true });

            return res.json({ url: `${process.env.CLIENT_URL}/success?session_id=mock_session_${Date.now()}` });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${booking.stadiumId.name} — ${booking.size}`,
                            description: `${booking.timeSlotId.date} | ${booking.timeSlotId.startTime} - ${booking.timeSlotId.endTime}`,
                            images: [booking.stadiumId.image],
                        },
                        unit_amount: Math.round(booking.totalPrice * 100),
                    },
                    quantity: 1,
                },
            ],
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/failed`,
            metadata: { bookingId: booking._id.toString() },
        });

        booking.stripeSessionId = session.id;
        await booking.save();

        res.json({ url: session.url });
    } catch (error) {
        next(error);
    }
};

// @POST /api/payment/webhook
const stripeWebhook = async (req, res, next) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const bookingId = session.metadata.bookingId;

            const booking = await Booking.findById(bookingId);
            if (booking) {
                booking.paymentStatus = 'paid';
                booking.bookingStatus = 'confirmed';
                await booking.save();

                await TimeSlot.findByIdAndUpdate(booking.timeSlotId, { isBooked: true });
            }
        }

        if (event.type === 'checkout.session.expired') {
            const session = event.data.object;
            const booking = await Booking.findOne({ stripeSessionId: session.id });
            if (booking) {
                booking.bookingStatus = 'cancelled';
                booking.paymentStatus = 'failed';
                await booking.save();
            }
        }

        res.json({ received: true });
    } catch (error) {
        next(error);
    }
};

// @GET /api/payment/verify/:sessionId
const verifyPayment = async (req, res, next) => {
    try {
        const { sessionId } = req.params;

        if (sessionId.startsWith('mock_session_')) {
            const booking = await Booking.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
            if (booking) {
                booking.paymentStatus = 'paid';
                booking.bookingStatus = 'confirmed';
                await booking.save();
                await TimeSlot.findByIdAndUpdate(booking.timeSlotId, { isBooked: true });
            }
            return res.json({ success: true, booking });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const bookingId = session.metadata.bookingId;
            const booking = await Booking.findById(bookingId);

            if (booking && booking.paymentStatus !== 'paid') {
                booking.paymentStatus = 'paid';
                booking.bookingStatus = 'confirmed';
                await booking.save();

                await TimeSlot.findByIdAndUpdate(booking.timeSlotId, { isBooked: true });
            }
            return res.json({ success: true, booking });
        }

        res.status(400).json({ success: false, message: 'Payment not completed or verified yet.' });
    } catch (error) {
        next(error);
    }
};

module.exports = { createCheckoutSession, stripeWebhook, verifyPayment };
