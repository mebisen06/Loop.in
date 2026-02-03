'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type NotificationType = 'academic' | 'social' | 'system';

interface Notification {
    id: number;
    type: NotificationType;
    title: string;
    description: string;
    time: string;
    isRead: boolean;
    meta?: {
        count?: number; // for grouping
        actors?: string[];
    };
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 1,
        type: 'academic',
        title: 'Mid-Term Schedule Released',
        description: 'The Fall 2024 exam schedule is now available. Check your specific department dates.',
        time: '2h ago',
        isRead: false
    },
    {
        id: 2,
        type: 'social',
        title: 'New Reply',
        description: 'Sarah Jenkins replied to your post "Physics 101 Notes"',
        time: '4h ago',
        isRead: false,
        meta: { actors: ['Sarah Jenkins'] }
    },
    {
        id: 3,
        type: 'social',
        title: 'Post Trending',
        description: 'Your post "Camping Trip" has 12 new upvotes',
        time: '5h ago',
        isRead: true,
        meta: { count: 12 }
    },
    {
        id: 4,
        type: 'academic',
        title: 'Library Due Date',
        description: 'Reminder: "Introduction to Algorithms" is due tomorrow.',
        time: '1d ago',
        isRead: true
    }
];

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'academic' | 'social'>('all');
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const filteredNotifications = notifications.filter(n => {
        if (activeTab === 'all') return true;
        return n.type === activeTab;
    });

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const handleNotificationClick = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 bg-white text-slate-600 rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200"
                aria-label="Notifications"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full border-2 border-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
                        className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-xl shadow-[0_10px_40px_-5px_rgb(0,0,0,0.1)] border border-slate-100 overflow-hidden z-50 origin-top-right ring-1 ring-black/5"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-white">
                            <h3 className="font-bold text-slate-800">Notifications</h3>
                            <button
                                onClick={markAllAsRead}
                                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                Mark all as read
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex px-4 pt-2 gap-4 border-b border-slate-50 bg-slate-50/50">
                            {(['all', 'academic', 'social'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`
                                        pb-2 text-xs font-semibold capitalize transition-all relative
                                        ${activeTab === tab ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}
                                    `}
                                >
                                    {tab === 'academic' ? 'Academic 🎓' : tab === 'social' ? 'Social 💬' : 'All'}
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* List */}
                        <div className="max-h-[400px] overflow-y-auto bg-white/50">
                            {filteredNotifications.length === 0 ? (
                                <div className="p-8 text-center text-slate-400">
                                    <p className="text-sm">No notifications here</p>
                                </div>
                            ) : (
                                <div>
                                    {filteredNotifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification.id)}
                                            className={`
                                                p-4 border-b border-slate-50 cursor-pointer transition-colors relative
                                                ${notification.isRead ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/30 hover:bg-blue-50/50'}
                                            `}
                                        >
                                            <div className="flex gap-3 items-start">
                                                {/* Icon */}
                                                <div className={`
                                                    mt-1 p-2 rounded-full shrink-0
                                                    ${notification.type === 'academic' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}
                                                `}>
                                                    {notification.type === 'academic' ? (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                        </svg>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-0.5">
                                                        <p className={`text-sm ${notification.type === 'academic' ? 'font-serif font-bold text-red-900' : 'font-semibold text-slate-900'}`}>
                                                            {notification.title}
                                                        </p>
                                                        {!notification.isRead && (
                                                            <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                                                        {notification.description}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                                                        {notification.time}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                            <button className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">
                                View all activity
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
