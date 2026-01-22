'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function ProfileSettingsPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (user) {
            setName(user.name);
            setUsername(user.username);
            setEmail(user.email);
        }
    }, [isAuthenticated, authLoading, router, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await api.put('/user/profile', { name, username, email });
            toast.success('تم تحديث الملف الشخصي');

            const updatedUser = { ...user, name, username, email };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            window.location.reload();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            const message = err.response?.data?.message || 'فشل التحديث';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading || !isAuthenticated) {
        return (
            <div className="mx-auto max-w-md px-4 py-16">
                <div className="border border-[#2a2a2a] bg-[#141414] p-12 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#6366f1] border-r-transparent"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-md px-4 py-8">
            <Link
                href="/profile"
                className="mb-6 inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
                <span>←</span>
                <span>العودة للوحة التحكم</span>
            </Link>

            <div className="border border-[#2a2a2a] bg-[#141414] p-8">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-black text-white">تعديل الملف الشخصي</h1>
                    <p className="mt-2 text-gray-500">تحديث معلوماتك</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                            الاسم الكامل
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full border border-[#2a2a2a] bg-[#0a0a0a] p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#6366f1]"
                        />
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-2">
                            اسم المستخدم
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full border border-[#2a2a2a] bg-[#0a0a0a] p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#6366f1]"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                            البريد الإلكتروني
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border border-[#2a2a2a] bg-[#0a0a0a] p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#6366f1]"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#6366f1] py-3 font-bold text-white transition-colors hover:bg-[#818cf8] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </button>
                </form>
            </div>
        </div>
    );
}
