import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container flex-between">
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">🏟️</span>
                    <span className="logo-text">Young <span>Stadiums</span></span>
                </Link>

                <div className="navbar-menu">
                    <div className="navbar-links">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/stadiums" className="nav-link">Stadiums</Link>
                        {user && <Link to="/my-bookings" className="nav-link">My Bookings</Link>}
                    </div>

                    <div className="navbar-auth">
                        {user ? (
                            <div className="navbar-user">
                                <span className="user-name">👋 {user.name}</span>
                                <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
                            </div>
                        ) : (
                            <div className="navbar-auth-btns">
                                <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
