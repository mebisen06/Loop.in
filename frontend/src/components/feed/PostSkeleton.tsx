import SkeletonLoader from '@/components/common/SkeletonLoader';

interface PostSkeletonProps {
    count?: number;
}

/**
 * Skeleton loader for post cards
 * Shows a loading placeholder while posts are being fetched
 */
export default function PostSkeleton({ count = 1 }: PostSkeletonProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="bg-white p-5 rounded-md border border-slate-200 space-y-4"
                >
                    {/* Author section */}
                    <div className="flex items-center space-x-3">
                        <SkeletonLoader className="w-8 h-8 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <SkeletonLoader className="h-4 w-32" />
                            <SkeletonLoader className="h-3 w-24" />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="py-1">
                        <SkeletonLoader className="h-8 w-3/4 rounded-md" />
                    </div>

                    {/* Content lines */}
                    <div className="space-y-2">
                        <SkeletonLoader className="h-4 w-full" />
                        <SkeletonLoader className="h-4 w-5/6" />
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2">
                        <SkeletonLoader className="h-6 w-20 rounded" />
                        <SkeletonLoader className="h-6 w-16 rounded" />
                    </div>

                    {/* Actions footer */}
                    <div className="pt-3 border-t border-slate-100 flex gap-4">
                        <SkeletonLoader className="h-7 w-14" />
                        <SkeletonLoader className="h-7 w-20" />
                    </div>
                </div>
            ))}
        </>
    );
}
