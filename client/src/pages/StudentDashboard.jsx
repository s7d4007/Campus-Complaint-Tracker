import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ComplaintCard from '../components/ComplaintCard';
import { FiPlusCircle, FiInbox, FiCheckCircle, FiClock, FiAlertTriangle } from 'react-icons/fi';

const StatCard = ({ label, value, Icon, color }) => (
    <div className="card flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon size={22} className="text-white" />
        </div>
        <div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-sm text-gray-400">{label}</p>
        </div>
    </div>
);

export default function StudentDashboard() {
    const { user } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/api/complaints').then(({ data }) => {
            setComplaints(data.complaints);
        }).finally(() => setLoading(false));
    }, []);

    const stats = {
        total: complaints.length,
        open: complaints.filter(c => c.status === 'open').length,
        in_progress: complaints.filter(c => c.status === 'in_progress').length,
        resolved: complaints.filter(c => c.status === 'resolved').length,
    };

    const recent = complaints.slice(0, 3);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {/* Welcome */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        Hello, <span className="gradient-text">{user.name}</span> 👋
                    </h1>
                    <p className="text-gray-400 mt-1">Here's an overview of your complaints.</p>
                </div>
                <Link to="/complaints/new" className="btn-primary flex items-center gap-2 self-start sm:self-auto">
                    <FiPlusCircle size={18} /> New Complaint
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total" value={stats.total} Icon={FiInbox} color="bg-gray-700" />
                <StatCard label="Open" value={stats.open} Icon={FiClock} color="bg-blue-600" />
                <StatCard label="In Progress" value={stats.in_progress} Icon={FiAlertTriangle} color="bg-yellow-600" />
                <StatCard label="Resolved" value={stats.resolved} Icon={FiCheckCircle} color="bg-green-600" />
            </div>

            {/* Recent complaints */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Recent Complaints</h2>
                <Link to="/history" className="text-sm text-primary-400 hover:text-primary-300">View all →</Link>
            </div>

            {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="card animate-pulse h-40 bg-gray-800" />
                    ))}
                </div>
            ) : recent.length === 0 ? (
                <div className="card text-center py-16">
                    <FiInbox size={40} className="mx-auto text-gray-600 mb-3" />
                    <p className="text-gray-400 font-medium">No complaints yet</p>
                    <p className="text-gray-600 text-sm mt-1 mb-4">Submit your first complaint to get started.</p>
                    <Link to="/complaints/new" className="btn-primary inline-flex items-center gap-2">
                        <FiPlusCircle size={16} /> Submit Complaint
                    </Link>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recent.map(c => <ComplaintCard key={c.id} complaint={c} />)}
                </div>
            )}
        </div>
    );
}
