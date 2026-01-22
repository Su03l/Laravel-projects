'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, User, AtSign, UserPlus, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <div className="mx-auto max-w-md px-4 py-16">
                <div className="border border-white/20 bg-white/5 p-12 text-center">
                    <div className="inline-block h-8 w-8 animate-spin border-4 border-blue-500 border-r-transparent"></div>
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== passwordConfirmation) {
            toast.error('كلمات المرور غير متطابقة');
            return;
        }

        setIsSubmitting(true);

        try {
            const { default: api } = await import('@/lib/axios');
            await api.post('/auth/register', {
                name,
                username,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            toast.success('تم إنشاء الحساب بنجاح! جاري التوجيه...');

            // Wait 2 seconds then redirect to login
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
            if (err.response?.data?.errors) {
                const firstError = Object.values(err.response.data.errors)[0];
                toast.error(firstError?.[0] || 'فشل إنشاء الحساب');
            } else {
                toast.error(err.response?.data?.message || 'فشل إنشاء الحساب');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-md px-4 py-16">
            <div className="border border-white/20 bg-white/5 p-8">
                {/* Header */}
                <header className="mb-8 text-center">
                    <div className="mx-auto mb-4 h-16 w-16 bg-blue-500 flex items-center justify-center">
                        <UserPlus className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white">إنشاء حساب</h1>
                    <p className="mt-2 text-white/50">
                        انضم إلينا اليوم
                    </p>
                </header>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-2">
                            الاسم الكامل
                        </label>
                        <div className="relative">
                            <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full border border-white/20 bg-black pr-10 p-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                                placeholder="أحمد محمد"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-white/70 mb-2">
                            اسم المستخدم
                        </label>
                        <div className="relative">
                            <AtSign className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full border border-white/20 bg-black pr-10 p-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                                placeholder="ahmed_dev"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
                            البريد الإلكتروني
                        </label>
                        <div className="relative">
                            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full border border-white/20 bg-black pr-10 p-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                                placeholder="user@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-2">
                            كلمة المرور
                        </label>
                        <div className="relative">
                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                                className="w-full border border-white/20 bg-black pr-10 pl-10 p-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-white/70 mb-2">
                            تأكيد كلمة المرور
                        </label>
                        <div className="relative">
                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="password_confirmation"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                required
                                minLength={8}
                                className="w-full border border-white/20 bg-black pr-10 pl-10 p-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-500 py-3 font-bold text-white transition-colors hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <div className="h-5 w-5 animate-spin border-2 border-white border-r-transparent" />
                        ) : (
                            <>
                                <UserPlus className="h-5 w-5" />
                                <span>إنشاء حساب</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <footer className="mt-8 text-center">
                    <p className="text-white/50">
                        لديك حساب؟{' '}
                        <Link href="/login" className="font-medium text-blue-400 hover:underline">
                            سجّل دخولك
                        </Link>
                    </p>
                </footer>
            </div>
        </div>
    );
}
