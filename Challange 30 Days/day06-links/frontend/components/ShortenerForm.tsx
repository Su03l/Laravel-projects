'use client';

import { useState } from 'react';
import { shortenLink, getRedirectUrl } from '@/lib/api';

interface ShortenerFormProps {
    onLinkCreated: () => void;
    onShowToast: (message: string) => void;
}

export default function ShortenerForm({ onLinkCreated, onShowToast }: ShortenerFormProps) {
    const [url, setUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [shortCode, setShortCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.trim()) return;

        setIsLoading(true);
        setError('');
        setShortUrl('');

        try {
            const response = await shortenLink(url);
            setShortUrl(response.short_url);
            setShortCode(response.data.code);
            setUrl('');
            onLinkCreated();
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as { response?: { data?: { message?: string } } };
                setError(axiosError.response?.data?.message || 'Failed to shorten URL. Please try again.');
            } else {
                setError('Failed to shorten URL. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = async () => {
        const fullUrl = getRedirectUrl(shortCode);
        try {
            await navigator.clipboard.writeText(fullUrl);
            onShowToast('Link copied to clipboard!');
        } catch {
            onShowToast('Failed to copy link');
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Main Card */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-black p-8 shadow-2xl backdrop-blur-xl">
                {/* Decorative Elements */}
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-white/5 blur-3xl" />

                <div className="relative z-10">
                    <h2 className="mb-2 text-center text-3xl font-bold text-white">
                        اختصر رابطك
                    </h2>
                    <p className="mb-8 text-center text-zinc-400">
                        حوّل الروابط الطويلة إلى روابط قصيرة سهلة التذكر
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="الصق الرابط الطويل هنا..."
                                className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-lg text-white placeholder-zinc-500 outline-none transition-all duration-300 focus:border-white/30 focus:bg-white/10 focus:ring-2 focus:ring-white/20"
                                disabled={isLoading}
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                <svg
                                    className="h-6 w-6 text-zinc-500"
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
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !url.trim()}
                            className="group relative w-full overflow-hidden rounded-2xl bg-white py-4 text-lg font-semibold text-black transition-all duration-300 hover:bg-zinc-100 hover:shadow-lg hover:shadow-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <>
                                        <svg
                                            className="h-5 w-5 animate-spin"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        جاري الاختصار...
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 10V3L4 14h7v7l9-11h-7z"
                                            />
                                        </svg>
                                        اختصر الرابط
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    {error && (
                        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-red-400">
                            {error}
                        </div>
                    )}

                    {shortUrl && (
                        <div className="mt-6 animate-fade-in rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="mb-2 text-sm text-zinc-400">رابطك المختصر:</p>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 truncate rounded-xl bg-black/50 px-4 py-3 font-mono text-white">
                                    {getRedirectUrl(shortCode)}
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white text-black transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
                                >
                                    <svg
                                        className="h-5 w-5"
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
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
