import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getComments, createComment } from '@/lib/api';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import FloatingSort, { SortOption } from './FloatingSort';

interface CommentSectionProps {
    postId: number;
    initialCount?: number;
    currentUserId?: number | null;
}

export default function CommentSection({ postId, initialCount = 0, currentUserId }: CommentSectionProps) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const [comments, setComments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [count, setCount] = useState(initialCount);
    const [sortOption, setSortOption] = useState<SortOption>('newest');

    const getSortedComments = () => {
        return [...comments].sort((a, b) => {
            if (sortOption === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            if (sortOption === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            if (sortOption === 'likes') return (b.upvotes || 0) - (a.upvotes || 0);
            return 0;
        });
    };

    const fetchComments = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getComments(postId);
            // Process flat list into tree
            const commentMap: any = {};
            const roots: any[] = [];

            // First pass: create map
            data.forEach((c: any) => {
                c.replies = [];
                commentMap[c.id] = c;
            });

            // Second pass: link properties
            data.forEach((c: any) => {
                if (c.parent_id) {
                    if (commentMap[c.parent_id]) {
                        commentMap[c.parent_id].replies.push(c);
                    }
                } else {
                    roots.push(c);
                }
            });

            setComments(roots);
            setCount(data.length);
        } catch (error) {
            console.error("Failed to fetch comments", error);
        } finally {
            setIsLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        if (isOpen) {
            fetchComments();
        }
    }, [isOpen, fetchComments]);

    const handleAddComment = async (content: string) => {
        await createComment(postId, content);
        fetchComments(); // Refresh list
    };

    return (
        <div className="mt-4 border-t border-slate-100 pt-3">
            {/* Header Area with Sort */}
            <div className="flex items-center justify-between mb-4">
                {/* Toggle Header */}
                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.99 }}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors group"
                >
                    <div className="flex items-center gap-2">
                        <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-slate-400 group-hover:text-slate-600"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </motion.div>
                        <span className="font-medium">{isOpen ? 'Hide Comments' : `Show Comments (${count})`}</span>
                    </div>
                </motion.button>

                {isOpen && (
                    <div className="animate-in fade-in zoom-in-95 duration-200">
                        <FloatingSort currentSort={sortOption} onSortChange={setSortOption} />
                    </div>
                )}
            </div>

            {/* Content with Smooth Accordion */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-6 pb-2">
                            <CommentForm onSubmit={handleAddComment} />

                            <div className="space-y-4">
                                {isLoading && <p className="text-sm text-slate-500 text-center py-4">Loading comments...</p>}

                                {!isLoading && comments.length === 0 && (
                                    <p className="text-sm text-slate-400 text-center py-4">No comments yet. Be the first to start the discussion.</p>
                                )}

                                {getSortedComments().map((comment) => (
                                    <CommentItem
                                        key={comment.id}
                                        comment={comment}
                                        postId={postId}
                                        currentUserId={currentUserId}
                                        onReplySuccess={fetchComments}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
