'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function ChangePasswordPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
    }, [isAuthenticated, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('كلمات المرور غير متطابقة');
            return;
        }

        if (newPassword.length < 8) {
            toast.error('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
            return;
        }

        setIsSubmitting(true);

        try {
            await api.post('/user/change-password', {
                current_password: currentPassword,
                password: newPassword,
                password_confirmation: confirmPassword,
            });
            toast.success('تم تغيير كلمة المرور');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            const message = err.response?.data?.message || 'فشل التغيير';
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
                {/* Header */}
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-black text-white">تغيير كلمة المرور</h1>
                    <p className="mt-2 text-gray-500">تحديث أمان حسابك</p>
                </header>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="current_password" className="block text-sm font-medium text-gray-400 mb-2">
                            كلمة المرور الحالية
                        </label>
                        <input
                            type="password"
                            id="current_password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            className="w-full border border-[#2a2a2a] bg-[#0a0a0a] p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#6366f1]"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label htmlFor="new_password" className="block text-sm font-medium text-gray-400 mb-2">
                            كلمة المرور الجديدة
                        </label>
                        <input
                            type="password"
                            id="new_password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={8}
                            className="w-full border border-[#2a2a2a] bg-[#0a0a0a] p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#6366f1]"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-400 mb-2">
                            تأكيد كلمة المرور الجديدة
                        </label>
                        <input
                            type="password"
                            id="confirm_password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={8}
                            className="w-full border border-[#2a2a2a] bg-[#0a0a0a] p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#6366f1]"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#6366f1] py-3 font-bold text-white transition-colors hover:bg-[#818cf8] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
                    </button>
                </form>
            </div>
        </div>
    );
}
