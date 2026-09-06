import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { FiBell, FiCheck } from 'react-icons/fi';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = () => {
        api.get('/api/notifications').then(({ data }) => setNotifications(data.notifications)).finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const markRead = async (id) => {
        try {
            await api.patch(`/api/notifications/${id}/read`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch { }
    };

    const markAllRead = async () => {
        try {
            await api.patch('/api/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        } catch { }
    };

    if (loading) return <div className="max-w-3xl mx-auto px-4 py-8"><div className="card animate-pulse h-40" /></div>;

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FiBell /> Notifications
                </h1>
                {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
                        <FiCheck size={14} /> Mark all read
                    </button>
                )}
            </div>

            <div className="card divide-y divide-gray-800 p-0 overflow-hidden">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No notifications yet.</div>
                ) : (
                    notifications.map(n => (
                        <div key={n.id} className={`p-4 flex gap-4 transition-colors hover:bg-gray-800/50 ${!n.is_read ? 'bg-primary-900/10' : ''}`}>
                            <div className="mt-1">
                                <div className={`w-2 h-2 rounded-full ${!n.is_read ? 'bg-primary-500' : 'bg-transparent'}`} />
                            </div>
                            <div className="flex-1">
                                <p className={`text-sm ${!n.is_read ? 'text-white font-medium' : 'text-gray-400'}`}>{n.message}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs">
                                    <span className="text-gray-500">{new Date(n.created_at).toLocaleString()}</span>
                                    {n.complaint_id && (
                                        <Link to={`/complaints/${n.complaint_id}`} className="text-primary-400 hover:underline">View Complaint</Link>
                                    )}
                                </div>
                            </div>
                            {!n.is_read && (
                                <button onClick={() => markRead(n.id)} className="text-gray-500 hover:text-white px-2" title="Mark as read">
                                    <FiCheck size={18} />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
