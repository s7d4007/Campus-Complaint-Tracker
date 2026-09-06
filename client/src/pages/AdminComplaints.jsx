import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function AdminComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ status: '', category: '', search: '' });

    const fetchComplaints = () => {
        let query = '/api/admin/complaints?';
        if (filters.status) query += `status=${filters.status}&`;
        if (filters.category) query += `category=${filters.category}&`;
        if (filters.search) query += `search=${filters.search}&`;

        api.get(query).then(({ data }) => setComplaints(data.complaints)).finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchComplaints();
        api.get('/api/admin/users').then(({ data }) => setAdmins(data.users));
    }, [filters]);

    const handleAssign = async (complaintId, adminId) => {
        if (!adminId) return;
        try {
            await api.post(`/api/admin/complaints/${complaintId}/assign`, { assigned_to: adminId });
            toast.success('Assigned & marked In Progress');
            fetchComplaints();
        } catch {
            toast.error('Failed to assign.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-4">All Complaints</h1>
                <div className="flex flex-wrap gap-4">
                    <input
                        type="text" placeholder="Search title..." className="input max-w-xs"
                        value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })}
                    />
                    <select className="input max-w-[200px]" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
                        <option value="">All Statuses</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <select className="input max-w-[200px]" value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}>
                        <option value="">All Categories</option>
                        <option value="infrastructure">Infrastructure</option>
                        <option value="hostel">Hostel</option>
                        <option value="academics">Academics</option>
                    </select>
                </div>
            </div>

            <div className="card overflow-x-auto p-0">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-800/50 text-gray-400 text-sm border-b border-gray-700 font-medium">
                            <th className="py-3 px-4">Title / Category</th>
                            <th className="py-3 px-4">Student</th>
                            <th className="py-3 px-4">Status & Priority</th>
                            <th className="py-3 px-4">Assigned To</th>
                            <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {complaints.length === 0 ? (
                            <tr><td colSpan="5" className="py-8 text-center text-gray-500">No complaints found.</td></tr>
                        ) : (
                            complaints.map(c => (
                                <tr key={c.id} className="hover:bg-gray-800/30 transition-colors">
                                    <td className="py-3 px-4">
                                        <p className="font-medium text-white max-w-[200px] truncate">{c.title}</p>
                                        <p className="text-xs text-gray-500 capitalize">{c.category}</p>
                                    </td>
                                    <td className="py-3 px-4">
                                        <p className="text-sm text-gray-300">{c.users.name}</p>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex flex-col items-start gap-1">
                                            <span className={`badge-${c.status}`}>{c.status.replace('_', ' ')}</span>
                                            <span className={`text-xs uppercase font-medium priority-${c.priority}`}>{c.priority}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <select
                                            className="bg-gray-800 border border-gray-700 text-sm text-white rounded-lg px-2 py-1 outline-none"
                                            value={c.assignments?.[0]?.assigned_to_user?.id || ''}
                                            onChange={(e) => handleAssign(c.id, e.target.value)}
                                        >
                                            <option value="">Unassigned</option>
                                            {admins.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                        </select>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <Link to={`/complaints/${c.id}`} className="text-sm text-primary-400 hover:text-primary-300 font-medium">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
