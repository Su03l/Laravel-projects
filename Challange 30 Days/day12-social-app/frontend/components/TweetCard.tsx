'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useModal } from '@/contexts/ModalContext';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { Eye, Pencil, Trash2, X, Check } from 'lucide-react';

interface Tweet {
    id: number;
    content: string;
    created_at: string;
    author?: {
        id: number;
        name: string;
        username: string;
    };
    user?: {
        id: number;
        name: string;
        username: string;
    };
}

interface TweetCardProps {
    tweet: Tweet;
    showActions?: boolean;
    onDelete?: () => void;
    onUpdate?: () => void;
}

export default function TweetCard({ tweet, showActions = false, onDelete, onUpdate }: TweetCardProps) {
    const { isAuthenticated, user } = useAuth();
    const { openLoginModal } = useModal();
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(tweet.content);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const tweetAuthor = tweet.author || tweet.user;

    if (!tweetAuthor) {
        return null;
    }

    const cleanUsername = tweetAuthor.username?.replace(/^@/, '') || '';
    const isOwner = user?.id === tweetAuthor.id;

    const handleTweetClick = (e: React.MouseEvent) => {
        if (!isAuthenticated) {
            e.preventDefault();
            openLoginModal();
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await api.delete(`/tweets/${tweet.id}`);
            toast.success('تم حذف التغريدة');
            setShowDeleteConfirm(false);
            onDelete?.();
        } catch {
            toast.error('فشل حذف التغريدة');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!editContent.trim()) {
            toast.error('التغريدة لا يمكن أن تكون فارغة');
            return;
        }

        setIsSaving(true);
        try {
            await api.put(`/tweets/${tweet.id}`, { content: editContent.trim() });
            toast.success('تم تحديث التغريدة');
            setIsEditing(false);
            onUpdate?.();
        } catch {
            toast.error('فشل تحديث التغريدة');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setEditContent(tweet.content);
        setIsEditing(false);
    };

    return (
        <>
            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/90"
                        onClick={() => setShowDeleteConfirm(false)}
                    />
                    <div className="relative z-10 w-full max-w-sm mx-4 border border-white/20 bg-black p-6">
                        <div className="text-center">
                            <div className="mx-auto mb-4 h-14 w-14 bg-red-500/20 flex items-center justify-center">
                                <Trash2 className="h-7 w-7 text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">حذف التغريدة</h3>
                            <p className="text-white/50 mb-6">هل أنت متأكد من حذف هذه التغريدة؟</p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 border border-white/20 py-2.5 font-medium text-white hover:bg-white/10 transition-colors"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex-1 bg-red-500 py-2.5 font-medium text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
                                >
                                    {isDeleting ? '...' : 'حذف'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <article className="border border-white/20 bg-white/5 p-5 transition-all hover:bg-white/10">
                {/* Header - Avatar + Name + Username */}
                <header className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <Link href={`/users/${cleanUsername}`}>
                            <div className="h-12 w-12 shrink-0 bg-blue-500 flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:opacity-80 transition-opacity">
                                {cleanUsername[0]?.toUpperCase() || '?'}
                            </div>
                        </Link>

                        {/* Name & Username */}
                        <div>
                            <Link
                                href={`/users/${cleanUsername}`}
                                className="block font-bold text-white hover:underline transition-colors"
                            >
                                {tweetAuthor.name}
                            </Link>
                            <span className="text-sm text-white/50">@{cleanUsername}</span>
                        </div>
                    </div>

                    {/* Actions for owner */}
                    {showActions && isOwner && !isEditing && (
                        <div className="flex items-center gap-1">
                            <Link
                                href={`/tweets/${tweet.id}`}
                                className="p-2 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                                title="عرض"
                            >
                                <Eye className="h-4 w-4" />
                            </Link>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 text-white/40 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                                title="تعديل"
                            >
                                <Pencil className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                title="حذف"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    {/* Edit actions */}
                    {isEditing && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleCancelEdit}
                                className="p-2 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                                title="إلغاء"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                disabled={isSaving}
                                className="p-2 text-white/40 hover:text-green-400 hover:bg-green-500/10 transition-colors disabled:opacity-50"
                                title="حفظ"
                            >
                                <Check className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </header>

                {/* Body - Tweet Content */}
                {isEditing ? (
                    <div className="mb-4">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full bg-black border border-white/20 p-3 text-lg text-white resize-none focus:outline-none focus:border-blue-500"
                            rows={3}
                            maxLength={280}
                        />
                        <div className="text-left text-sm text-white/40 mt-1">
                            {editContent.length}/280
                        </div>
                    </div>
                ) : (
                    <Link
                        href={`/tweets/${tweet.id}`}
                        onClick={handleTweetClick}
                        className="block mb-4"
                    >
                        <p className="text-lg leading-relaxed text-white/90">{tweet.content}</p>
                    </Link>
                )}

                {/* Footer - Time */}
                <footer className="border-t border-white/10 pt-3">
                    <time className="text-sm text-white/40">
                        {tweet.created_at}
                    </time>
                </footer>
            </article>
        </>
    );
}
