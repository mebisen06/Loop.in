'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReactionPickerProps {
    onSelect: (emoji: string) => void;
    currentReactions?: { emoji: string; count: number; user_reacted: boolean }[];
    onToggle?: (emoji: string) => void;
}

const COMMON_REACTIONS = ["👍", "❤️", "🔥", "💡", "🎉", "🤔"];

export default function ReactionPicker({ onSelect, currentReactions = [], onToggle }: ReactionPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const userReaction = currentReactions.find(r => r.user_reacted);
    const sortedReactions = [...currentReactions].sort((a, b) => b.count - a.count);

    return (
        <div className="relative inline-flex items-center gap-2" ref={containerRef}>
            {/* Existing Reactions */}
            <div className="flex gap-1.5 flex-wrap">
                <AnimatePresence>
                    {sortedReactions.map((reaction) => (
                        <motion.button
                            key={reaction.emoji}
                            layout
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onToggle && onToggle(reaction.emoji)}
                            className={`
                            px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors flex items-center gap-1.5
                            ${reaction.user_reacted
                                    ? 'bg-blue-50 border-blue-200 text-blue-700 ring-2 ring-blue-100 ring-opacity-50'
                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}
                        `}
                        >
                            <span className="text-sm">{reaction.emoji}</span>
                            <span>{reaction.count}</span>
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            {/* Add Reaction Button */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 10, backgroundColor: "#f1f5f9" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`p-1.5 rounded-full text-slate-400 hover:text-slate-600 transition-colors ${isOpen ? 'bg-slate-100 text-slate-600' : ''}`}
                title="Add reaction"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </motion.button>

            {/* Emoji Picker Popover */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute top-full left-0 mt-2 p-2 bg-white rounded-xl shadow-xl border border-slate-100 flex gap-1 z-50 ring-1 ring-slate-900/5"
                    >
                        {COMMON_REACTIONS.map((emoji) => (
                            <motion.button
                                key={emoji}
                                whileHover={{ scale: 1.2, backgroundColor: "#f1f5f9" }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                    onSelect(emoji);
                                    setIsOpen(false);
                                }}
                                className="p-2.5 rounded-lg text-xl transition-colors cursor-pointer"
                            >
                                {emoji}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
