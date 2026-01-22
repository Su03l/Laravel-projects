'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import TweetCard from '@/components/TweetCard';
import FollowButton from '@/components/FollowButton';
import { ArrowRight } from 'lucide-react';

interface User {
    id: number;
    name: string;
    username: string;
    joined_at?: string;
    stats?: {
        tweets_count: number;
        followers_count: number;
        following_count: number;
    };
    is_following?: boolean;
    is_me?: boolean;
}

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
    params: Promise<{ username: string }>;
}

export default function ProfilePage({ params }: PageProps) {
    const { username } = use(params);
    const [user, setUser] = useState<User | null>(null);
    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setError(null);
                const response = await api.get(`/users/${username}`);
                const data = response.data;
                setUser(data.user);
                setTweets(data.tweets?.data || data.tweets || []);
            } catch (err: unknown) {
                const error = err as { response?: { status?: number } };
                if (error.response?.status === 404) {
                    setError('المستخدم غير موجود');
                } else {
                    setError('فشل تحميل الملف الشخصي');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [username]);

    const handleFollowChange = (isFollowing: boolean) => {
        if (user && user.stats) {
            setUser({
                ...user,
                is_following: isFollowing,
                stats: {
                    ...user.stats,
                    followers_count: isFollowing
                        ? user.stats.followers_count + 1
                        : user.stats.followers_count - 1,
                },
            });
        }
    };

    if (isLoading) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-16">
                <div className="border border-white/20 bg-white/5 p-12 text-center">
                    <div className="inline-block h-8 w-8 animate-spin border-4 border-white border-r-transparent"></div>
                    <p className="mt-4 text-white/50">جاري التحميل...</p>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-16">
                <div className="border border-white/30 bg-white/5 p-8 text-center">
                    <p className="text-lg font-medium text-white">{error || 'المستخدم غير موجود'}</p>
                </div>
            </div>
        );
    }

    const cleanUsername = user.username?.replace(/^@/, '') || '';

    return (
        <div className="mx-auto max-w-2xl px-4 py-8">
            {/* Back Link */}
            <Link
                href="/"
                className="mb-6 inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors"
            >
                <ArrowRight className="h-4 w-4" />
                <span>العودة للرئيسية</span>
            </Link>

            {/* Profile Header */}
            <header className="border border-white/20 bg-white/5 p-6 mb-6">
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="h-20 w-20 shrink-0 bg-blue-500 flex items-center justify-center text-white font-bold text-3xl">
                        {cleanUsername[0]?.toUpperCase() || '?'}
                    </div>

                    <div className="flex-1">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-black text-white">{user.name}</h1>
                                <p className="text-white/50">@{cleanUsername}</p>
                                {user.joined_at && (
                                    <p className="text-sm text-white/30 mt-1">انضم في {user.joined_at}</p>
                                )}
                            </div>
                            {!user.is_me && (
                                <FollowButton
                                    userId={user.id}
                                    isFollowing={user.is_following || false}
                                    onFollowChange={handleFollowChange}
                                />
                            )}
                        </div>

                        {/* Stats */}
                        {user.stats && (
                            <div className="mt-4 flex gap-6">
                                <div>
                                    <span className="text-xl font-bold text-white">{user.stats.followers_count}</span>
                                    <span className="mr-1 text-white/40">متابِع</span>
                                </div>
                                <div>
                                    <span className="text-xl font-bold text-white">{user.stats.following_count}</span>
                                    <span className="mr-1 text-white/40">يتابع</span>
                                </div>
                                <div>
                                    <span className="text-xl font-bold text-white">{user.stats.tweets_count}</span>
                                    <span className="mr-1 text-white/40">تغريدة</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* User Tweets */}
            <section>
                <header className="mb-4">
                    <h2 className="text-xl font-bold text-white">التغريدات</h2>
                </header>

                {tweets && tweets.length > 0 ? (
                    <div className="space-y-4">
                        {tweets.map((tweet) => (
                            <TweetCard
                                key={tweet.id}
                                tweet={{
                                    ...tweet,
                                    author: tweet.author || {
                                        id: user.id,
                                        name: user.name,
                                        username: cleanUsername,
                                    },
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="border border-white/20 bg-white/5 p-12 text-center">
                        <div className="mx-auto mb-4 h-16 w-16 bg-white/10 flex items-center justify-center">
                            <svg className="h-8 w-8 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <p className="text-lg font-medium text-white/70">لا توجد تغريدات بعد</p>
                    </div>
                )}
            </section>
        </div>
    );
}
