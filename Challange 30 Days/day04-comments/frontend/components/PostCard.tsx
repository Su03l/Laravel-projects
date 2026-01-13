'use client';

import Link from 'next/link';
import { Post } from '@/lib/api';

interface PostCardProps {
    post: Post;
}

export default function PostCard({ post }: PostCardProps) {
    return (
        <Link href={`/posts/${post.id}`}>
            <article className="group bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 hover:border-white/20 hover:bg-[#161616] transition-all duration-300 cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <span className="text-xs text-gray-500">
                        {new Date(post.created_at).toLocaleDateString()}
                    </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-gray-200 transition-colors line-clamp-2">
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
                        {post.comments?.length || 0} comments
                    </span>
                    <span className="ml-auto text-white/50 group-hover:text-white transition-colors">
                        Read more →
                    </span>
                </div>
            </article>
        </Link>
    );
}
