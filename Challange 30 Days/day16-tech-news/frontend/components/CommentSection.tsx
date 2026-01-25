'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Trash2, Edit2, Send, X, MoreHorizontal } from 'lucide-react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    name: string;
    avatar?: string;
}

interface Comment {
    id: number;
    user_id: number;
    body: string;
    created_at: string;
    user: User;
}

interface CommentSectionProps {
    articleId: number;
    initialComments: Comment[];
}

export default function CommentSection({ articleId, initialComments }: CommentSectionProps) {
    const { user, openLoginModal } = useAuth();
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editBody, setEditBody] = useState('');
    const router = useRouter();

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            openLoginModal();
            return;
        }

        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            const { data } = await api.post(`/articles/${articleId}/comments`, {
                body: newComment
            });
            // Assuming API returns the created comment with user relation
            // If API doesn't return full structure, might need to refetch or construct optmistically
            setComments([data.data || data, ...comments]);
            setNewComment('');
            router.refresh();
        } catch (error) {
            console.error('Failed to add comment', error);
            alert('Could not post comment.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (commentId: number) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        try {
            await api.delete(`/comments/${commentId}`);
            setComments(comments.filter(c => c.id !== commentId));
            router.refresh();
        } catch (error) {
            console.error('Failed to delete comment', error);
        }
    };

    const startEdit = (comment: Comment) => {
        setEditingCommentId(comment.id);
        setEditBody(comment.body);
    };

    const cancelEdit = () => {
        setEditingCommentId(null);
        setEditBody('');
    };

    const handleUpdate = async (commentId: number) => {
        try {
            await api.put(`/comments/${commentId}`, { body: editBody });
            setComments(comments.map(c => c.id === commentId ? { ...c, body: editBody } : c));
            setEditingCommentId(null);
            router.refresh();
        } catch (error) {
            console.error('Failed to update comment', error);
        }
    };

    return (
        <div className="mt-10 pt-10 border-t border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Discussion ({comments.length})</h3>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="mb-10">
                <div className="relative">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={user ? "What are your thoughts?" : "Log in to share your thoughts..."}
                        className="w-full p-4 pr-12 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all resize-none min-h-[100px]"
                        onClick={() => !user && openLoginModal()}
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting || !newComment.trim()}
                        className="absolute bottom-3 right-3 p-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:bg-gray-300 transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-primary font-bold">
                                {comment.user?.name?.charAt(0) || '?'}
                            </div>
                        </div>
                        <div className="flex-grow">
                            <div className="bg-gray-50 rounded-2xl p-4 relative group">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-gray-900">{comment.user?.name || 'Unknown User'}</h4>
                                    <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</span>
                                </div>

                                {editingCommentId === comment.id ? (
                                    <div className="space-y-2">
                                        <textarea
                                            value={editBody}
                                            onChange={(e) => setEditBody(e.target.value)}
                                            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                        />
                                        <div className="flex gap-2 justify-end">
                                            <button onClick={cancelEdit} className="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
                                            <button onClick={() => handleUpdate(comment.id)} className="text-xs text-primary font-medium hover:text-blue-600">Save</button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                        {comment.body}
                                    </p>
                                )}

                                {/* Actions for Owner */}
                                {user && user.id === comment.user_id && !editingCommentId && (
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                        <button
                                            onClick={() => startEdit(comment)}
                                            className="p-1 text-gray-400 hover:text-primary transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
