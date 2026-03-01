import { useEffect, useState } from 'react';
import API from '../../api/api';
import './BookingsPage.css';

const BookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [stadiums, setStadiums] = useState([]);
    const [filterDate, setFilterDate] = useState('');
    const [filterStadium, setFilterStadium] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        setLoading(true);
        let url = '/bookings?';
        if (filterDate) url += `date=${filterDate}&`;
        if (filterStadium) url += `stadiumId=${filterStadium}&`;
        const { data } = await API.get(url);
        setBookings(data);
        setLoading(false);
    };

    useEffect(() => {
        API.get('/stadiums').then(({ data }) => setStadiums(data));
        fetchBookings();
    }, []);

    useEffect(() => { fetchBookings(); }, [filterDate, filterStadium]);

    const handleStatusChange = async (id, field, value) => {
        await API.put(`/bookings/${id}/status`, { [field]: value });
        fetchBookings();
    };

    return (
        <div>
            <div className="page-header">
                <div><h1>Bookings</h1><p>All stadium reservations across the platform</p></div>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
                <div className="bookings-filters">
                    <div className="form-group">
                        <label>Filter by Date</label>
                        <input type="date" className="form-control" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Filter by Stadium</label>
                        <select className="form-control" value={filterStadium} onChange={(e) => setFilterStadium(e.target.value)}>
                            <option value="">All Stadiums</option>
                            {stadiums.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                    </div>
                    <button className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-end' }} onClick={() => { setFilterDate(''); setFilterStadium(''); }}>
                        Clear
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading"><div className="spinner" /></div>
            ) : (
                <>
                    <p style={{ marginBottom: 12, fontSize: 14, color: 'var(--text-secondary)' }}>{bookings.length} booking(s) found</p>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Stadium</th><th>User</th><th>Date</th><th>Time</th><th>Size</th><th>Price</th><th>Booking Status</th><th>Payment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((b) => (
                                    <tr key={b._id}>
                                        <td>{b.stadiumId?.name || '—'}</td>
                                        <td>
                                            <div>{b.userId?.name || '—'}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b.userId?.email}</div>
                                        </td>
                                        <td>{b.timeSlotId?.date || '—'}</td>
                                        <td>{b.timeSlotId ? `${b.timeSlotId.startTime}–${b.timeSlotId.endTime}` : '—'}</td>
                                        <td>{b.size}</td>
                                        <td><strong>${b.totalPrice}</strong></td>
                                        <td>
                                            <select
                                                value={b.bookingStatus}
                                                className="form-control"
                                                style={{ padding: '4px 8px', fontSize: 12, width: 'auto' }}
                                                onChange={(e) => handleStatusChange(b._id, 'bookingStatus', e.target.value)}
                                            >
                                                <option value="reserved">Reserved</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td>
                                            <span className={`badge ${b.paymentStatus === 'paid' ? 'badge-green' : b.paymentStatus === 'failed' ? 'badge-red' : 'badge-yellow'}`}>
                                                {b.paymentStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default BookingsPage;
