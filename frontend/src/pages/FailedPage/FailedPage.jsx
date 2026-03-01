import { Link } from 'react-router-dom';
import '../SuccessPage/SuccessPage.css';
import './FailedPage.css';

const FailedPage = () => (
    <div className="result-page">
        <div className="result-card">
            <div className="result-icon error-icon">❌</div>
            <h1>Payment Failed</h1>
            <p>Your payment was not completed or was declined. Your reservation has been released. Don't worry — you can try again anytime!</p>
            <div className="result-actions">
                <Link to="/stadiums" className="btn btn-primary">Try Again</Link>
                <Link to="/" className="btn btn-outline">Go Home</Link>
            </div>
        </div>
    </div>
);

export default FailedPage;
