'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { AtSign, Lock, LogIn, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
        setIsSubmitting(true);

        const success = await login(email, password);
        if (success) {
            router.push('/');
        }

        setIsSubmitting(false);
    };

    return (
        <div className="mx-auto max-w-md px-4 py-16">
            <div className="border border-white/20 bg-white/5 p-8">
                <header className="mb-8 text-center">
                    <div className="mx-auto mb-4 h-16 w-16 bg-blue-500 flex items-center justify-center">
                        <LogIn className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white">تسجيل الدخول</h1>
                    <p className="mt-2 text-white/50">
                        مرحباً بعودتك
                    </p>
                </header>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
                            البريد الإلكتروني أو اسم المستخدم
                        </label>
                        <div className="relative">
                            <AtSign className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                            <input
                                type="text"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full border border-white/20 bg-black pr-10 p-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                                placeholder="user@example.com أو username"
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

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-500 py-3 font-bold text-white transition-colors hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <div className="h-5 w-5 animate-spin border-2 border-white border-r-transparent" />
                        ) : (
                            <>
                                <LogIn className="h-5 w-5" />
                                <span>دخول</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <footer className="mt-8 text-center">
                    <p className="text-white/50">
                        ليس لديك حساب؟{' '}
                        <Link href="/register" className="font-medium text-blue-400 hover:underline">
                            سجّل الآن
                        </Link>
                    </p>
                </footer>
            </div>
        </div>
    );
}
