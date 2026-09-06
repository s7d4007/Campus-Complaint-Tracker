import { useEffect, useState } from 'react';
import api from '../api/axios';
import ComplaintCard from '../components/ComplaintCard';

export default function ComplaintHistory() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/api/complaints').then(({ data }) => {
            setComplaints(data.complaints);
        }).finally(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Complaint History</h1>
                    <p className="text-gray-400 mt-1">All complaints you've submitted.</p>
                </div>
            </div>

            {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => <div key={i} className="card animate-pulse h-40 bg-gray-800" />)}
                </div>
            ) : complaints.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-gray-400">No complaints found.</p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {complaints.map(c => <ComplaintCard key={c.id} complaint={c} />)}
                </div>
            )}
        </div>
    );
}
