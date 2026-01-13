'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Post, postsApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface PostCardProps {
    post: Post;
    onDelete?: () => void;
    onUpdate?: () => void;
}

export default function PostCard({ post, onDelete, onUpdate }: PostCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('هل أنت متأكد من حذف هذا المنشور؟')) return;

        setIsLoading(true);
        try {
            await postsApi.delete(post.id);
            toast.success('تم حذف المنشور بنجاح!');
            onDelete?.();
        } catch (error) {
            toast.error('فشل في حذف المنشور');
            console.error('Error deleting post:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        setIsLoading(true);
        try {
            await postsApi.update(post.id, { title, content });
            toast.success('تم تحديث المنشور بنجاح!');
            setIsEditing(false);
            onUpdate?.();
        } catch (error) {
            toast.error('فشل في تحديث المنشور');
            console.error('Error updating post:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ar-SA');
    };

    if (isEditing) {
        return (
            <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6">
                <form onSubmit={handleUpdate} className="space-y-4">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
                        placeholder="عنوان المنشور"
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white resize-none focus:outline-none focus:border-white/30"
                        placeholder="محتوى المنشور"
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-white text-black px-4 py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'جاري الحفظ...' : 'حفظ'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="flex-1 border border-[#2a2a2a] px-4 py-2 rounded-xl text-gray-400 hover:bg-[#1a1a1a] transition-colors"
                        >
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <article className="group bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 hover:border-white/20 hover:bg-[#161616] transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => { e.preventDefault(); setIsEditing(true); }}
                        className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                        title="تعديل"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors rounded-lg hover:bg-white/10 disabled:opacity-50"
                        title="حذف"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            <Link href={`/posts/${post.id}`}>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-gray-200 transition-colors line-clamp-2 cursor-pointer">
                    {post.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
                    {post.content}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {post.comments?.length || 0} تعليق
                    </span>
                    <span className="text-xs">
                        {formatDate(post.created_at)}
                    </span>
                    <span className="mr-auto text-white/50 group-hover:text-white transition-colors">
                        ← عرض
                    </span>
                </div>
            </Link>
        </article>
    );
}
