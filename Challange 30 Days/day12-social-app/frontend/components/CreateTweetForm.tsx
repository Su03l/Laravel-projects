'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

interface CreateTweetFormProps {
    onTweetCreated?: () => void;
}

export default function CreateTweetForm({ onTweetCreated }: CreateTweetFormProps) {
    const { isAuthenticated, user } = useAuth();
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isAuthenticated) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            toast.error('التغريدة لا يمكن أن تكون فارغة');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post('/tweets', { content: content.trim() });
            toast.success('تم نشر التغريدة بنجاح');
            setContent('');
            onTweetCreated?.();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            const message = err.response?.data?.message || 'فشل نشر التغريدة';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="border border-white/20 bg-white/5 p-5 mb-6">
            <div className="flex gap-4">
                {/* Avatar */}
                <div className="h-12 w-12 shrink-0 bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                    {user?.username?.[0]?.toUpperCase() || '?'}
                </div>

                <div className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="ماذا يحدث؟"
                        rows={3}
                        maxLength={280}
                        className="w-full bg-transparent border-none text-lg text-white placeholder-white/40 resize-none focus:outline-none"
                    />

                    <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                        <span className="text-sm text-white/40">
                            {content.length}/280
                        </span>
                        <button
                            type="submit"
                            disabled={isSubmitting || !content.trim()}
                            className="bg-blue-500 px-6 py-2 font-bold text-white transition-colors hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'جاري النشر...' : 'تغريد'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
