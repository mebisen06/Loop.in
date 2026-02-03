import { useState } from 'react';
import { createComment, toggleReaction } from '@/lib/api';
import CommentForm from './CommentForm';
import ReactionPicker from '@/components/common/ReactionPicker';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface CommentItemProps {
    comment: any;
    postId: number;
    depth?: number;
    onReplySuccess: () => void;
}

export default function CommentItem({ comment, postId, depth = 0, onReplySuccess }: CommentItemProps) {
    const [isReplying, setIsReplying] = useState(false);
    const [reactions, setReactions] = useState(comment.reactions || []);

    const handleReply = async (content: string) => {
        await createComment(postId, content, comment.id);
        setIsReplying(false);
        onReplySuccess();
    };

    const handleReaction = async (emoji: string) => {
        try {
            // Optimistic update
            const currentReactionObj = reactions.find((r: any) => r.emoji === emoji);
            const userReacted = currentReactionObj?.user_reacted;

            let newReactions = [...reactions];

            if (userReacted) {
                // Remove
                newReactions = newReactions.map((r: any) =>
                    r.emoji === emoji ? { ...r, count: r.count - 1, user_reacted: false } : r
                ).filter(r => r.count > 0);
            } else {
                // Add
                if (currentReactionObj) {
                    newReactions = newReactions.map((r: any) =>
                        r.emoji === emoji ? { ...r, count: r.count + 1, user_reacted: true } : r
                    );
                } else {
                    newReactions.push({ emoji, count: 1, user_reacted: true });
                }
            }
            setReactions(newReactions);

            await toggleReaction('comment', comment.id, emoji);
        } catch (error) {
            console.error("Failed to toggle reaction", error);
            setReactions(comment.reactions || []); // Revert
        }
    };

    return (
        <div className={`mt-4 ${depth > 0 ? 'ml-8 sm:ml-12 border-l-2 border-slate-100 pl-4' : ''}`}>
            <div className="flex gap-3">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-xs font-bold text-blue-600 border border-white shadow-sm flex-shrink-0">
                    AS
                </div>

                <div className="flex-1 bg-white rounded-lg p-3 border border-slate-100 shadow-sm relative group hover:border-slate-200 transition-colors">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-slate-800">Anonymous Student</span>
                        <span className="text-xs text-slate-500">• {new Date(comment.created_at).toLocaleDateString()}</span>
                    </div>

                    {/* Content */}
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{comment.content}</p>

                    {/* Footer Actions */}
                    <div className="flex items-center gap-4 mt-2">
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors"
                        >
                            Reply
                        </button>

                        <ReactionPicker
                            currentReactions={reactions}
                            onSelect={handleReaction}
                            onToggle={handleReaction}
                        />
                    </div>
                </div>
            </div>

            {/* Reply Form */}
            {isReplying && (
                <div className="mt-3 ml-11">
                    <CommentForm
                        onSubmit={handleReply}
                        placeholder="Write a reply..."
                        autoFocus
                        onCancel={() => setIsReplying(false)}
                    />
                </div>
            )}

            {/* Recursive Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div>
                    {comment.replies.map((reply: any) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            postId={postId}
                            depth={depth + 1}
                            onReplySuccess={onReplySuccess}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
