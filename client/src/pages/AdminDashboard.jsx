import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { FiTrendingUp, FiActivity, FiTag, FiAlertCircle } from 'react-icons/fi';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const StatCard = ({ label, value, Icon, color }) => (
    <div className="card flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}><Icon size={22} className="text-white" /></div>
        <div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-sm text-gray-400">{label}</p>
        </div>
    </div>
);

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/api/admin/analytics').then(res => setData(res.data)).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="max-w-7xl mx-auto px-4 py-8"><div className="card animate-pulse h-96 bg-gray-800" /></div>;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#9ca3af' } } },
        scales: {
            x: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' } },
            y: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' } }
        }
    };

    const dougnutOptions = { ...chartOptions, scales: undefined };

    const byCategoryData = {
        labels: Object.keys(data.byCategory),
        datasets: [{
            data: Object.values(data.byCategory),
            backgroundColor: ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#3b82f6', '#6b7280'],
            borderWidth: 0,
        }]
    };

    const byStatusData = {
        labels: Object.keys(data.byStatus).map(s => s.replace('_', ' ')),
        datasets: [{
            label: 'Complaints',
            data: Object.values(data.byStatus),
            backgroundColor: '#6366f1',
            borderRadius: 6,
        }]
    };

    const trendData = {
        labels: data.trend.map(t => t.date),
        datasets: [{
            label: 'Complaints per Day',
            data: data.trend.map(t => t.count),
            borderColor: '#10b981',
            backgroundColor: '#10b98133',
            fill: true,
            tension: 0.4
        }]
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-gray-400">System overview and analytics.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total Complaints" value={data.total} Icon={FiActivity} color="bg-primary-600" />
                <StatCard label="Open" value={data.byStatus.open || 0} Icon={FiAlertCircle} color="bg-blue-600" />
                <StatCard label="In Progress" value={data.byStatus.in_progress || 0} Icon={FiTrendingUp} color="bg-yellow-600" />
                <StatCard label="Resolved" value={data.byStatus.resolved || 0} Icon={FiTag} color="bg-green-600" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
                <div className="card h-80 flex flex-col">
                    <h2 className="font-semibold text-white mb-4">Complaints Over Time</h2>
                    <div className="flex-1 min-h-0"><Line data={trendData} options={chartOptions} /></div>
                </div>
                <div className="card h-80 flex flex-col">
                    <h2 className="font-semibold text-white mb-4">Complaints by Status</h2>
                    <div className="flex-1 min-h-0"><Bar data={byStatusData} options={chartOptions} /></div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="card h-80 flex flex-col lg:col-span-1">
                    <h2 className="font-semibold text-white mb-4">By Category</h2>
                    <div className="flex-1 min-h-0"><Doughnut data={byCategoryData} options={dougnutOptions} /></div>
                </div>
                <div className="card h-80 flex flex-col lg:col-span-2">
                    <h2 className="font-semibold text-white mb-4">By Priority</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                        {['low', 'medium', 'high', 'urgent'].map(p => (
                            <div key={p} className="bg-gray-800 rounded-xl p-4 text-center">
                                <span className="text-2xl font-bold text-white block mb-1">{data.byPriority[p] || 0}</span>
                                <span className="text-xs text-gray-400 uppercase tracking-wider">{p}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
