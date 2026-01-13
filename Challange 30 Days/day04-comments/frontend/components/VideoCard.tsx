'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Video, videosApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface VideoCardProps {
    video: Video;
    onDelete?: () => void;
    onUpdate?: () => void;
}

export default function VideoCard({ video, onDelete, onUpdate }: VideoCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(video.title);
    const [url, setUrl] = useState(video.url);
    const [isLoading, setIsLoading] = useState(false);

    const getVideoId = (videoUrl: string) => {
        const match = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
        return match ? match[1] : null;
    };

    const videoId = getVideoId(video.url);
    const thumbnailUrl = videoId
        ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
        : null;

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('هل أنت متأكد من حذف هذا الفيديو؟')) return;

        setIsLoading(true);
        try {
            await videosApi.delete(video.id);
            toast.success('تم حذف الفيديو بنجاح!');
            onDelete?.();
        } catch (error) {
            toast.error('فشل في حذف الفيديو');
            console.error('Error deleting video:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !url.trim()) return;

        setIsLoading(true);
        try {
            await videosApi.update(video.id, { title, url });
            toast.success('تم تحديث الفيديو بنجاح!');
            setIsEditing(false);
            onUpdate?.();
        } catch (error) {
            toast.error('فشل في تحديث الفيديو');
            console.error('Error updating video:', error);
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
                        placeholder="عنوان الفيديو"
                    />
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
                        placeholder="رابط الفيديو"
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
        <article className="group bg-[#111] border border-[#2a2a2a] rounded-2xl overflow-hidden hover:border-white/20 hover:bg-[#161616] transition-all duration-300">
            {/* Thumbnail */}
            <Link href={`/videos/${video.id}`}>
                <div className="relative aspect-video bg-[#1a1a1a] overflow-hidden cursor-pointer">
                    {thumbnailUrl ? (
                        <img
                            src={thumbnailUrl}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    )}
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-black mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </Link>

            <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                    <Link href={`/videos/${video.id}`} className="flex-1">
                        <h3 className="text-lg font-semibold text-white group-hover:text-gray-200 transition-colors line-clamp-2 cursor-pointer">
                            {video.title}
                        </h3>
                    </Link>
                    <div className="flex items-center gap-1 mr-2">
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

                <p className="text-gray-500 text-sm truncate mb-3" dir="ltr">
                    {video.url}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {video.comments?.length || 0} تعليق
                    </span>
                    <span className="text-xs">
                        {formatDate(video.created_at)}
                    </span>
                </div>
            </div>
        </article>
    );
}
