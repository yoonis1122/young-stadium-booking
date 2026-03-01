import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import StadiumsPage from './pages/StadiumsPage/StadiumsPage';
import StadiumDetailsPage from './pages/StadiumDetailsPage/StadiumDetailsPage';
import BookingPage from './pages/BookingPage/BookingPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import MyBookingsPage from './pages/MyBookingsPage/MyBookingsPage';
import SuccessPage from './pages/SuccessPage/SuccessPage';
import FailedPage from './pages/FailedPage/FailedPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="loading"><div className="spinner" /></div>;
    return user ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => (
    <>
        <Navbar />
        <main>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/stadiums" element={<StadiumsPage />} />
                <Route path="/stadiums/:id" element={<StadiumDetailsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/failed" element={<FailedPage />} />
                <Route
                    path="/book/:stadiumId"
                    element={<ProtectedRoute><BookingPage /></ProtectedRoute>}
                />
                <Route
                    path="/my-bookings"
                    element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>}
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </main>
        <Footer />
    </>
);

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
                <ToastContainer position="top-right" autoClose={3000} />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
