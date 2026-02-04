'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/context/ToastContext';
import CreatePostModal from '@/components/feed/CreatePostModal';
import { getPosts, deletePost, getCurrentUser } from '@/lib/api';
import PostSkeleton from '@/components/feed/PostSkeleton';
import PostCard from '@/components/feed/PostCard';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import Link from 'next/link';
import AnnouncementsWidget from '@/components/feed/AnnouncementsWidget';
import FeedEmptyState from '@/components/feed/FeedEmptyState';
import DepartmentFilter from '@/components/feed/DepartmentFilter';
import { Post } from '@/types';

// Stagger animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.23, 1, 0.32, 1] as [number, number, number, number]
        }
    }
};

export default function Home() {
    const { showToast } = useToast();
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Department Filter
    const [selectedDepartment, setSelectedDepartment] = useState('ALL');

    // Real Current User
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);

    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check auth status
        getCurrentUser().then(user => {
            if (user) {
                setCurrentUserId(user.id);
                setCurrentUser(user);
            }
        });
        // Initial fetch
        fetchPosts(selectedDepartment);
    }, []);

    // Re-fetch when department changes
    useEffect(() => {
        setIsLoading(true);
        fetchPosts(selectedDepartment);
    }, [selectedDepartment]);

    const fetchPosts = async (dept?: string) => {
        try {
            const data = await getPosts(dept);
            setPosts(data);
        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Derived state for filtering is no longer needed as backend does it, 
    // but we use 'posts' directly which acts as the filtered source.
    const displayPosts = posts;

    const handleDeleteClick = (postId: number) => {
        setPostToDelete(postId);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!postToDelete) return;

        setIsDeleting(true);
        try {
            await deletePost(postToDelete);
            setPosts(prev => prev.filter(p => p.id !== postToDelete));
            setDeleteModalOpen(false);
            setPostToDelete(null);
            showToast("Post deleted successfully", "success");
        } catch (error) {
            console.error("Failed to delete post", error);
            showToast("Failed to delete post. You might not be authorized.", "error");
        } finally {
            setIsDeleting(false);
        }
    };

    // User identity display
    const userName = currentUser?.full_name || currentUser?.email?.split('@')[0] || 'Anonymous Student';
    const enrollmentNumber = currentUser?.enrollment_number || '';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
            {/* Left Column: Feed */}
            <div className="space-y-6">
                {/* Sticky Page Header with Glassmorphism */}
                <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-1 py-4 -mx-1 mb-6 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-transparent transition-all duration-300">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-slate-100 hidden md:block">
                            Loop.in
                        </h1>
                        {currentUser ? (
                            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 truncate">
                                {userName} <span className="text-slate-400 font-normal">• {enrollmentNumber}</span>
                            </p>
                        ) : (
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Campus Discussions
                            </p>
                        )}
                    </div>

                    {/* Search Bar (Glassmorphism) */}
                    <div className="flex-1 max-w-md hidden sm:block">
                        <button className="w-full flex items-center gap-3 px-4 py-2 bg-white/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 rounded-full text-slate-500 dark:text-slate-400 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group">
                            <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span className="text-sm font-medium">Search discussions...</span>
                        </button>
                    </div>

                    <button
                        onClick={() => setIsCreatePostOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-full hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-blue-500/30 shrink-0"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="hidden sm:inline">Create Post</span>
                    </button>
                </header>

                {/* Department Filter */}
                <DepartmentFilter
                    selectedDepartment={selectedDepartment}
                    onSelect={setSelectedDepartment}
                />

                {/* Posts List with Staggered Animation */}
                <div className="space-y-6 min-h-[500px]">
                    <AnimatePresence mode="popLayout">
                        {isLoading ? (
                            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <PostSkeleton count={3} />
                            </motion.div>
                        ) : displayPosts.length === 0 ? (
                            <motion.div key="empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <FeedEmptyState onCreatePost={() => setIsCreatePostOpen(true)} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="posts"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-6"
                            >
                                {displayPosts.map((post) => (
                                    <motion.div key={post.id} variants={itemVariants}>
                                        <PostCard
                                            post={post}
                                            currentUserId={currentUserId}
                                            onDelete={handleDeleteClick}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Right Column: Campus News (Desktop Only) */}
            <aside className="hidden lg:block w-full">
                <AnnouncementsWidget />
            </aside>

            {/* Create Post Modal */}
            <CreatePostModal
                isOpen={isCreatePostOpen}
                onClose={() => {
                    setIsCreatePostOpen(false);
                    fetchPosts();
                }}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Post"
                message="Are you sure you want to delete this post? This action cannot be undone."
                confirmLabel="Delete"
                isDanger={true}
                isLoading={isDeleting}
            />
        </div>
    );
}
