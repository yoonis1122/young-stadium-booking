import { useEffect, useState } from 'react';
import API from '../../api/api';
import './MyBookingsPage.css';

const statusColor = {
    confirmed: 'badge-green',
    reserved: 'badge-yellow',
    cancelled: 'badge-red',
};
const paymentColor = {
    paid: 'badge-green',
    pending: 'badge-yellow',
    failed: 'badge-red',
};

const MyBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/bookings/my').then(({ data }) => {
            setBookings(data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="loading"><div className="spinner" /></div>;

    return (
        <div className="page-wrapper">
            <div className="container">
                <h1 className="section-title" style={{ marginBottom: 8 }}>My <span className="text-green">Bookings</span></h1>
                <p className="section-subtitle" style={{ marginBottom: 40 }}>All your stadium reservations in one place</p>

                {bookings.length === 0 ? (
                    <div className="no-bookings">
                        <div className="no-bookings-icon">📅</div>
                        <h3>No bookings yet</h3>
                        <p>You haven't booked any stadiums. Start exploring!</p>
                        <a href="/stadiums" className="btn btn-primary" style={{ marginTop: 20 }}>Browse Stadiums</a>
                    </div>
                ) : (
                    <div className="bookings-list">
                        {bookings.map((b) => (
                            <div key={b._id} className="booking-item card">
                                <div className="booking-item-image">
                                    <img
                                        src={b.stadiumId?.image || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=300'}
                                        alt={b.stadiumId?.name}
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=300';
                                            e.target.onerror = null; // Prevent infinite loop
                                        }}
                                    />
                                </div>
                                <div className="booking-item-info">
                                    <h3>{b.stadiumId?.name}</h3>
                                    <p className="booking-location">📍 {b.stadiumId?.location}</p>
                                    <div className="booking-meta">
                                        <span>📅 {b.timeSlotId?.date}</span>
                                        <span>🕐 {b.timeSlotId?.startTime} – {b.timeSlotId?.endTime}</span>
                                        <span>⚽ {b.size}</span>
                                    </div>
                                </div>
                                <div className="booking-item-status">
                                    <div className="booking-badges">
                                        <span className={`badge ${statusColor[b.bookingStatus] || 'badge-blue'}`}>
                                            {b.bookingStatus}
                                        </span>
                                        <span className={`badge ${paymentColor[b.paymentStatus] || 'badge-blue'}`}>
                                            {b.paymentStatus}
                                        </span>
                                    </div>
                                    <div className="booking-price">${b.totalPrice}</div>
                                    <div className="booking-date">
                                        Booked: {new Date(b.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookingsPage;
