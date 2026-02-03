'use client';

import { useToast } from '@/context/ToastContext';

export default function AnnouncementsWidget() {
    const { showToast } = useToast();
    const announcements = [
        {
            id: 1,
            title: "Mid-Term Exam Schedule Released",
            date: "Oct 15",
            type: "Academic",
            color: "bg-red-100 text-red-700"
        },
        {
            id: 2,
            title: "Guest Lecture: AI in Healthcare",
            date: "Oct 18",
            type: "Event",
            color: "bg-blue-100 text-blue-700"
        },
        {
            id: 3,
            title: "Library Maintenance Downtime",
            date: "Oct 20",
            type: "Notice",
            color: "bg-yellow-100 text-yellow-700"
        }
    ];

    return (
        <div className="bg-slate-50/80 backdrop-blur-md rounded-xl border border-slate-200/60 p-6 sticky top-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800">Campus News</h2>
                <button
                    onClick={() => showToast("Full announcements view is coming in v1.0", "info")}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer bg-transparent border-none p-0"
                >
                    View All
                </button>
            </div>

            <div className="space-y-4">
                {announcements.map((item) => (
                    <div key={item.id} className="group cursor-pointer">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.color}`}>
                                {item.type.toUpperCase()}
                            </span>
                            <span className="text-xs text-slate-400">{item.date}</span>
                        </div>
                        <h3 className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors leading-snug">
                            {item.title}
                        </h3>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                    onClick={() => showToast("Subscription feature is coming in v1.0", "info")}
                    className="w-full py-2 text-xs font-medium text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded transition-colors"
                >
                    Subscribe to Alerts
                </button>
            </div>
        </div>
    );
}
