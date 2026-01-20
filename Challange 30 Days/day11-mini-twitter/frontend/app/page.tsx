'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import api from '@/lib/axios';
import Sidebar from '@/components/Sidebar';
import RightSidebar from '@/components/RightSidebar';
import Tweet from '@/components/Tweet';
import CreateTweetForm from '@/components/CreateTweetForm';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

interface TweetData {
  id: number;
  content: string;
  author?: {
    name: string;
    username: string;
  };
  user?: {
    name: string;
    username: string;
  };
  created_at: string;
  is_mine: boolean;
}

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const { showToast } = useToast();
  const [tweets, setTweets] = useState<TweetData[]>([]);
  const [isLoadingTweets, setIsLoadingTweets] = useState(true);

  const fetchTweets = useCallback(async () => {
    try {
      const response = await api.get('/tweets');
      const tweetsData = response.data.data || response.data.tweets || response.data;
      const validTweets = Array.isArray(tweetsData)
        ? tweetsData.filter((t: TweetData) => t && t.id && (t.author || t.user))
        : [];
      setTweets(validTweets);
    } catch (error) {
      console.error('Failed to fetch tweets:', error);
      setTweets([]);
    } finally {
      setIsLoadingTweets(false);
    }
  }, []);

  useEffect(() => {
    fetchTweets();
  }, [fetchTweets]);

  const handleTweetCreated = () => {
    showToast('تم نشر التغريدة بنجاح!', 'success');
    fetchTweets();
  };

  const handleDeleteTweet = async (id: number) => {
    setTweets(tweets.filter(tweet => tweet.id !== id));

    try {
      await api.delete(`/tweets/${id}`);
      showToast('تم حذف التغريدة', 'success');
    } catch (error) {
      console.error('Failed to delete tweet:', error);
      showToast('فشل في حذف التغريدة', 'error');
      // Refetch on error to restore state
      fetchTweets();
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-feed">
        <header className="feed-header">
          <h1>Home</h1>
        </header>

        {/* Create Tweet Form - Only for authenticated users */}
        {!isLoading && isAuthenticated && (
          <CreateTweetForm onTweetCreated={handleTweetCreated} />
        )}

        {/* Login Banner - Only for guests */}
        {!isLoading && !isAuthenticated && (
          <div className="login-banner">
            <p>Login to share your thoughts</p>
            <Link href="/login" className="login-banner-btn">
              <LogIn size={18} />
              <span>Login to post</span>
            </Link>
          </div>
        )}

        {/* Timeline */}
        <div className="timeline">
          {isLoadingTweets ? (
            <div className="loading">
              <div className="loading-spinner"></div>
            </div>
          ) : tweets.length === 0 ? (
            <div className="empty-timeline">
              <p>No tweets yet. Be the first to post!</p>
            </div>
          ) : (
            tweets.map((tweet, index) => (
              <Tweet key={tweet.id || `tweet-${index}`} tweet={tweet} onDelete={handleDeleteTweet} />
            ))
          )}
        </div>
      </main>

      <RightSidebar />
    </div>
  );
}
