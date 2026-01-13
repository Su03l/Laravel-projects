'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { postsApi, Post } from '@/lib/api';
import CommentSection from '@/components/CommentSection';

export default function PostDetails({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await postsApi.getOne(Number(resolvedParams.id));
                setPost(response.data);
            } catch (err) {
                setError('Failed to load post');
                console.error('Error fetching post:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [resolvedParams.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Loading...</div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error || 'Post not found'}</p>
                    <Link href="/" className="text-white hover:underline">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Header */}
            <header className="border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 py-4">
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
            <main className="max-w-4xl mx-auto px-6 py-12">
                <article className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Post</span>
                            <p className="text-xs text-gray-600">
                                {new Date(post.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                            {post.content}
                        </p>
                    </div>
                </article>

                {/* Divider */}
                <div className="border-t border-[#2a2a2a] my-8"></div>

                {/* Comments */}
                <CommentSection
                    type="post"
                    id={post.id}
                    comments={post.comments || []}
                />
            </main>
        </div>
    );
}
