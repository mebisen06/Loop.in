'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/context/ToastContext';
import CreatePostModal from '@/components/feed/CreatePostModal';
import { getPosts, deletePost, getCurrentUser } from '@/lib/api';
import PostSkeleton from '@/components/feed/PostSkeleton';
import CommentSection from '@/components/comments/CommentSection';
import ReactionPicker from '@/components/common/ReactionPicker';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import Link from 'next/link';
import AnnouncementsWidget from '@/components/feed/AnnouncementsWidget';
import FeedEmptyState from '@/components/feed/FeedEmptyState';
import DepartmentBadge from '@/components/feed/DepartmentBadge';

export default function Home() {
  const { showToast } = useToast();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Real Current User
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [posts, setPosts] = useState<any[]>([]);
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
      // Transform data to match UI requirements
      const formattedPosts = data.map((post: any) => ({
        id: post.id,
        author: post.author, // Pass full author object
        author_name: 'Anonymous Student', // Fallback
        author_id: post.author_id,
        role: post.department?.toUpperCase() || 'GENERAL',
        year: '',
        time: new Date(post.created_at).toLocaleDateString(),
        title: post.title,
        content: post.content,
        tags: post.tags ? post.tags.split(',').filter((t: string) => t.trim()) : [],
        upvotes: 0,
        comments: 0,
      }));
      setPosts(formattedPosts.reverse()); // Show newest first
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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
      {/* Left Column: Feed */}
      <div className="space-y-6">
        {/* Page Header */}
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
                <motion.article
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  key={post.id}
                  className="bg-white dark:bg-[#1c1c1f] p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 group relative border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex justify-between items-start mb-5">
                    {/* Author Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 text-sm font-bold tracking-tight border border-slate-200 dark:border-slate-700">
                        {getInitials(post.author ? post.author.email : (post.author_name || 'Anonymous Student'))}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                          {post.author ? post.author.email.split('@')[0] : post.author_name || 'Anonymous Student'}
                          <DepartmentBadge deptCode={post.role} />
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide mt-0.5">
                          {post.author?.enrollment_number || post.year || 'Student'} • {post.time}
                        </div>
                      </div>
                    </div>

                    {/* Delete Option (Only for Author) */}
                    {currentUserId && post.author_id === currentUserId && (
                      <div className="relative">
                        <button
                          onClick={() => handleDeleteClick(post.id)}
                          className="p-2 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Delete Post"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Post Content */}
                  <div className="mb-6">
                    <Link href={`/posts/${post.id}`} className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-3 leading-tight tracking-tight">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-[1.0625rem] text-slate-700 dark:text-slate-300 leading-[1.75] font-light whitespace-pre-wrap">
                      {post.content}
                    </p>
                  </div>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex items-center gap-2 mb-6 flex-wrap">
                      {post.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-slate-200 dark:border-slate-700 uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions - Line Removed */}
                  <div className="pt-6 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <ReactionPicker
                          onSelect={(emoji) => {
                            console.log(`Reacted to post ${post.id} with ${emoji}`);
                            getPosts().then(() => { });
                          }}
                          currentReactions={[
                            ...(post.upvotes > 0 ? [{ emoji: "👍", count: post.upvotes, user_reacted: false }] : [])
                          ]}
                        />
                      </div>

                      <button className="flex items-center gap-1.5 text-sm font-medium hover:text-blue-700 transition-colors text-slate-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        <span>Share Details</span>
                      </button>
                    </div>

                    <CommentSection postId={post.id} initialCount={post.comments || 0} />
                  </div>
                </motion.article>
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
