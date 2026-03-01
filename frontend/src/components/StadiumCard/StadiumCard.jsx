import { Link } from 'react-router-dom';
import './StadiumCard.css';

const StadiumCard = ({ stadium }) => (
    <Link to={`/stadiums/${stadium._id}`} className="stadium-card">
        <div className="stadium-card-image">
            <img
                src={stadium.image || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600'}
                alt={stadium.name}
                onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=600';
                    e.target.onerror = null;
                }}
            />
            <div className="stadium-card-overlay">
                <span className="stadium-card-sizes">
                    {stadium.sizesAvailable?.length} sizes available
                </span>
            </div>
        </div>
        <div className="stadium-card-body">
            <h3 className="stadium-card-name">{stadium.name}</h3>
            <p className="stadium-card-location">📍 {stadium.location}</p>
            <p className="stadium-card-desc">{stadium.description?.slice(0, 80)}...</p>
            <div className="stadium-card-footer">
                <div className="stadium-card-sizes-list">
                    {stadium.sizesAvailable?.slice(0, 3).map((s) => (
                        <span key={s.label} className="badge badge-green">{s.label}</span>
                    ))}
                </div>
                <div className="stadium-card-price">
                    <span className="price-from">From</span>
                    <span className="price-amount">${stadium.pricePerHour}</span>
                    <span className="price-unit">/hr</span>
                </div>
            </div>
        </div>
    </Link>
);

export default StadiumCard;
