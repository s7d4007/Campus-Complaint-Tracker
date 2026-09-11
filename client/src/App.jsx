import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import api from './api/axios';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import ComplaintDetail from './pages/ComplaintDetail';
import ComplaintHistory from './pages/ComplaintHistory';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';
import AdminComplaints from './pages/AdminComplaints';
import Settings from './pages/Settings';
import Welcome from './pages/Welcome';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
    }
    return children;
};

export default function App() {
    const { user } = useAuth();

    // Silently wake up Render's free-tier instance on app load.
    // By the time the user fills in the form, the server is already warm.
    useEffect(() => {
        api.get('/health').catch(() => { }); // fire-and-forget, ignore errors
    }, []);

    return (
        <BrowserRouter>
            {user && <Navbar />}
            <Routes>
                <Route path="/" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace /> : <Welcome />} />

                {/* Public */}
                <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
                <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />

                {/* Protected - Both */}
                <Route path="/complaints/:id" element={<ProtectedRoute><ComplaintDetail /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

                {/* Protected - Student */}
                <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
                <Route path="/complaints/new" element={<ProtectedRoute allowedRoles={['student']}><SubmitComplaint /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute allowedRoles={['student']}><ComplaintHistory /></ProtectedRoute>} />

                {/* Protected - Admin */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/complaints" element={<ProtectedRoute allowedRoles={['admin']}><AdminComplaints /></ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    );
}
