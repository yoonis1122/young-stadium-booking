import { useEffect, useState } from 'react';
import API from '../../api/api';
import StatCard from '../../components/StatCard/StatCard';
import './RevenuePage.css';

const RevenuePage = () => {
    const [bookings, setBookings] = useState([]);
    const [stadiums, setStadiums] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([API.get('/bookings'), API.get('/stadiums/admin/all')]).then(([bRes, sRes]) => {
            setBookings(bRes.data.filter((b) => b.paymentStatus === 'paid'));
            setStadiums(sRes.data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="loading"><div className="spinner" /></div>;

    const totalRevenue = bookings.reduce((s, b) => s + b.totalPrice, 0);

    // Monthly revenue
    const monthlyMap = {};
    bookings.forEach((b) => {
        const month = new Date(b.createdAt).toLocaleString('default', { year: 'numeric', month: 'short' });
        monthlyMap[month] = (monthlyMap[month] || 0) + b.totalPrice;
    });
    const monthly = Object.entries(monthlyMap).sort().reverse();

    // Per stadium revenue
    const stadiumMap = {};
    bookings.forEach((b) => {
        const name = b.stadiumId?.name || 'Unknown';
        stadiumMap[name] = (stadiumMap[name] || 0) + b.totalPrice;
    });
    const perStadium = Object.entries(stadiumMap).sort((a, b) => b[1] - a[1]);

    return (
        <div>
            <div className="page-header">
                <div><h1>Revenue</h1><p>Financial overview of your platform</p></div>
            </div>

            <div className="revenue-stats">
                <StatCard icon="💰" label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} sub={`${bookings.length} paid bookings`} color="green" />
                <StatCard icon="📅" label="This Month" value={`$${(monthlyMap[new Date().toLocaleString('default', { year: 'numeric', month: 'short' })] || 0).toLocaleString()}`} color="blue" />
                <StatCard icon="🏟️" label="Stadiums Earning" value={perStadium.length} color="yellow" />
            </div>

            <div className="revenue-grid">
                <div className="card">
                    <h2 style={{ marginBottom: 20 }}>Monthly Revenue</h2>
                    {monthly.length === 0 ? (
                        <p className="text-muted">No data yet.</p>
                    ) : (
                        <div className="table-wrapper">
                            <table>
                                <thead><tr><th>Month</th><th>Revenue</th></tr></thead>
                                <tbody>
                                    {monthly.map(([month, rev]) => (
                                        <tr key={month}>
                                            <td>{month}</td>
                                            <td><strong style={{ color: 'var(--success)' }}>${rev.toLocaleString()}</strong></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="card">
                    <h2 style={{ marginBottom: 20 }}>Revenue per Stadium</h2>
                    {perStadium.length === 0 ? (
                        <p className="text-muted">No data yet.</p>
                    ) : (
                        <div className="stadium-revenue-list">
                            {perStadium.map(([name, rev], i) => (
                                <div key={name} className="stadium-revenue-row">
                                    <div className="stadium-revenue-rank">#{i + 1}</div>
                                    <div className="stadium-revenue-name">{name}</div>
                                    <div className="stadium-revenue-bar-wrap">
                                        <div className="stadium-revenue-bar" style={{ width: `${(rev / perStadium[0][1]) * 100}%` }} />
                                    </div>
                                    <div className="stadium-revenue-value">${rev.toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RevenuePage;
