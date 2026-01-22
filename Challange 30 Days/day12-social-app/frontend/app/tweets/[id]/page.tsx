'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';
import { useModal } from '@/contexts/ModalContext';

interface Tweet {
    id: number;
    content: string;
    created_at: string;
    author?: {
        id: number;
        name: string;
        username: string;
    };
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function TweetDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const { openLoginModal } = useModal();
    const [tweet, setTweet] = useState<Tweet | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated) {
            openLoginModal();
            router.push('/');
            return;
        }

        const fetchTweet = async () => {
            try {
                setError(null);
                const response = await api.get(`/tweets/${id}`);
                setTweet(response.data.data || response.data);
            } catch (err: unknown) {
                const error = err as { response?: { status?: number } };
                if (error.response?.status === 404) {
                    setError('التغريدة غير موجودة');
                } else {
                    setError('فشل تحميل التغريدة');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchTweet();
    }, [id, isAuthenticated, authLoading, router, openLoginModal]);

    if (authLoading) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-16">
                <div className="border border-[#2a2a2a] bg-[#141414] p-12 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#6366f1] border-r-transparent"></div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-16">
                <div className="border border-[#2a2a2a] bg-[#141414] p-12 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#6366f1] border-r-transparent"></div>
                    <p className="mt-4 text-gray-400">جاري التحميل...</p>
                </div>
            </div>
        );
    }

    if (error || !tweet) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-16">
                <div className="border border-red-500/30 bg-red-500/10 p-8 text-center">
                    <p className="text-lg font-medium text-red-400">{error || 'التغريدة غير موجودة'}</p>
                    <Link
                        href="/"
                        className="mt-4 inline-block border border-[#2a2a2a] px-6 py-2 font-medium text-white hover:bg-[#1a1a1a]"
                    >
                        العودة للرئيسية
                    </Link>
                </div>
            </div>
        );
    }

    const tweetAuthor = tweet.author;
    const cleanUsername = tweetAuthor?.username?.replace(/^@/, '') || '';

    return (
        <div className="mx-auto max-w-2xl px-4 py-8">
            {/* Back Link */}
            <Link
                href="/"
                className="mb-6 inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
                <span>←</span>
                <span>العودة للرئيسية</span>
            </Link>

            {/* Tweet Detail */}
            <article className="border border-[#2a2a2a] bg-[#141414] p-6">
                {/* Header */}
                <header className="mb-6 flex items-center gap-3 border-b border-[#2a2a2a] pb-6">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center text-white font-bold text-xl">
                        {cleanUsername[0]?.toUpperCase()}
                    </div>
                    <div>
                        <Link
                            href={`/users/${cleanUsername}`}
                            className="text-xl font-bold text-white hover:text-[#6366f1] transition-colors"
                        >
                            @{cleanUsername}
                        </Link>
                        <p className="text-gray-500">{tweetAuthor?.name}</p>
                    </div>
                </header>

                {/* Content */}
                <div className="mb-6">
                    <p className="text-2xl leading-relaxed text-white">{tweet.content}</p>
                </div>

                {/* Footer */}
                <footer className="border-t border-[#2a2a2a] pt-4">
                    <time className="text-sm text-gray-500">
                        {tweet.created_at}
                    </time>
                </footer>
            </article>
        </div>
    );
}
