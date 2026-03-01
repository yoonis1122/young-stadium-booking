import { useEffect, useState } from 'react';
import API from '../../api/api';
import StatCard from '../../components/StatCard/StatCard';
import './DashboardPage.css';

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        Promise.all([
            API.get('/bookings'),
            API.get('/stadiums/admin/all'),
        ]).then(([bRes, sRes]) => {
            const bookings = bRes.data;
            const stadiums = sRes.data;
            const revenue = bookings
                .filter((b) => b.paymentStatus === 'paid')
                .reduce((sum, b) => sum + b.totalPrice, 0);
            const todayCount = bookings.filter((b) => {
                const slotDate = b.timeSlotId?.date;
                return slotDate === today;
            }).length;

            setStats({
                totalBookings: bookings.length,
                revenue,
                activeStadiums: stadiums.filter((s) => s.isActive).length,
                todayBookings: todayCount,
                confirmedBookings: bookings.filter((b) => b.bookingStatus === 'confirmed').length,
            });
            setRecentBookings(bookings.slice(0, 5));
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="loading"><div className="spinner" /></div>;

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome back! Here's what's happening today.</p>
                </div>
            </div>

            <div className="stats-grid">
                <StatCard icon="📅" label="Total Bookings" value={stats.totalBookings} sub={`${stats.confirmedBookings} confirmed`} color="blue" />
                <StatCard icon="💰" label="Total Revenue" value={`$${stats.revenue.toLocaleString()}`} sub="All time earnings" color="green" />
                <StatCard icon="🏟️" label="Active Stadiums" value={stats.activeStadiums} color="yellow" />
                <StatCard icon="📆" label="Today's Bookings" value={stats.todayBookings} color="blue" />
            </div>

            <div className="dashboard-card card">
                <h2>Recent Bookings</h2>
                {recentBookings.length === 0 ? (
                    <p className="text-muted" style={{ marginTop: 16 }}>No bookings yet.</p>
                ) : (
                    <div className="table-wrapper" style={{ marginTop: 16 }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Stadium</th>
                                    <th>User</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Payment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentBookings.map((b) => (
                                    <tr key={b._id}>
                                        <td>{b.stadiumId?.name || '—'}</td>
                                        <td>{b.userId?.name || '—'}</td>
                                        <td>{b.timeSlotId?.date || '—'}</td>
                                        <td>{b.timeSlotId ? `${b.timeSlotId.startTime}–${b.timeSlotId.endTime}` : '—'}</td>
                                        <td>${b.totalPrice}</td>
                                        <td>
                                            <span className={`badge ${b.bookingStatus === 'confirmed' ? 'badge-green' : b.bookingStatus === 'cancelled' ? 'badge-red' : 'badge-yellow'}`}>
                                                {b.bookingStatus}
                                            </span>
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
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
