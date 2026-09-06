import { FiCheckCircle, FiClock, FiAlertCircle, FiXCircle } from 'react-icons/fi';

const STEPS = [
    { key: 'open', label: 'Submitted', Icon: FiClock, color: 'text-blue-400', bg: 'bg-blue-500' },
    { key: 'in_progress', label: 'In Progress', Icon: FiAlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-500' },
    { key: 'resolved', label: 'Resolved', Icon: FiCheckCircle, color: 'text-green-400', bg: 'bg-green-500' },
];

const REJECTED_STEP = { key: 'rejected', label: 'Rejected', Icon: FiXCircle, color: 'text-red-400', bg: 'bg-red-500' };

export default function StatusTimeline({ status }) {
    const isRejected = status === 'rejected';
    const steps = isRejected
        ? [STEPS[0], REJECTED_STEP]
        : STEPS;

    const currentIdx = steps.findIndex(s => s.key === status);

    return (
        <div className="flex items-center gap-0">
            {steps.map((step, idx) => {
                const isDone = idx < currentIdx || (idx === currentIdx);
                const isCurrent = idx === currentIdx;
                const { Icon } = step;

                return (
                    <div key={step.key} className="flex items-center">
                        <div className={`flex flex-col items-center ${idx < steps.length - 1 ? 'flex-1' : ''}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                ${isDone
                                    ? `${step.bg} border-transparent text-white`
                                    : 'bg-gray-800 border-gray-700 text-gray-500'}
                ${isCurrent ? 'ring-4 ring-offset-2 ring-offset-gray-900 ring-opacity-50 ' + step.bg.replace('bg-', 'ring-') : ''}
              `}>
                                <Icon size={18} />
                            </div>
                            <span className={`mt-1.5 text-xs font-medium whitespace-nowrap ${isDone ? step.color : 'text-gray-600'}`}>
                                {step.label}
                            </span>
                        </div>
                        {idx < steps.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-2 mb-4 rounded ${idx < currentIdx ? step.bg : 'bg-gray-800'}`} style={{ minWidth: 32 }} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
