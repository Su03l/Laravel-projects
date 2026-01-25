'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Loader2, Trash2, Edit, Plus, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Article {
    id: number;
    title: string;
    excerpt: string;
    image_url?: string;
    created_at: string;
    category?: { name: string };
}

export default function MyArticles() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
            return;
        }

        const fetchMyArticles = async () => {
            if (!user) return;
            try {
                const { data } = await api.get(`/articles?user_id=${user.id}`);
                setArticles(data.data || []);
            } catch (error) {
                console.error('Failed to fetch articles', error);
            } finally {
                setIsLoadingData(false);
            }
        };

        if (user) {
            fetchMyArticles();
        }
    }, [user, loading, router]);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) return;

        try {
            await api.delete(`/articles/${id}`);
            setArticles(articles.filter(a => a.id !== id));
        } catch (error) {
            console.error('Failed to delete', error);
            alert('Failed to delete article');
        }
    };

    if (loading || isLoadingData) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <FileText className="text-primary w-8 h-8" />
                        My Articles
                    </h1>
                    <p className="text-gray-500 mt-1">Manage your published content</p>
                </div>

                <Link
                    href="/articles/create"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Write New Article
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {articles.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase">Article</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase">Category</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase">Date</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {articles.map((article) => (
                                    <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-12 relative bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={article.image_url || 'https://placehold.co/100x100'}
                                                        alt=""
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <Link href={`/articles/${article.id}`} className="font-medium text-gray-900 hover:text-primary line-clamp-1">
                                                        {article.title}
                                                    </Link>
                                                    <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{article.excerpt}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                                                {article.category?.name || 'General'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(article.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                {/* Edit support could come later */}
                                                <button className="text-gray-400 hover:text-primary transition-colors disabled:opacity-50" disabled title="Edit coming soon">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(article.id)}
                                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-10 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                            <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No articles yet</h3>
                        <p className="text-gray-500 mb-6">Start sharing your thoughts with the world.</p>
                        <Link
                            href="/articles/create"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Write Article
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
