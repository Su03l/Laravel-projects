import React from 'react';
import ArticleCard from '@/components/ArticleCard';
import { Sparkles } from 'lucide-react';

interface Article {
    id: number;
    title: string;
    excerpt: string;
    category: { name: string };
    author: { name: string };
    created_at: string;
    image_url?: string;
}

async function getArticles() {
    try {
        const res = await fetch('http://localhost:8000/api/articles?page=1', { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

export default async function RecentArticlesPage() {
    const data = await getArticles();
    const articles: Article[] = data.data || [];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-100 text-primary rounded-lg">
                    <Sparkles className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Recent Articles</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.length > 0 ? (
                    articles.map((article: any) => (
                        <ArticleCard key={article.id} article={article} />
                    ))
                ) : (
                    <p className="text-gray-500 col-span-full text-center py-10">
                        No articles found.
                    </p>
                )}
            </div>
        </div>
    );
}
