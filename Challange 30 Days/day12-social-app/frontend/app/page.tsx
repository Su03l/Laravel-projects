'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import TweetCard from '@/components/TweetCard';
import CreateTweetForm from '@/components/CreateTweetForm';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, Hash, Users, Sparkles, MessageSquare, Heart, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

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

interface SuggestedUser {
  id: number;
  name: string;
  username: string;
  tweets_count: number;
}

// Trending topics (static for UI)
const trendingTopics = [
  { tag: 'Laravel', tweets: '2.5K' },
  { tag: 'برمجة', tweets: '1.8K' },
  { tag: 'تقنية', tweets: '1.2K' },
  { tag: 'React', tweets: '980' },
  { tag: 'تصميم', tweets: '756' },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followingIds, setFollowingIds] = useState<number[]>([]);

  const fetchTweets = useCallback(async () => {
    try {
      setError(null);
      const response = await api.get('/tweets');
      setTweets(response.data.data || response.data);
    } catch {
      setError('فشل تحميل التغريدات');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSuggestedUsers = useCallback(async () => {
    try {
      const response = await api.get('/users-suggested');
      setSuggestedUsers(response.data.users || []);
    } catch {
      console.error('Failed to fetch suggested users');
    }
  }, []);

  useEffect(() => {
    fetchTweets();
    fetchSuggestedUsers();
  }, [fetchTweets, fetchSuggestedUsers]);

  const handleFollow = async (userId: number) => {
    if (!isAuthenticated) {
      toast.error('يجب تسجيل الدخول أولاً');
      return;
    }

    try {
      await api.post('/follow', { user_id: userId });
      setFollowingIds(prev => [...prev, userId]);
      toast.success('تمت المتابعة');
    } catch {
      toast.error('فشلت المتابعة');
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-6 py-8" style={{ maxWidth: '1200px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Content - 8 columns */}
          <main className="lg:col-span-8">
            {/* Header */}
            <header className="mb-8">
              <h1 className="text-4xl font-black text-white flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-blue-400" />
                الرئيسية
              </h1>
              <p className="mt-3 text-lg text-white/50">
                آخر التغريدات من المجتمع
              </p>
            </header>

            {/* Create Tweet Form */}
            <CreateTweetForm onTweetCreated={fetchTweets} />

            {/* Feed */}
            <section className="space-y-5">
              {isLoading ? (
                <div className="border border-white/20 bg-white/5 p-16 text-center">
                  <div className="inline-block h-10 w-10 animate-spin border-4 border-blue-500 border-r-transparent"></div>
                  <p className="mt-5 text-white/50 text-lg">جاري التحميل...</p>
                </div>
              ) : error ? (
                <div className="border border-white/30 bg-white/5 p-12 text-center">
                  <p className="text-xl font-medium text-white">{error}</p>
                  <button
                    onClick={fetchTweets}
                    className="mt-5 border border-blue-500 text-blue-400 px-8 py-3 font-medium hover:bg-blue-500 hover:text-white transition-colors"
                  >
                    إعادة المحاولة
                  </button>
                </div>
              ) : tweets.length === 0 ? (
                <div className="border border-white/20 bg-white/5 p-16 text-center">
                  <div className="mx-auto mb-5 h-20 w-20 bg-white/10 flex items-center justify-center">
                    <MessageSquare className="h-10 w-10 text-white/40" />
                  </div>
                  <p className="text-xl font-medium text-white/70">لا توجد تغريدات بعد</p>
                  <p className="mt-3 text-white/40">كن أول من يغرد!</p>
                </div>
              ) : (
                tweets.map((tweet) => (
                  <TweetCard key={tweet.id} tweet={tweet} />
                ))
              )}
            </section>
          </main>

          {/* Sidebar - 4 columns */}
          <aside className="hidden lg:block lg:col-span-4 space-y-6">
            {/* Quick Stats */}
            <div className="border border-white/20 bg-white/5 p-6">
              <h3 className="font-bold text-white mb-5 flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-yellow-400" />
                إحصائيات سريعة
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-500/10 border border-blue-500/20">
                  <MessageSquare className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-white">{tweets.length}</p>
                  <p className="text-sm text-white/50 mt-1">تغريدة</p>
                </div>
                <div className="text-center p-4 bg-pink-500/10 border border-pink-500/20">
                  <Heart className="h-6 w-6 text-pink-400 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-white">∞</p>
                  <p className="text-sm text-white/50 mt-1">إعجاب</p>
                </div>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="border border-white/20 bg-white/5 p-6">
              <h3 className="font-bold text-white mb-5 flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-green-400" />
                المواضيع الرائجة
              </h3>
              <div className="space-y-4">
                {trendingTopics.map((topic, index) => (
                  <div key={topic.tag} className="flex items-center justify-between group cursor-pointer py-1">
                    <div className="flex items-center gap-3">
                      <span className="text-white/30 text-sm w-4">{index + 1}</span>
                      <Hash className="h-4 w-4 text-blue-400" />
                      <span className="text-white group-hover:text-blue-400 transition-colors">{topic.tag}</span>
                    </div>
                    <span className="text-sm text-white/40">{topic.tweets}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Users from API */}
            {suggestedUsers.length > 0 && (
              <div className="border border-white/20 bg-white/5 p-6">
                <h3 className="font-bold text-white mb-5 flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-purple-400" />
                  اقتراحات للمتابعة
                </h3>
                <div className="space-y-5">
                  {suggestedUsers.map((u) => (
                    <div key={u.id} className="flex items-center gap-4">
                      <Link href={`/users/${u.username}`}>
                        <div className="h-12 w-12 bg-blue-500 flex items-center justify-center text-white font-bold text-lg shrink-0 hover:opacity-80 transition-opacity">
                          {u.name[0]?.toUpperCase()}
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/users/${u.username}`} className="block">
                          <p className="font-medium text-white truncate hover:underline">{u.name}</p>
                        </Link>
                        <p className="text-sm text-white/40 truncate">@{u.username} • {u.tweets_count} تغريدة</p>
                      </div>
                      {isAuthenticated && !followingIds.includes(u.id) ? (
                        <button
                          onClick={() => handleFollow(u.id)}
                          className="text-sm bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition-colors shrink-0"
                        >
                          متابعة
                        </button>
                      ) : followingIds.includes(u.id) ? (
                        <span className="text-sm text-green-400 shrink-0">متابَع ✓</span>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action for Guests */}
            {!isAuthenticated && (
              <div className="border border-blue-500/30 bg-blue-500/10 p-6">
                <h3 className="font-bold text-white text-lg mb-3">انضم للمجتمع! 🚀</h3>
                <p className="text-white/60 mb-5">
                  سجّل الآن وشارك أفكارك مع الآخرين
                </p>
                <div className="flex gap-3">
                  <Link
                    href="/register"
                    className="flex-1 text-center bg-blue-500 py-3 font-medium text-white hover:bg-blue-600 transition-colors"
                  >
                    تسجيل
                  </Link>
                  <Link
                    href="/login"
                    className="flex-1 text-center border border-white/20 py-3 font-medium text-white hover:bg-white/10 transition-colors"
                  >
                    دخول
                  </Link>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="text-center py-5 border border-white/10 bg-white/5">
              <p className="font-medium text-white/50">تحدي 30 يوم - 30 مشروع</p>
              <p className="mt-2 text-sm text-white/30">اليوم 12: تغريداتي</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
