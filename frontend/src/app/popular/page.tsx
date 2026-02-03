import EmptyState from '@/components/common/EmptyState';

export default function PopularPage() {
    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">🔥 Trending Discussions</h1>
                <p className="text-gray-500 mt-2">
                    Most active posts across all campuses
                </p>
            </header>

            {/* Time filter tabs */}
            <div className="flex gap-2 mb-6">
                <FilterTab active>Today</FilterTab>
                <FilterTab>This Week</FilterTab>
                <FilterTab>This Month</FilterTab>
            </div>

            {/* Placeholder for now */}
            <EmptyState
                icon="🔥"
                title="No trending posts yet"
                description="Check back later to see what's hot on campus"
            />
        </div>
    );
}

function FilterTab({
    active = false,
    children
}: {
    active?: boolean;
    children: React.ReactNode;
}) {
    return (
        <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${active
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
        >
            {children}
        </button>
    );
}
