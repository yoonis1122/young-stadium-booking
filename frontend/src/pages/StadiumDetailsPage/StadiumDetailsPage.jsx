import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import './StadiumDetailsPage.css';

const StadiumDetailsPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [stadium, setStadium] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [slotsLoading, setSlotsLoading] = useState(false);

    // Min date = today
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        API.get(`/stadiums/${id}`).then(({ data }) => {
            setStadium(data);
            if (data.sizesAvailable?.length) setSelectedSize(data.sizesAvailable[0]);
            setLoading(false);
        });
    }, [id]);

    useEffect(() => {
        if (!selectedDate || !id) return;
        setSlotsLoading(true);
        API.get(`/timeslots/${id}?date=${selectedDate}`).then(({ data }) => {
            setSlots(data);
            setSelectedSlot(null);
            setSlotsLoading(false);
        });
    }, [selectedDate, id]);

    const handleBook = () => {
        if (!user) return navigate('/login');
        navigate(`/book/${id}`, { state: { stadium, selectedSize, selectedSlot } });
    };

    if (loading) return <div className="loading"><div className="spinner" /></div>;
    if (!stadium) return <div className="page-wrapper container"><h2>Stadium not found</h2></div>;

    return (
        <div className="page-wrapper">
            <div className="container">
                {/* Back */}
                <button className="back-btn" onClick={() => navigate('/stadiums')}>← Back to Stadiums</button>

                {/* Image Banner */}
                <div className="detail-banner">
                    <img
                        src={stadium.image || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1200'}
                        alt={stadium.name}
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200';
                            e.target.onerror = null;
                        }}
                    />
                    <div className="detail-banner-overlay">
                        <h1 className="detail-name">{stadium.name}</h1>
                        <p className="detail-location">📍 {stadium.location}</p>
                    </div>
                </div>

                <div className="detail-layout">
                    {/* Left: Info */}
                    <div className="detail-info">
                        <div className="card">
                            <h2>About this Stadium</h2>
                            <p className="detail-desc">{stadium.description}</p>
                        </div>

                        <div className="card">
                            <h2>Available Sizes</h2>
                            <div className="sizes-grid">
                                {stadium.sizesAvailable.map((s) => (
                                    <button
                                        key={s.label}
                                        className={`size-option ${selectedSize?.label === s.label ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(s)}
                                    >
                                        <span className="size-label">{s.label}</span>
                                        <span className="size-players">Up to {s.maxPlayers} players</span>
                                        <span className="size-price">${s.pricePerHour}/hr</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Booking panel */}
                    <div className="detail-booking-panel">
                        <div className="card booking-card">
                            <h2>Book This Stadium</h2>

                            {selectedSize && (
                                <div className="selected-size-info">
                                    <span>Selected: <strong>{selectedSize.label}</strong></span>
                                    <span className="selected-price">${selectedSize.pricePerHour}/hr</span>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Select Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    min={today}
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </div>

                            {selectedDate && (
                                <div className="slots-section">
                                    <h3>Available Time Slots</h3>
                                    {slotsLoading ? (
                                        <div className="loading" style={{ minHeight: 80 }}><div className="spinner" /></div>
                                    ) : slots.length === 0 ? (
                                        <p className="no-slots">No slots available for this date.</p>
                                    ) : (
                                        <div className="slots-grid">
                                            {slots.map((slot) => (
                                                <button
                                                    key={slot._id}
                                                    className={`slot-btn ${slot.isBooked ? 'booked' : ''} ${selectedSlot?._id === slot._id ? 'selected' : ''}`}
                                                    disabled={slot.isBooked}
                                                    onClick={() => setSelectedSlot(slot)}
                                                >
                                                    {slot.startTime} – {slot.endTime}
                                                    {slot.isBooked && <span className="slot-booked-label">Booked</span>}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', marginTop: 16 }}
                                disabled={!selectedSlot || !selectedSize}
                                onClick={handleBook}
                            >
                                {user ? 'Continue to Booking' : 'Login to Book'}
                            </button>

                            {!selectedSlot && selectedDate && (
                                <p className="booking-hint">Please select a time slot to continue</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StadiumDetailsPage;
