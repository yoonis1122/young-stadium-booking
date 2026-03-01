import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import './AdminSidebar.css';

const links = [
    { to: '/', icon: '📊', label: 'Dashboard' },
    { to: '/stadiums', icon: '🏟️', label: 'Stadiums' },
    { to: '/timeslots', icon: '🕐', label: 'Time Slots' },
    { to: '/bookings', icon: '📅', label: 'Bookings' },
    { to: '/revenue', icon: '💰', label: 'Revenue' },
    { to: '/users', icon: '👤', label: 'Users' },
];

const AdminSidebar = () => {
    const { admin, logout } = useAdminAuth();
    const navigate = useNavigate();

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-logo">
                <span className="logo-icon">🏟️</span>
                <div>
                    <span className="logo-title">Young</span>
                    <span className="logo-sub">Admin Panel</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.to === '/'}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <span className="sidebar-icon">{link.icon}</span>
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-admin-info">
                    <div className="admin-avatar">{admin?.name?.[0] || 'A'}</div>
                    <div>
                        <div className="admin-name">{admin?.name}</div>
                        <div className="admin-email">{admin?.email}</div>
                    </div>
                </div>
                <button className="sidebar-logout" onClick={handleLogout}>Logout</button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
