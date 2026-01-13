'use client';

import { useState } from 'react';
import { commentsApi, Comment } from '@/lib/api';

interface CommentSectionProps {
    type: 'post' | 'video';
    id: number;
    comments: Comment[];
    onCommentAdded?: () => void;
}

export default function CommentSection({ type, id, comments, onCommentAdded }: CommentSectionProps) {
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localComments, setLocalComments] = useState(comments);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await commentsApi.create({
                body: newComment,
                type: type,
                id: id,
            });

            setLocalComments([...localComments, response.data.comment]);
            setNewComment('');
            onCommentAdded?.();
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="comment-section">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Comments ({localComments.length})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-8">
                <div className="relative">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 pr-24 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-white/30 transition-all duration-200 min-h-[100px]"
                        rows={3}
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting || !newComment.trim()}
                        className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Sending
                            </span>
                        ) : (
                            'Send'
                        )}
                    </button>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
                {localComments.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p>No comments yet. Be the first to comment!</p>
                    </div>
                ) : (
                    localComments.map((comment) => (
                        <div
                            key={comment.id}
                            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 hover:border-[#3a3a3a] transition-all duration-200"
                        >
                            <p className="text-gray-200 leading-relaxed mb-3">{comment.body}</p>
                            <span className="text-sm text-gray-500">
                                {formatDate(comment.created_at)}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
