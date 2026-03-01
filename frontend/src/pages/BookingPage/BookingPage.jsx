import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../api/api';
import './BookingPage.css';

const BookingPage = () => {
    const { stadiumId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { stadium, selectedSize, selectedSlot } = state || {};

    // Guard: if arrived without state
    if (!stadium || !selectedSize || !selectedSlot) {
        return (
            <div className="page-wrapper">
                <div className="container text-center">
                    <p>Missing booking data. Please start from the stadium page.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/stadiums')}>Back to Stadiums</button>
                </div>
            </div>
        );
    }

    const handlePay = async () => {
        setLoading(true);
        setError('');
        try {
            // Step 1: Create booking
            const { data: booking } = await API.post('/bookings', {
                stadiumId: stadium._id,
                timeSlotId: selectedSlot._id,
                size: selectedSize.label,
            });

            // Step 2: Create Stripe Checkout Session
            const { data: session } = await API.post('/payment/create-checkout-session', {
                bookingId: booking._id,
            });

            // Step 3: Redirect to Stripe
            toast.info('Redirecting to Stripe for payment...');
            window.location.href = session.url;
        } catch (err) {
            const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
            toast.error(msg);
            setError(msg);
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="container">
                <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

                <h1 className="section-title" style={{ marginBottom: 8 }}>Confirm <span className="text-green">Booking</span></h1>
                <p className="section-subtitle" style={{ marginBottom: 40 }}>Review your booking details before payment</p>

                <div className="booking-layout">
                    {/* Summary Card */}
                    <div className="booking-summary card">
                        <div className="summary-stadium-image">
                            <img
                                src={stadium.image}
                                alt={stadium.name}
                                onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=600';
                                    e.target.onerror = null;
                                }}
                            />
                        </div>
                        <h2 className="summary-stadium-name">{stadium.name}</h2>
                        <p className="summary-location">📍 {stadium.location}</p>

                        <div className="summary-divider" />

                        <div className="summary-details">
                            <div className="summary-row">
                                <span>Size</span>
                                <strong>{selectedSize.label} ({selectedSize.maxPlayers} players)</strong>
                            </div>
                            <div className="summary-row">
                                <span>Date</span>
                                <strong>{selectedSlot.date}</strong>
                            </div>
                            <div className="summary-row">
                                <span>Time</span>
                                <strong>{selectedSlot.startTime} – {selectedSlot.endTime}</strong>
                            </div>
                            <div className="summary-row">
                                <span>Duration</span>
                                <strong>1 Hour</strong>
                            </div>
                        </div>

                        <div className="summary-divider" />

                        <div className="summary-total">
                            <span>Total Amount</span>
                            <strong className="total-price">${selectedSize.pricePerHour}</strong>
                        </div>
                    </div>

                    {/* Payment CTA */}
                    <div className="booking-payment card">
                        <div className="payment-icon">💳</div>
                        <h2>Secure Payment</h2>
                        <p>You will be redirected to Stripe's secure checkout page to complete your payment.</p>

                        <ul className="payment-features">
                            <li>✅ SSL encrypted payment</li>
                            <li>✅ Powered by Stripe</li>
                            <li>✅ Booking confirmed only after successful payment</li>
                            <li>✅ Test card: <code>4242 4242 4242 4242</code></li>
                        </ul>

                        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            onClick={handlePay}
                            disabled={loading}
                        >
                            {loading ? '⏳ Redirecting to Stripe...' : `Pay $${selectedSize.pricePerHour} with Stripe`}
                        </button>

                        <p className="payment-note">
                            You will be redirected to Stripe. Your slot is reserved for 10 minutes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
