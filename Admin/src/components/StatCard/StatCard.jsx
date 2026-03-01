import './StatCard.css';

const StatCard = ({ icon, label, value, sub, color = 'green' }) => (
    <div className={`stat-card stat-card-${color}`}>
        <div className="stat-card-icon">{icon}</div>
        <div className="stat-card-body">
            <div className="stat-card-value">{value}</div>
            <div className="stat-card-label">{label}</div>
            {sub && <div className="stat-card-sub">{sub}</div>}
        </div>
    </div>
);

export default StatCard;
