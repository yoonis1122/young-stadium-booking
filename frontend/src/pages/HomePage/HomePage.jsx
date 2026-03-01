import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/api';
import StadiumCard from '../../components/StadiumCard/StadiumCard';
import './HomePage.css';

const HomePage = () => {
    const [stadiums, setStadiums] = useState([]);

    useEffect(() => {
        API.get('/stadiums').then(({ data }) => setStadiums(data.slice(0, 3)));
    }, []);

    return (
        <div className="home-page">
            {/* Hero */}
            <section className="hero">
                <div className="hero-bg">
                    <div className="hero-orb hero-orb-1" />
                    <div className="hero-orb hero-orb-2" />
                </div>
                <div className="container hero-content">
                    <div className="hero-badge">⚽ Premier Booking Platform</div>
                    <h1 className="hero-title">
                        Book Your <span className="gradient-text">Perfect Stadium</span><br />In Minutes
                    </h1>
                    <p className="hero-subtitle">
                        Choose your size, pick your time, pay securely. Your next football game starts here.
                    </p>
                    <div className="hero-actions">
                        <Link to="/stadiums" className="btn btn-primary btn-lg">Browse Stadiums</Link>
                        <Link to="/register" className="btn btn-outline btn-lg">Create Account</Link>
                    </div>
                    <div className="hero-stats">
                        <div className="stat"><strong>50+</strong><span>Stadiums</span></div>
                        <div className="stat-divider" />
                        <div className="stat"><strong>2K+</strong><span>Bookings</span></div>
                        <div className="stat-divider" />
                        <div className="stat"><strong>4.9★</strong><span>Rating</span></div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="section">
                <div className="container">
                    <div className="text-center" style={{ marginBottom: 48 }}>
                        <h2 className="section-title">Why <span className="text-green">Young Stadiums?</span></h2>
                        <p className="section-subtitle">Everything you need for a seamless booking experience</p>
                    </div>
                    <div className="features-grid">
                        {[
                            { icon: '⚡', title: 'Instant Booking', desc: 'Reserve your slot in under 2 minutes. No waiting, no phone calls.' },
                            { icon: '🔒', title: 'Secure Payments', desc: 'Powered by Stripe. Your payment is always safe and encrypted.' },
                            { icon: '📅', title: 'Flexible Scheduling', desc: 'Choose any available date and time slot that works for you.' },
                            { icon: '⚽', title: 'Multiple Sizes', desc: 'From 3+GK to 5+GK — find the perfect pitch for your team size.' },
                            { icon: '📱', title: 'Easy Management', desc: 'Track all your bookings in your personal dashboard.' },
                            { icon: '🏆', title: 'Premium Facilities', desc: 'Top-quality turf, lighting, and changing rooms at every stadium.' },
                        ].map((f) => (
                            <div key={f.title} className="feature-card">
                                <div className="feature-icon">{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Stadiums */}
            {stadiums.length > 0 && (
                <section className="section featured-section">
                    <div className="container">
                        <div className="flex-between" style={{ marginBottom: 40 }}>
                            <div>
                                <h2 className="section-title">Featured <span className="text-green">Stadiums</span></h2>
                                <p className="section-subtitle">Top picks near you</p>
                            </div>
                            <Link to="/stadiums" className="btn btn-outline">View All →</Link>
                        </div>
                        <div className="grid-3">
                            {stadiums.map((s) => <StadiumCard key={s._id} stadium={s} />)}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <h2>Ready to Play?</h2>
                        <p>Join thousands of players booking their perfect stadium every week.</p>
                        <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
