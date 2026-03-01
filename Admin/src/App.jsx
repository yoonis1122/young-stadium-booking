import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import AdminSidebar from './components/AdminSidebar/AdminSidebar';
import AdminLoginPage from './pages/AdminLoginPage/AdminLoginPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import StadiumsPage from './pages/StadiumsPage/StadiumsPage';
import TimeSlotsPage from './pages/TimeSlotsPage/TimeSlotsPage';
import BookingsPage from './pages/BookingsPage/BookingsPage';
import RevenuePage from './pages/RevenuePage/RevenuePage';
import UsersPage from './pages/UsersPage/UsersPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Layout wrapper: sidebar + content
const AdminLayout = () => {
    const { admin, loading } = useAdminAuth();
    if (loading) return <div className="loading"><div className="spinner" /></div>;
    if (!admin) return <Navigate to="/login" replace />;
    return (
        <div className="admin-layout">
            <AdminSidebar />
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
};

function App() {
    return (
        <AdminAuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<AdminLoginPage />} />
                    <Route element={<AdminLayout />}>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/stadiums" element={<StadiumsPage />} />
                        <Route path="/timeslots" element={<TimeSlotsPage />} />
                        <Route path="/bookings" element={<BookingsPage />} />
                        <Route path="/revenue" element={<RevenuePage />} />
                        <Route path="/users" element={<UsersPage />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <ToastContainer position="top-right" autoClose={3000} />
            </BrowserRouter>
        </AdminAuthProvider>
    );
}

export default App;
