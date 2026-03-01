import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../../api/api';
import './SuccessPage.css';

const SuccessPage = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [booking, setBooking] = useState(null);

    useEffect(() => {
        if (sessionId) {
            // Verify payment status and update database
            API.get(`/payment/verify/${sessionId}`)
                .then(({ data }) => {
                    if (data.success) setBooking(data.booking);
                })
                .catch(() => {
                    // Fallback: Fetch latest booking if verification fails
                    API.get('/bookings/my').then(({ data }) => {
                        if (data.length > 0) setBooking(data[0]);
                    });
                });
        }
    }, [sessionId]);

    return (
        <div className="result-page">
            <div className="result-card">
                <div className="result-icon success-icon">✅</div>
                <h1>Booking Confirmed!</h1>
                <p>Your payment was successful and your stadium is booked.</p>

                {booking && (
                    <div className="result-booking-info">
                        <div className="info-row"><span>Stadium</span><strong>{booking.stadiumId?.name}</strong></div>
                        <div className="info-row"><span>Date</span><strong>{booking.timeSlotId?.date}</strong></div>
                        <div className="info-row"><span>Time</span><strong>{booking.timeSlotId?.startTime} – {booking.timeSlotId?.endTime}</strong></div>
                        <div className="info-row"><span>Size</span><strong>{booking.size}</strong></div>
                        <div className="info-row"><span>Paid</span><strong className="text-green">${booking.totalPrice}</strong></div>
                    </div>
                )}

                <div className="result-actions">
                    <Link to="/my-bookings" className="btn btn-primary">View My Bookings</Link>
                    <Link to="/stadiums" className="btn btn-outline">Book Again</Link>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
