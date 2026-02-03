import { useState } from 'react';
import api from '@/lib/api';

interface VoteControlProps {
    initialUpvotes: number;
    initialDownvotes: number;
    initialUserVote?: 1 | -1 | null;
    postId?: number;
    commentId?: number;
    onVoteChange?: (upvotes: number, downvotes: number, userVote: 1 | -1 | null) => void;
    size?: 'sm' | 'md';
}

export default function VoteControl({
    initialUpvotes,
    initialDownvotes,
    initialUserVote,
    postId,
    commentId,
    onVoteChange,
    size = 'md'
}: VoteControlProps) {
    const [upvotes, setUpvotes] = useState(initialUpvotes);
    const [downvotes, setDownvotes] = useState(initialDownvotes);
    const [userVote, setUserVote] = useState<1 | -1 | null>(initialUserVote || null);
    const [loading, setLoading] = useState(false);

    const handleVote = async (type: 1 | -1) => {
        if (loading) return;
        setLoading(true);

        // Optimistic Update
        const previousState = { upvotes, downvotes, userVote };

        // Calculate new state
        let newUpvotes = upvotes;
        let newDownvotes = downvotes;
        let newUserVote: 1 | -1 | null = type;

        if (userVote === type) {
            // Toggle off
            newUserVote = null;
            if (type === 1) newUpvotes--;
            else newDownvotes--;
        } else {
            // Switch or Add
            if (userVote === 1) newUpvotes--; // Remove old upvote
            if (userVote === -1) newDownvotes--; // Remove old downvote

            if (type === 1) newUpvotes++;
            else newDownvotes++;
        }

        setUpvotes(newUpvotes);
        setDownvotes(newDownvotes);
        setUserVote(newUserVote);

        try {
            await api.post('/votes/', {
                post_id: postId,
                comment_id: commentId,
                vote_type: type
            });
            if (onVoteChange) onVoteChange(newUpvotes, newDownvotes, newUserVote);
        } catch (error) {
            // Revert on error
            console.error("Vote failed", error);
            setUpvotes(previousState.upvotes);
            setDownvotes(previousState.downvotes);
            setUserVote(previousState.userVote);
        } finally {
            setLoading(false);
        }
    };

    const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    const netVotes = upvotes - downvotes;

    return (
        <div className={`flex items-center bg-slate-50 rounded-lg overflow-hidden border border-slate-200 ${size === 'sm' ? 'h-7' : 'h-9'}`}>
            <button
                onClick={() => handleVote(1)}
                disabled={loading}
                className={`flex items-center justify-center px-2 h-full hover:bg-slate-100 transition-colors ${userVote === 1 ? 'text-orange-600 bg-orange-50' : 'text-slate-500'}`}
                title="Upvote"
            >
                <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={userVote === 1 ? 2.5 : 2} d="M5 15l7-7 7 7" />
                </svg>
            </button>

            <span className={`px-1 text-sm font-bold min-w-[20px] text-center ${userVote === 1 ? 'text-orange-600' :
                    userVote === -1 ? 'text-blue-600' : 'text-slate-700'
                }`}>
                {netVotes}
            </span>

            <button
                onClick={() => handleVote(-1)}
                disabled={loading}
                className={`flex items-center justify-center px-2 h-full hover:bg-slate-100 transition-colors ${userVote === -1 ? 'text-blue-600 bg-blue-50' : 'text-slate-500'}`}
                title="Downvote"
            >
                <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={userVote === -1 ? 2.5 : 2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
        </div>
    );
}
