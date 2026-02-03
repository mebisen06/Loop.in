import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export type SortOption = 'newest' | 'oldest' | 'likes';

interface FloatingSortProps {
    currentSort: SortOption;
    onSortChange: (option: SortOption) => void;
}

export default function FloatingSort({ currentSort, onSortChange }: FloatingSortProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const options: { id: SortOption; label: string; icon: React.ReactNode }[] = [
        {
            id: 'newest',
            label: 'Newest First',
            icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        },
        {
            id: 'oldest',
            label: 'Oldest First',
            icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        },
        {
            id: 'likes',
            label: 'Most Liked',
            icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        }
    ];

    const currentOption = options.find(o => o.id === currentSort) || options[0];

    return (
        <div className="relative inline-block text-left" ref={containerRef} style={{ zIndex: 50 }}>
            <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#1c1c1f] rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 text-slate-700 dark:text-slate-300 text-sm font-medium"
            >
                <span className="text-slate-400 dark:text-slate-500">Sort by:</span>
                <span className="flex items-center gap-1.5">
                    {currentOption.label}
                    <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1c1c1f] rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden ring-1 ring-black/5 z-50 origin-top-right"
                    >
                        <div className="py-1">
                            {options.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => {
                                        onSortChange(option.id);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                                        ${currentSort === option.id
                                            ? 'bg-slate-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-medium'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                        }
                                    `}
                                >
                                    <span className={currentSort === option.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}>
                                        {option.icon}
                                    </span>
                                    {option.label}
                                    {currentSort === option.id && (
                                        <motion.svg layoutId="check" className="w-4 h-4 ml-auto text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </motion.svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
