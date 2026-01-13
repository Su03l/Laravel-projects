'use client';

import { useEffect, useState } from 'react';
import { postsApi, videosApi, Post, Video } from '@/lib/api';
import PostCard from '@/components/PostCard';
import VideoCard from '@/components/VideoCard';
import CreatePostForm from '@/components/CreatePostForm';
import CreateVideoForm from '@/components/CreateVideoForm';

type TabType = 'posts' | 'videos';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showVideoForm, setShowVideoForm] = useState(false);

  const fetchPosts = async () => {
    try {
      const response = await postsApi.getAll();
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchVideos = async () => {
    try {
      const response = await videosApi.getAll();
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchPosts(), fetchVideos()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handlePostCreated = () => {
    setShowPostForm(false);
    fetchPosts();
  };

  const handleVideoCreated = () => {
    setShowVideoForm(false);
    fetchVideos();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">Comments System</h1>
                <p className="text-sm text-gray-500">Polymorphic comments for posts & videos</p>
              </div>
            </div>

            {/* Create Button */}
            <button
              onClick={() => activeTab === 'posts' ? setShowPostForm(!showPostForm) : setShowVideoForm(!showVideoForm)}
              className="bg-white text-black px-4 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {activeTab === 'posts' ? 'New Post' : 'New Video'}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-[#1a1a1a] p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${activeTab === 'posts'
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Posts
                {posts.length > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'posts' ? 'bg-black/10' : 'bg-white/10'
                    }`}>
                    {posts.length}
                  </span>
                )}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${activeTab === 'videos'
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Videos
                {videos.length > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'videos' ? 'bg-black/10' : 'bg-white/10'
                    }`}>
                    {videos.length}
                  </span>
                )}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <svg className="animate-spin w-8 h-8 mx-auto mb-4 text-gray-400" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-gray-500">Loading content...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div>
                {showPostForm && (
                  <CreatePostForm
                    onSuccess={handlePostCreated}
                    onCancel={() => setShowPostForm(false)}
                  />
                )}

                {posts.length === 0 ? (
                  <div className="text-center py-20">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-400 mb-2">No posts yet</h3>
                    <p className="text-gray-600 mb-4">Create your first post to get started</p>
                    <button
                      onClick={() => setShowPostForm(true)}
                      className="bg-white text-black px-5 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-all"
                    >
                      Create Post
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Videos Tab */}
            {activeTab === 'videos' && (
              <div>
                {showVideoForm && (
                  <CreateVideoForm
                    onSuccess={handleVideoCreated}
                    onCancel={() => setShowVideoForm(false)}
                  />
                )}

                {videos.length === 0 ? (
                  <div className="text-center py-20">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-400 mb-2">No videos yet</h3>
                    <p className="text-gray-600 mb-4">Add your first video to get started</p>
                    <button
                      onClick={() => setShowVideoForm(true)}
                      className="bg-white text-black px-5 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-all"
                    >
                      Add Video
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {videos.map((video) => (
                      <VideoCard key={video.id} video={video} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] py-6 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-600">
          Polymorphic Comments System • Built with Next.js & Laravel
        </div>
      </footer>
    </div>
  );
}
