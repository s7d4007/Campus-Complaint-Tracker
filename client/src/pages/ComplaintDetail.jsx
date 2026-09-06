import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatusTimeline from '../components/StatusTimeline';
import toast from 'react-hot-toast';
import { FiTrash2, FiSend, FiArrowLeft } from 'react-icons/fi';

const CATEGORY_ICONS = { infrastructure: '🏗️', hostel: '🏠', academics: '📚', canteen: '🍽️', transport: '🚌', safety: '⚠️', other: '📌' };
const STATUS_LABELS = { open: 'Open', in_progress: 'In Progress', resolved: 'Resolved', rejected: 'Rejected' };
const STATUSES = ['open', 'in_progress', 'resolved', 'rejected'];

export default function ComplaintDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [sending, setSending] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    const load = () =>
        api.get(`/api/complaints/${id}`).then(({ data }) => {
            setComplaint(data.complaint);
            setNewStatus(data.complaint.status);
        }).finally(() => setLoading(false));

    useEffect(() => { load(); }, [id]);

    const handleStatusUpdate = async () => {
        try {
            await api.patch(`/api/complaints/${id}/status`, { status: newStatus });
            toast.success('Status updated.');
            load();
        } catch { toast.error('Failed to update status.'); }
    };

    const handleDelete = async () => {
        if (!confirm('Delete this complaint?')) return;
        try {
            await api.delete(`/api/complaints/${id}`);
            toast.success('Complaint deleted.');
            navigate('/history');
        } catch (err) { toast.error(err.response?.data?.error || 'Delete failed.'); }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        setSending(true);
        try {
            const { data } = await api.post(`/api/complaints/${id}/comments`, { content: comment });
            setComplaint(prev => ({ ...prev, comments: [...(prev.comments || []), data.comment] }));
            setComment('');
        } catch { toast.error('Failed to post comment.'); }
        finally { setSending(false); }
    };

    if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><div className="card animate-pulse h-96" /></div>;
    if (!complaint) return <div className="max-w-4xl mx-auto px-4 py-8 text-gray-400">Complaint not found.</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {/* Back */}
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
                <FiArrowLeft size={16} /> Back
            </button>

            {/* Header card */}
            <div className="card">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl">{CATEGORY_ICONS[complaint.category]}</span>
                        <h1 className="text-xl font-bold text-white truncate">{complaint.title}</h1>
                    </div>
                    <span className={`badge-${complaint.status} flex-shrink-0`}>{STATUS_LABELS[complaint.status]}</span>
                </div>

                <p className="text-gray-300 leading-relaxed mb-4">{complaint.description}</p>

                <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-6">
                    <span className="capitalize">📂 {complaint.category}</span>
                    <span className="capitalize">🔺 {complaint.priority} priority</span>
                    <span>🗓 {new Date(complaint.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    {complaint.users && <span>👤 {complaint.users.name}</span>}
                </div>

                {/* Timeline */}
                <div className="overflow-x-auto pb-2">
                    <StatusTimeline status={complaint.status} />
                </div>

                {/* Assignment info */}
                {complaint.assignments?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-800 text-sm text-gray-400">
                        Assigned to: <span className="text-white font-medium">{complaint.assignments[0]?.assigned_to_user?.name}</span>
                    </div>
                )}

                {/* Admin status update */}
                {user.role === 'admin' && (
                    <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-3">
                        <select
                            className="input flex-1"
                            value={newStatus}
                            onChange={e => setNewStatus(e.target.value)}
                        >
                            {STATUSES.map(s => <option key={s} value={s} className="capitalize">{STATUS_LABELS[s]}</option>)}
                        </select>
                        <button onClick={handleStatusUpdate} className="btn-primary whitespace-nowrap">Update Status</button>
                    </div>
                )}

                {/* Delete */}
                {(user.role === 'admin' || (user.id === complaint.user_id && complaint.status === 'open')) && (
                    <div className="mt-3">
                        <button onClick={handleDelete} className="btn-danger flex items-center gap-2 text-sm py-2 px-4">
                            <FiTrash2 size={14} /> Delete Complaint
                        </button>
                    </div>
                )}
            </div>

            {/* Images */}
            {complaint.complaint_images?.length > 0 && (
                <div className="card">
                    <h2 className="font-semibold text-white mb-3">Attachments</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {complaint.complaint_images.map((img, i) => (
                            <a key={i} href={img.public_url} target="_blank" rel="noreferrer">
                                <img src={img.public_url} alt="attachment" className="w-full h-40 object-cover rounded-xl border border-gray-700 hover:opacity-80 transition-opacity" />
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Comments */}
            <div className="card">
                <h2 className="font-semibold text-white mb-4">Discussion</h2>
                <div className="space-y-3 mb-4">
                    {(!complaint.comments || complaint.comments.length === 0) && (
                        <p className="text-gray-500 text-sm">No comments yet. Be the first to add one.</p>
                    )}
                    {(complaint.comments || []).map(c => (
                        <div key={c.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {c.users?.name?.[0]?.toUpperCase()}
                            </div>
                            <div className="bg-gray-800 rounded-xl px-4 py-2.5 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium text-white">{c.users?.name}</span>
                                    <span className="text-xs text-gray-500 capitalize">{c.users?.role}</span>
                                    <span className="text-xs text-gray-600 ml-auto">{new Date(c.created_at).toLocaleDateString('en-IN')}</span>
                                </div>
                                <p className="text-gray-300 text-sm">{c.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Comment form */}
                <form onSubmit={handleComment} className="flex gap-2">
                    <input
                        type="text"
                        className="input flex-1"
                        placeholder="Add a comment…"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                    />
                    <button type="submit" disabled={sending || !comment.trim()} className="btn-primary flex items-center gap-2">
                        <FiSend size={14} /> {sending ? '…' : 'Send'}
                    </button>
                </form>
            </div>
        </div>
    );
}
