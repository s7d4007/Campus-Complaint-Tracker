import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    FiBell, FiMenu, FiX, FiHome, FiPlusCircle,
    FiList, FiLogOut, FiUser, FiSettings
} from 'react-icons/fi';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) return;
        api.get('/api/notifications').then(({ data }) => {
            setUnreadCount(data.notifications.filter(n => !n.is_read).length);
        }).catch(() => { });
    }, [user, location.pathname]);

    const handleLogout = () => { logout(); navigate('/login'); };

    const navLink = (to, label, Icon) => (
        <Link
            to={to}
            onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === to
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
        >
            <Icon size={16} /> {label}
        </Link>
    );

    if (!user) return null;

    return (
        <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
                {/* Logo */}
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-sm">CC</div>
                    <span className="font-bold text-white hidden sm:block">Campus<span className="gradient-text">Tracker</span></span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {user.role === 'admin' ? (
                        <>
                            {navLink('/admin', 'Dashboard', FiHome)}
                            {navLink('/admin/complaints', 'Complaints', FiList)}
                        </>
                    ) : (
                        <>
                            {navLink('/dashboard', 'Dashboard', FiHome)}
                            {navLink('/complaints/new', 'Submit', FiPlusCircle)}
                            {navLink('/history', 'History', FiList)}
                        </>
                    )}
                </div>

                {/* Right icons */}
                <div className="flex items-center gap-2">
                    <Link to="/notifications" className="relative p-2 text-gray-400 hover:text-white transition-colors">
                        <FiBell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </Link>
                    <div className="hidden md:flex items-center gap-2 pl-2 border-l border-gray-800">
                        <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
                            {user.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-300 hidden lg:block">{user.name}</span>
                    </div>
                    <button onClick={handleLogout} className="hidden md:flex items-center gap-1.5 text-gray-400 hover:text-red-400 text-sm transition-colors ml-1">
                        <FiLogOut size={16} />
                    </button>
                    <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-400 hover:text-white">
                        {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-gray-800 bg-gray-950 px-4 py-3 flex flex-col gap-1">
                    {user.role === 'admin' ? (
                        <>
                            {navLink('/admin', 'Dashboard', FiHome)}
                            {navLink('/admin/complaints', 'Complaints', FiList)}
                        </>
                    ) : (
                        <>
                            {navLink('/dashboard', 'Dashboard', FiHome)}
                            {navLink('/complaints/new', 'Submit Complaint', FiPlusCircle)}
                            {navLink('/history', 'My History', FiList)}
                        </>
                    )}
                    {navLink('/notifications', 'Notifications', FiBell)}
                    <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-red-400 text-sm font-medium">
                        <FiLogOut size={16} /> Logout
                    </button>
                </div>
            )}
        </nav>
    );
}
