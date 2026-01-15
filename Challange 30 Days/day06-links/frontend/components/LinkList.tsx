'use client';

import { useState, useEffect, useCallback } from 'react';
import { getLinks, getRedirectUrl, Link } from '@/lib/api';

interface LinkListProps {
    refreshTrigger: number;
    onShowToast: (message: string) => void;
}

export default function LinkList({ refreshTrigger, onShowToast }: LinkListProps) {
    const [links, setLinks] = useState<Link[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchLinks = useCallback(async (showRefreshState = false) => {
        if (showRefreshState) {
            setIsRefreshing(true);
        }
        try {
            const data = await getLinks();
            setLinks(data);
        } catch (error) {
            console.error('Failed to fetch links:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchLinks();
    }, [fetchLinks, refreshTrigger]);

    const handleRefresh = () => {
        fetchLinks(true);
        onShowToast('Links refreshed!');
    };

    const copyLink = async (code: string) => {
        try {
            await navigator.clipboard.writeText(getRedirectUrl(code));
            onShowToast('Link copied!');
        } catch {
            onShowToast('Failed to copy');
        }
    };

    const truncateUrl = (url: string, maxLength = 40) => {
        if (url.length <= maxLength) return url;
        return url.substring(0, maxLength) + '...';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <div className="w-full max-w-4xl mx-auto mt-12">
                <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto mt-12">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-white">روابطك</h3>
                    <p className="text-zinc-400">تتبع النقرات وأدر روابطك المختصرة</p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 disabled:opacity-50"
                >
                    <svg
                        className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                    تحديث
                </button>
            </div>

            {links.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                        <svg
                            className="h-8 w-8 text-zinc-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            />
                        </svg>
                    </div>
                    <h4 className="text-lg font-medium text-white">لا توجد روابط بعد</h4>
                    <p className="mt-1 text-zinc-400">اختصر أول رابط لك للبدء!</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">
                                    الرابط الأصلي
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">
                                    الكود المختصر
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-medium text-zinc-400">
                                    الزيارات
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-medium text-zinc-400">
                                    تاريخ الإنشاء
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {links.map((link) => (
                                <tr
                                    key={link.id}
                                    className="group transition-colors duration-200 hover:bg-white/5"
                                >
                                    <td className="px-6 py-4">
                                        <a
                                            href={link.original_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-zinc-300 transition-colors hover:text-white"
                                            title={link.original_url}
                                        >
                                            {truncateUrl(link.original_url)}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={getRedirectUrl(link.code)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-mono text-white transition-colors hover:text-zinc-300"
                                            >
                                                {link.code}
                                            </a>
                                            <button
                                                onClick={() => copyLink(link.code)}
                                                className="rounded-lg p-1.5 text-zinc-500 opacity-0 transition-all duration-200 hover:bg-white/10 hover:text-white group-hover:opacity-100"
                                                title="Copy link"
                                            >
                                                <svg
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex min-w-[3rem] items-center justify-center rounded-full bg-white px-3 py-1 text-sm font-bold text-black">
                                            {link.visits}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm text-zinc-400">
                                        {formatDate(link.created_at)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
