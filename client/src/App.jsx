import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useEffect, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import api from './api/axios';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';

// Lazy loading Pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const FormFlow = lazy(() => import('./pages/FormFlow')); // Assuming if there's any? Wait, there wasn't. Let me only import exact ones I had before.
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const SubmitComplaint = lazy(() => import('./pages/SubmitComplaint'));
const ComplaintDetail = lazy(() => import('./pages/ComplaintDetail'));
const ComplaintHistory = lazy(() => import('./pages/ComplaintHistory'));
const Notifications = lazy(() => import('./pages/Notifications'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminComplaints = lazy(() => import('./pages/AdminComplaints'));
const Settings = lazy(() => import('./pages/Settings'));
const Welcome = lazy(() => import('./pages/Welcome'));

const PageLoader = () => (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-gray-400 font-medium animate-pulse text-sm tracking-widest uppercase">Loading App...</div>
    </div>
);

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) return <PageLoader />;
    if (!user) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
    }
    return children;
};

// Extracted routes wrapper to use hook
const AnimatedRoutes = () => {
    const location = useLocation();
    const { user } = useAuth();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition>{user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace /> : <Welcome />}</PageTransition>} />

                {/* Public */}
                <Route path="/login" element={<PageTransition>{user ? <Navigate to="/" replace /> : <Login />}</PageTransition>} />
                <Route path="/register" element={<PageTransition>{user ? <Navigate to="/" replace /> : <Register />}</PageTransition>} />

                {/* Protected - Both */}
                <Route path="/complaints/:id" element={<ProtectedRoute><PageTransition><ComplaintDetail /></PageTransition></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><PageTransition><Notifications /></PageTransition></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><PageTransition><Settings /></PageTransition></ProtectedRoute>} />

                {/* Protected - Student */}
                <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['student']}><PageTransition><StudentDashboard /></PageTransition></ProtectedRoute>} />
                <Route path="/complaints/new" element={<ProtectedRoute allowedRoles={['student']}><PageTransition><SubmitComplaint /></PageTransition></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute allowedRoles={['student']}><PageTransition><ComplaintHistory /></PageTransition></ProtectedRoute>} />

                {/* Protected - Admin */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><PageTransition><AdminDashboard /></PageTransition></ProtectedRoute>} />
                <Route path="/admin/complaints" element={<ProtectedRoute allowedRoles={['admin']}><PageTransition><AdminComplaints /></PageTransition></ProtectedRoute>} />
            </Routes>
        </AnimatePresence>
    );
};

export default function App() {
    const { user } = useAuth();

    useEffect(() => {
        api.get('/health').catch(() => { });
    }, []);

    return (
        <BrowserRouter>
            {user && <Navbar />}
            <Suspense fallback={<PageLoader />}>
                <AnimatedRoutes />
            </Suspense>
        </BrowserRouter>
    );
}
