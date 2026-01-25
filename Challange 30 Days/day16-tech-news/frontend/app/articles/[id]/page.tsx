import React from 'react';
import Image from 'next/image';
import { Calendar, User, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CommentSection from '@/components/CommentSection';
import { notFound } from 'next/navigation';

// Helper for fetching single article
async function getArticle(id: string) {
    try {
        const res = await fetch(`http://localhost:8000/api/articles/${id}`, {
            cache: 'no-store'
        });
        if (!res.ok) return null;
        return res.json();
    } catch (e) {
        return null;
    }
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
    const resolvedParams = await Promise.resolve(params);
    const data = await getArticle(resolvedParams.id);

    // Handle different API response structures (wrapper vs direct)
    const article = data?.data || data;

    if (!article) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to News
            </Link>

            <article className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100">
                {/* Header */}
                <header className="mb-10 text-center">
                    <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-bold tracking-wide uppercase mb-6">
                        {article.category?.name || 'General'}
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
                        {article.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-gray-900">{article.author?.name || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(article.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>5 min read</span>
                        </div>
                    </div>
                </header>

                {/* Cover Image */}
                <div className="relative w-full h-[400px] sm:h-[500px] mb-12 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                        src={article.image_url || 'https://placehold.co/1200x600/e2e8f0/1e293b?text=Article+Image'}
                        alt={article.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                        priority
                    />
                </div>

                {/* Content */}
                <div className="prose prose-lg prose-blue mx-auto text-gray-700 leading-relaxed">
                    {/* Basic newline rendering, or use a markdown parser if content is markdown */}
                    {article.body ? article.body.split('\n').map((p: string, i: number) => (
                        <p key={i}>{p}</p>
                    )) : 'No content available.'}
                </div>

                {/* Comments */}
                <CommentSection
                    articleId={article.id}
                    initialComments={article.comments || []}
                />
            </article>
        </div>
    );
}
