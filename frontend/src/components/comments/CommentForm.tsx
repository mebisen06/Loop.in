import { useState } from 'react';
import Button from '@/components/common/Button';

interface CommentFormProps {
    onSubmit: (content: string) => Promise<void>;
    placeholder?: string;
    autoFocus?: boolean;
    onCancel?: () => void;
}

export default function CommentForm({ onSubmit, placeholder = "Write a thoughtful comment...", autoFocus, onCancel }: CommentFormProps) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(content);
            setContent('');
            if (onCancel) onCancel(); // If used in reply mode, maybe close form
        } catch (error) {
            console.error("Failed to post comment", error);
            // In a real app, show error toast
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0" /> {/* Avatar Placeholder */}
            <div className="flex-1 space-y-2">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={placeholder}
                    className="w-full p-3 border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm min-h-[80px] resize-y text-slate-900 bg-white placeholder:text-slate-400"
                    autoFocus={autoFocus}
                />
                <div className="flex justify-end gap-2">
                    {onCancel && (
                        <Button variant="ghost" size="sm" onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSubmit}
                        disabled={!content.trim() || isSubmitting}
                        isLoading={isSubmitting}
                    >
                        Post Comment
                    </Button>
                </div>
            </div>
        </div>
    );
}
