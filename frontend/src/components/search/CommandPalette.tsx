'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface SearchResult {
    id: string;
    title: string;
    type: 'post' | 'deadline' | 'announcement';
    detail: string;
}

const MOCK_RESULTS: SearchResult[] = [
    { id: '1', title: 'Mid-Term Exam Schedule', type: 'announcement', detail: 'Academic Calendar' },
    { id: '2', title: 'Physics 101 Notes', type: 'post', detail: 'by Sarah Jenkins • CS' },
    { id: '3', title: 'Internship Opportunities', type: 'post', detail: 'by Career Center' },
    { id: '4', title: 'Project Submission', type: 'deadline', detail: 'Due Tomorrow • Algorithms' },
];

export default function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Focus input on open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    // Mock Search Logic
    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const handler = setTimeout(() => {
            // Simple filter mock
            const filtered = MOCK_RESULTS.filter(item =>
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.detail.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered);
        }, 150); // Simulate network delay

        return () => clearTimeout(handler);
    }, [query]);

    // Handle Quick Filters
    const handleFilterClick = (filter: string) => {
        setQuery(filter + ' ');
        inputRef.current?.focus();
    };

    const handleResultClick = (id: string) => {
        console.log('Navigate to', id);
        onClose();
        // router.push(`/post/${id}`); 
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 z-[101] overflow-hidden flex flex-col max-h-[60vh]"
                    >
                        {/* Search Input */}
                        <div className="flex items-center gap-3 p-4 border-b border-slate-100">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search posts, deadlines, or people..."
                                className="flex-1 text-lg outline-none placeholder:text-slate-400 text-slate-800 bg-transparent"
                            />
                            <div className="flex gap-2">
                                <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded">
                                    ESC
                                </kbd>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="overflow-y-auto p-2">
                            {/* Quick Filters (Show if no query) */}
                            {query === '' && (
                                <div className="p-2">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Filters</p>
                                    <div className="flex gap-2 flex-wrap">
                                        <button onClick={() => handleFilterClick('#Urgent')} className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors border border-red-100">
                                            #Urgent
                                        </button>
                                        <button onClick={() => handleFilterClick('#Faculty')} className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors border border-blue-100">
                                            #Faculty
                                        </button>
                                        <button onClick={() => handleFilterClick('#Research')} className="px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors border border-purple-100">
                                            #Research
                                        </button>
                                        <button onClick={() => handleFilterClick('#Events')} className="px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors border border-emerald-100">
                                            #Events
                                        </button>
                                    </div>

                                    {/* Recent Mock */}
                                    <div className="mt-6">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Recent Searches</p>
                                        <div className="group flex items-center justify-between p-2 hover:bg-slate-50 rounded-md cursor-pointer transition-colors text-slate-600">
                                            <div className="flex items-center gap-3">
                                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>"Final Exam Schedule"</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Results */}
                            {query !== '' && (
                                <div>
                                    {results.length === 0 ? (
                                        <div className="p-8 text-center text-slate-500">
                                            <p>No results found for "{query}"</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            {results.map((result) => (
                                                <button
                                                    key={result.id}
                                                    onClick={() => handleResultClick(result.id)}
                                                    className="w-full text-left p-3 hover:bg-slate-50 rounded-lg flex items-center justify-between group transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-md ${result.type === 'announcement' ? 'bg-orange-100 text-orange-600' :
                                                                result.type === 'deadline' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                                            }`}>
                                                            {result.type === 'post' ? (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                                                            ) : (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-800">{result.title}</p>
                                                            <p className="text-xs text-slate-500">{result.detail}</p>
                                                        </div>
                                                    </div>
                                                    <svg className="w-4 h-4 text-slate-300 group-hover:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                            <div className="flex gap-4">
                                <span className="flex items-center gap-1"><kbd className="font-sans bg-white border border-slate-200 rounded px-1">↵</kbd> to select</span>
                                <span className="flex items-center gap-1"><kbd className="font-sans bg-white border border-slate-200 rounded px-1">↑↓</kbd> to navigate</span>
                            </div>
                            <span>SearchX Intelligence</span>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
