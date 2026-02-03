import { ReactNode } from 'react';

interface EmptyStateProps {
    icon?: string;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

/**
 * Generic empty state component for when there's no data to display
 * 
 * @example
 * <EmptyState
 *   icon="📭"
 *   title="No posts yet"
 *   description="Be the first to start a discussion"
 *   action={{ label: "Create Post", onClick: handleCreate }}
 * />
 */
export default function EmptyState({
    icon,
    title,
    description,
    action
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {icon && <div className="text-5xl mb-4">{icon}</div>}
            <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
            <p className="text-sm text-slate-600 max-w-md mb-6">{description}</p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-5 py-2.5 bg-blue-700 text-white text-sm font-medium rounded-md hover:bg-blue-800 active:bg-blue-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
