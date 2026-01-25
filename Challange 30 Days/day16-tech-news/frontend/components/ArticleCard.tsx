'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, MessageSquare, Share2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface ArticleProps {
    id: number;
    title: string;
    excerpt: string;
    image_url?: string;
    author: {
        name: string;
        avatar?: string;
    };
    category: {
        name: string;
    };
    created_at: string;
}

export default function ArticleCard({ article }: { article: ArticleProps }) {
    const { user, openLoginModal } = useAuth();

    const handleInteraction = (e: React.MouseEvent) => {
        if (!user) {
            e.preventDefault();
            openLoginModal();
        } else {
            // Proceed with action (e.g., like)
            // For now, just a console log or placeholder
            console.log("User authorized for interaction");
        }
    };

    return (
        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
            {/* Image Section */}
            <div className="relative h-48 w-full bg-gray-200">
                <Image
                    src={article.image_url || 'https://placehold.co/600x400/e2e8f0/1e293b?text=No+Image'}
                    alt={article.title}
                    fill
                    className="object-cover"
                />
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold text-primary rounded-full uppercase tracking-wider shadow-sm">
                        {article.category.name}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                    <span className="font-medium text-gray-800">{article.author.name}</span>
                    <span>•</span>
                    <span>{article.created_at}</span>
                </div>

                <Link href={`/articles/${article.id}`}>
                    <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                    </h2>
                </Link>

                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {article.excerpt}
                </p>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleInteraction}
                            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors group"
                        >
                            <Heart className="w-4 h-4 group-hover:fill-current" />
                            <span>Like</span>
                        </button>
                        <button
                            onClick={handleInteraction}
                            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-500 transition-colors"
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span>Comment</span>
                        </button>
                    </div>

                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </article>
    );
}
