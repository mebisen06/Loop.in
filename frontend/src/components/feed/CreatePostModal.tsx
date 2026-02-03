'use client';

import { useState } from 'react';
import Button from '@/components/common/Button';
import { createPost } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const MAX_CONTENT_LENGTH = 3000;

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
    const { showToast } = useToast();
    const [postType, setPostType] = useState<'discussion' | 'question' | 'announcement'>('discussion');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [department, setDepartment] = useState('');
    const [tags, setTags] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isFormValid = title.trim().length > 0 &&
        content.trim().length > 0 &&
        content.length <= MAX_CONTENT_LENGTH &&
        department;

    const handleSubmit = async () => {
        if (!isFormValid) {
            if (content.length > MAX_CONTENT_LENGTH) {
                showToast("Post content is too long! Please keep it under 3000 characters.", "error");
            } else {
                showToast("Please fill in all required fields", "error");
            }
            return;
        }

        setIsSubmitting(true);
        try {
            await createPost({
                title,
                content,
                department,
                type: postType,
                tags
            });

            showToast("Post created successfully!", "success");

            // Reset and close
            setTitle('');
            setContent('');
            setDepartment('');
            setTags('');
            onClose();
        } catch (error: any) {
            console.error("Failed to create post", error);

            if (typeof navigator !== 'undefined' && !navigator.onLine) {
                showToast("You appear to be offline. Check your connection.", "error");
            } else if (error.response?.status >= 500) {
                showToast("Server is acting up (500). Draft saved.", "error");
            } else {
                showToast(error.response?.data?.detail || "Failed to create post. Please try again.", "error");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (title || content) {
            if (confirm('You have unsaved changes. Are you sure you want to close?')) {
                onClose();
            }
        } else {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-40 z-50 animate-in fade-in duration-200"
                onClick={isSubmitting ? undefined : handleClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
                <div
                    className="bg-white rounded-xl border border-slate-200 w-full max-w-2xl my-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-100">
                        <h2 className="text-xl font-serif font-bold text-slate-900">Create a Post</h2>
                        <button
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="p-1 hover:bg-slate-100 rounded transition-colors disabled:opacity-50"
                            aria-label="Close"
                        >
                            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Post Type */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Post Type
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPostType('discussion')}
                                    disabled={isSubmitting}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 ${postType === 'discussion'
                                        ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    Discussion
                                </button>
                                <button
                                    onClick={() => setPostType('question')}
                                    disabled={isSubmitting}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 ${postType === 'question'
                                        ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    Question
                                </button>
                                <button
                                    onClick={() => setPostType('announcement')}
                                    disabled={isSubmitting}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 ${postType === 'announcement'
                                        ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    Announcement
                                </button>
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={isSubmitting}
                                placeholder="What do you want to talk about?"
                                maxLength={200}
                                className="w-full px-4 py-3 text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-500"
                                autoFocus
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                Be clear and specific • {title.length}/200 characters
                            </p>
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Details <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                disabled={isSubmitting}
                                placeholder="Add details, context, or explanation..."
                                rows={8}
                                className={`w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-500
                                  ${content.length > MAX_CONTENT_LENGTH ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200'}
                                `}
                            />
                            <div className="flex justify-between items-center mt-1">
                                <p className="text-xs text-slate-500">
                                    Provide enough context for others to understand and respond
                                </p>
                                <span className={`text-xs font-medium ${content.length > MAX_CONTENT_LENGTH ? 'text-red-600' :
                                        content.length > MAX_CONTENT_LENGTH * 0.9 ? 'text-orange-500' : 'text-slate-400'
                                    }`}>
                                    {content.length}/{MAX_CONTENT_LENGTH}
                                </span>
                            </div>
                        </div>

                        {/* Department */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Department <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                disabled={isSubmitting}
                                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white disabled:bg-slate-50 disabled:text-slate-500"
                            >
                                <option value="">Select department</option>
                                <option value="cs">Computer Science</option>
                                <option value="ee">Electrical Engineering</option>
                                <option value="me">Mechanical Engineering</option>
                                <option value="ce">Civil Engineering</option>
                                <option value="it">Information Technology</option>
                                <option value="general">General</option>
                            </select>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Tags (Optional)
                            </label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                disabled={isSubmitting}
                                placeholder="e.g., Exams, Projects, Career"
                                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-500"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
                        <Button
                            variant="ghost"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <div className="flex gap-3">
                            <Button
                                variant="secondary"
                                disabled={isSubmitting}
                            >
                                Save Draft
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleSubmit}
                                disabled={!isFormValid || isSubmitting}
                                isLoading={isSubmitting}
                            >
                                {isSubmitting ? 'Posting...' : 'Post'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
