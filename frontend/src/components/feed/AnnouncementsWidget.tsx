'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import { getCampusNews } from '@/lib/api';

export default function AnnouncementsWidget() {
    const { showToast } = useToast();
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data = await getCampusNews();
                setAnnouncements(data || []);
            } catch (error) {
                console.error("Failed to fetch news", error);
                setAnnouncements([]);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    return (
        <div className="bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-200/60 dark:border-slate-700/50 p-6 sticky top-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Campus News</h2>
                <button
                    onClick={() => showToast("Full announcements view is coming in v1.0", "info")}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline cursor-pointer bg-transparent border-none p-0"
                >
                    View All
                </button>
            </div>

            <div className="space-y-4">
                {loading ? (
                    // Skeleton Loading
                    [1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-2"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                        </div>
                    ))
                ) : announcements.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">No news at the moment.</p>
                ) : (
                    announcements.map((item) => (
                        <div key={item.id} className="group cursor-pointer">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.color}`}>
                                    {item.type.toUpperCase()}
                                </span>
                                <span className="text-xs text-slate-400">{item.date}</span>
                            </div>
                            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors leading-snug">
                                {item.title}
                            </h3>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                    onClick={() => showToast("Subscription feature is coming in v1.0", "info")}
                    className="w-full py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                >
                    Subscribe to Alerts
                </button>
            </div>
        </div>
    );
}
