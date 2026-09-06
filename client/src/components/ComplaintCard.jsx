import { Link } from 'react-router-dom';
import { FiClock } from 'react-icons/fi';

const STATUS_LABELS = {
    open: 'Open',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    rejected: 'Rejected',
};

const PRIORITY_COLORS = {
    low: 'text-gray-400  bg-gray-800',
    medium: 'text-blue-400  bg-blue-900/30',
    high: 'text-orange-400 bg-orange-900/30',
    urgent: 'text-red-400   bg-red-900/30',
};

const CATEGORY_ICONS = {
    infrastructure: '🏗️', hostel: '🏠', academics: '📚',
    canteen: '🍽️', transport: '🚌', safety: '⚠️', other: '📌',
};

export default function ComplaintCard({ complaint }) {
    const statusClass = `badge-${complaint.status}`;
    const priorityClass = PRIORITY_COLORS[complaint.priority] || 'text-gray-400 bg-gray-800';

    return (
        <Link to={`/complaints/${complaint.id}`} className="block group">
            <div className="card hover:border-primary-500/50 hover:shadow-primary-500/10 hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl flex-shrink-0">{CATEGORY_ICONS[complaint.category] || '📌'}</span>
                        <h3 className="font-semibold text-white truncate group-hover:text-primary-400 transition-colors">
                            {complaint.title}
                        </h3>
                    </div>
                    <span className={statusClass}>{STATUS_LABELS[complaint.status]}</span>
                </div>

                <p className="text-gray-400 text-sm line-clamp-2 mb-4">{complaint.description}</p>

                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${priorityClass}`}>
                            {complaint.priority}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">{complaint.category}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <FiClock size={12} />
                        {new Date(complaint.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                </div>

                {complaint.complaint_images?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-800">
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {complaint.complaint_images.slice(0, 3).map((img, i) => (
                                <img
                                    key={i}
                                    src={img.public_url}
                                    alt="attachment"
                                    className="h-14 w-14 object-cover rounded-lg border border-gray-700 flex-shrink-0"
                                />
                            ))}
                            {complaint.complaint_images.length > 3 && (
                                <div className="h-14 w-14 rounded-lg border border-gray-700 bg-gray-800 flex items-center justify-center text-xs text-gray-400 flex-shrink-0">
                                    +{complaint.complaint_images.length - 3}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
}
