'use client';

import Link from 'next/link';
import { Video } from '@/lib/api';

interface VideoCardProps {
    video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
    const getVideoId = (url: string) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
        return match ? match[1] : null;
    };

    const videoId = getVideoId(video.url);
    const thumbnailUrl = videoId
        ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
        : null;

    return (
        <Link href={`/videos/${video.id}`}>
            <article className="group bg-[#111] border border-[#2a2a2a] rounded-2xl overflow-hidden hover:border-white/20 hover:bg-[#161616] transition-all duration-300 cursor-pointer">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-[#1a1a1a] overflow-hidden">
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
                            <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white group-hover:text-gray-200 transition-colors line-clamp-2 flex-1">
                            {video.title}
                        </h3>
                    </div>

                    <p className="text-gray-500 text-sm truncate mb-3">
                        {video.url}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {video.comments?.length || 0} comments
                        </span>
                        <span className="text-xs">
                            {new Date(video.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
