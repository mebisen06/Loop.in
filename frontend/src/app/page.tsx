'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/context/ToastContext';
import CreatePostModal from '@/components/feed/CreatePostModal';
import { getPosts, deletePost, getCurrentUser } from '@/lib/api';
import PostSkeleton from '@/components/feed/PostSkeleton';
import PostCard from '@/components/feed/PostCard'; // New Component
import ConfirmationModal from '@/components/common/ConfirmationModal';
import Link from 'next/link';
import AnnouncementsWidget from '@/components/feed/AnnouncementsWidget';
import FeedEmptyState from '@/components/feed/FeedEmptyState';
import { Post } from '@/types';

export default function Home() {
    const { showToast } = useToast();
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Real Current User
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check auth status
        getCurrentUser().then(user => {
            if (user) {
                setCurrentUserId(user.id);
            }
        });
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const data = await getPosts();
            setPosts(data.reverse()); // Show newest first
        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = (postId: number) => {
        setPostToDelete(postId);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!postToDelete) return;

        setIsDeleting(true);
        try {
            await deletePost(postToDelete);
            // Optimistic update
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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
            {/* Left Column: Feed */}
            <div className="space-y-6">
                {/* Page Header */}
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-black dark:text-white animate-in fade-in slide-in-from-bottom-4 duration-700">
                            Loop.in
                        </h1>
                        <p className="text-sm font-medium text-slate-500 mt-2 tracking-wide">
                            Latest discussions from your community
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreatePostOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-slate-700 text-white text-sm font-bold rounded-full hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-blue-900/20"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Create Post</span>
                    </button>
                </header>

                {/* Posts List */}
                <div className="space-y-6 min-h-[500px]">
                    <AnimatePresence mode="popLayout">
                        {isLoading ? (
                            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <PostSkeleton count={3} />
                            </motion.div>
                        ) : posts.length === 0 ? (
                            <motion.div key="empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <FeedEmptyState onCreatePost={() => setIsCreatePostOpen(true)} />
                            </motion.div>
                        ) : (
                            posts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    currentUserId={currentUserId}
                                    onDelete={handleDeleteClick}
                                />
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Right Column: Academic Announcements (Desktop Only) */}
            <aside className="hidden lg:block w-full">
                <AnnouncementsWidget />
            </aside>

            {/* Create Post Modal */}
            <CreatePostModal
                isOpen={isCreatePostOpen}
                onClose={() => {
                    setIsCreatePostOpen(false);
                    fetchPosts(); // Refresh posts after closing modal
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
