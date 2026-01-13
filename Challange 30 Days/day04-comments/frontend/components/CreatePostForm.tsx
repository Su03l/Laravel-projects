'use client';

import { useState } from 'react';
import { postsApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface CreatePostFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function CreatePostForm({ onSuccess, onCancel }: CreatePostFormProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim() || isSubmitting) return;

        setIsSubmitting(true);

        try {
            await postsApi.create({ title, content });
            setTitle('');
            setContent('');
            toast.success('Post created successfully!');
            onSuccess?.();
        } catch (err) {
            toast.error('Failed to create post');
            console.error('Error creating post:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                Create New Post
            </h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter post title..."
                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-2">Content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your post content..."
                        rows={4}
                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-white/30 transition-colors"
                        required
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-4 py-3 border border-[#2a2a2a] rounded-xl text-gray-400 hover:bg-[#1a1a1a] transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting || !title.trim() || !content.trim()}
                        className="flex-1 bg-white text-black px-4 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Creating...' : 'Create Post'}
                    </button>
                </div>
            </div>
        </form>
    );
}
