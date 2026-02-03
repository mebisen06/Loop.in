import EmptyState from '@/components/common/EmptyState';

export default function AnnouncementsPage() {
    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">📢 Campus Announcements</h1>
                <p className="text-gray-500 mt-2">
                    Official updates and news from your university
                </p>
            </header>

            {/* Filter by category */}
            <div className="flex gap-2 mb-6">
                <CategoryPill active>All</CategoryPill>
                <CategoryPill>Academic</CategoryPill>
                <CategoryPill>Events</CategoryPill>
                <CategoryPill>Administrative</CategoryPill>
            </div>

            {/* Empty state */}
            <EmptyState
                icon="📢"
                title="No announcements yet"
                description="Check back later for official campus updates and important notices"
            />
        </div>
    );
}

function CategoryPill({
    active = false,
    children
}: {
    active?: boolean;
    children: React.ReactNode;
}) {
    return (
        <span
            className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors ${active
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
        >
            {children}
        </span>
    );
}
