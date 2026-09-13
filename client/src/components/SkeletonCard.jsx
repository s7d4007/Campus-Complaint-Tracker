export default function SkeletonCard() {
    return (
        <div className="card animate-pulse flex flex-col gap-4 border border-gray-800/50 bg-gray-900/50">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-800 rounded-lg"></div>
                <div className="h-5 bg-gray-800 rounded flex-1"></div>
                <div className="w-16 h-5 bg-gray-800 rounded-full"></div>
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-800 rounded w-full"></div>
                <div className="h-4 bg-gray-800 rounded w-5/6"></div>
            </div>
            <div className="flex items-center gap-2 mt-auto pt-2">
                <div className="w-12 h-4 bg-gray-800 rounded-full"></div>
                <div className="w-16 h-4 bg-gray-800 rounded-full"></div>
                <div className="ml-auto w-24 h-4 bg-gray-800 rounded"></div>
            </div>
        </div>
    );
}
