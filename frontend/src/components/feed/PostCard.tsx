import Link from 'next/link';
import { motion } from 'framer-motion';
import { Post } from '@/types';
import UserAvatar from '@/components/common/UserAvatar';
import VoteControl from '@/components/common/VoteControl';
import DepartmentBadge from '@/components/feed/DepartmentBadge';
import CommentSection from '@/components/comments/CommentSection';
import ReactionPicker from '@/components/common/ReactionPicker';
import TruncatedText from '@/components/common/TruncatedText';

interface PostCardProps {
    post: Post;
    currentUserId: number | null;
    onDelete?: (postId: number) => void;
}

export default function PostCard({ post, currentUserId, onDelete }: PostCardProps) {
    // Department Color Map
    const deptColors: Record<string, string> = {
        'CS': '0, 255, 255', // Cyan
        'EE': '255, 165, 0', // Orange
        'ME': '59, 130, 246', // Blue
        'CE': '225, 29, 72', // Rose
        'IT': '147, 51, 234', // Purple
        'GENERAL': '148, 163, 184' // Slate
    };
    const deptColor = deptColors[post.department || 'GENERAL'] || deptColors['GENERAL'];

    const isAuthor = currentUserId && post.author_id === currentUserId;
    const isAnonymous = post.is_anonymous;
    const authorName = isAnonymous ? 'Anonymous Student' : (post.author?.full_name || post.author?.email?.split('@')[0] || 'Student');
    const authorUsername = isAnonymous ? '' : (post.author?.username || '');
    const authorRole = isAnonymous ? 'Ghost' : (post.author?.role || 'Student');
    const timeAgo = new Date(post.created_at).toLocaleDateString();

    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="relative bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/40 dark:border-white/5 transition-all duration-300 group"
            style={{
                boxShadow: `0 0 0 1px rgba(255,255,255,0.1), 0 8px 30px -6px rgba(0,0,0,0.1)`
            }}
        >
            {/* Dynamic Glow Element - visible on hover */}
            <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    boxShadow: `0 20px 40px -10px rgba(${deptColor}, 0.15), 0 0 20px -5px rgba(${deptColor}, 0.1)`
                }}
            />

            <div className="relative z-10 flex justify-between items-start mb-5">
                {/* Author Info */}
                <div className="flex items-center gap-3">
                    {/* Avatar with Ghost Mode blur effect */}
                    <div className={`relative ${isAnonymous ? 'filter blur-[1px] opacity-60' : ''}`}>
                        {isAnonymous ? (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 dark:from-slate-700 dark:to-slate-900 flex items-center justify-center border border-slate-300 dark:border-slate-600 backdrop-blur-sm shadow-inner">
                                <svg className="w-5 h-5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        ) : (
                            <UserAvatar user={post.author} size="md" />
                        )}
                        {/* Spectral glow for ghost mode */}
                        {isAnonymous && (
                            <div className="absolute inset-0 rounded-full bg-slate-400/20 dark:bg-slate-600/20 animate-pulse pointer-events-none" />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2 text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                            <span>{authorName}</span>
                            {authorUsername && (
                                <span className="text-slate-500 dark:text-slate-400 font-medium opacity-80">@{authorUsername}</span>
                            )}
                            <DepartmentBadge deptCode={post.department || 'GENERAL'} />
                            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                {authorRole}
                            </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide mt-0.5 ml-0.5">
                            {post.author?.enrollment_number || 'Student'} • {timeAgo}
                        </div>
                    </div>
                </div>

                {/* Delete Option (Only for Author) */}
                {isAuthor && onDelete && (
                    <div className="relative">
                        <button
                            onClick={() => onDelete(post.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-900/20 rounded-full transition-all opacity-0 group-hover:opacity-100"
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
            <div className="mb-6 relative z-10">
                <Link href={`/posts/${post.id}`} className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mb-3 leading-tight tracking-tight drop-shadow-sm">
                        <TruncatedText text={post.title} maxLength={60} />
                    </h2>
                </Link>
                <p className="text-[1.0625rem] text-slate-700 dark:text-slate-300 leading-[1.75] font-light whitespace-pre-wrap">
                    {post.content}
                </p>
            </div>

            {/* Tags */}
            {post.tags && (
                <div className="flex items-center gap-2 mb-6 flex-wrap relative z-10">
                    {post.tags.split(',').filter(t => t.trim()).map((tag: string) => (
                        <span
                            key={tag}
                            className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full text-xs font-bold tracking-wide border border-slate-200/60 dark:border-slate-700/60 uppercase backdrop-blur-sm"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="pt-6 mt-2 border-t border-slate-100/60 dark:border-white/5 relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <VoteControl
                            initialUpvotes={post.upvotes}
                            initialDownvotes={post.downvotes}
                            initialUserVote={post.user_vote}
                            postId={post.id}
                        />
                    </div>

                    <button className="flex items-center gap-1.5 text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-slate-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        <span>Share</span>
                    </button>
                </div>

                <div className="mt-4">
                    <CommentSection postId={post.id} initialCount={post.comments_count || 0} currentUserId={currentUserId} />
                </div>
            </div>
        </motion.article>
    );
}
