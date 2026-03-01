import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
    <footer className="footer">
        <div className="container">
            <div className="footer-grid">
                <div className="footer-brand">
                    <div className="footer-logo">🏟️ Young <span>Stadiums</span></div>
                    <p>Your favorite mini-stadium booking platform. Book anytime, play anytime.</p>
                </div>
                <div className="footer-col">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/stadiums">Browse Stadiums</Link></li>
                        <li><Link to="/my-bookings">My Bookings</Link></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Account</h4>
                    <ul>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Contact</h4>
                    <ul>
                        <li>📧 support@youngstadiums.com</li>
                        <li>📱 +966 50 000 0000</li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2025 Young Stadiums. All rights reserved.</p>
            </div>
        </div>
    </footer>
);

export default Footer;
