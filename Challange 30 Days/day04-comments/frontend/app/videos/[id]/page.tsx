'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { videosApi, Video } from '@/lib/api';
import CommentSection from '@/components/CommentSection';

export default function VideoDetails({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [video, setVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await videosApi.getOne(Number(resolvedParams.id));
                setVideo(response.data);
            } catch (err) {
                setError('Failed to load video');
                console.error('Error fetching video:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
    }, [resolvedParams.id]);

    const getEmbedUrl = (url: string) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
        return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Loading...</div>
            </div>
        );
    }

    if (error || !video) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error || 'Video not found'}</p>
                    <Link href="/" className="text-white hover:underline">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const embedUrl = getEmbedUrl(video.url);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Header */}
            <header className="border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 py-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-5xl mx-auto px-6 py-8">
                {/* Video Player */}
                <div className="mb-8">
                    {embedUrl ? (
                        <div className="aspect-video rounded-2xl overflow-hidden bg-[#111] border border-[#2a2a2a]">
                            <iframe
                                src={embedUrl}
                                title={video.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        <div className="aspect-video rounded-2xl bg-[#111] border border-[#2a2a2a] flex items-center justify-center">
                            <div className="text-center">
                                <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <a
                                    href={video.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white hover:underline"
                                >
                                    Open Video in New Tab →
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Video Info */}
                <article className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="text-sm text-gray-500">
                            {new Date(video.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold mb-4">
                        {video.title}
                    </h1>

                    <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        {video.url}
                    </a>
                </article>

                {/* Divider */}
                <div className="border-t border-[#2a2a2a] my-8"></div>

                {/* Comments */}
                <CommentSection
                    type="video"
                    id={video.id}
                    comments={video.comments || []}
                />
            </main>
        </div>
    );
}
