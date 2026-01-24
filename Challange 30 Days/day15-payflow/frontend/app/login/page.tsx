'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/axios';
import { useUserStore } from '@/store/useUserStore';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { Loader2, ArrowRight, Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
    const { setAuth } = useUserStore();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data: Record<string, any>) => {
        setLoading(true);
        try {
            const response = await api.post('/login', data);
            const { token } = response.data;

            // Get user data
            const userResponse = await api.get('/me', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setAuth(userResponse.data.data, token);
            toast.success('تم تسجيل الدخول بنجاح');
            window.location.href = '/dashboard';
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'فشل تسجيل الدخول');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-brand-dark">
            <Toaster position="top-center" />
            <div className="w-full max-w-md space-y-8 glass p-8 rounded-2xl">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-brand-blue tracking-tight">PayFlow</h1>
                    <p className="mt-2 text-slate-400">مرحباً بك مجدداً في محفظتك الرقمية</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <label className="block text-sm font-medium text-slate-300 mb-1">البريد الإلكتروني</label>
                            <input
                                {...register('email', { required: true })}
                                type="email"
                                className="w-full pr-12 pl-4 py-3 bg-brand-bg border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all text-white"
                                placeholder="name@example.com"
                            />
                            <div className="absolute right-4 top-[38px] text-slate-500">
                                <Mail className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-slate-300 mb-1">كلمة المرور</label>
                            <input
                                {...register('password', { required: true })}
                                type={showPassword ? 'text' : 'password'}
                                className="w-full pr-12 pl-12 py-3 bg-brand-bg border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all text-white placeholder:text-slate-600"
                                placeholder="••••••••"
                            />
                            <div className="absolute right-4 top-[38px] text-slate-500">
                                <Lock className="w-5 h-5" />
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute left-3 top-[38px] text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 group shadow-lg shadow-brand-blue/20"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                تسجيل الدخول
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform rotate-180" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-slate-400">
                    ليس لديك حساب؟{' '}
                    <Link href="/register" className="text-brand-blue font-semibold hover:underline">
                        سجل الآن
                    </Link>
                </p>
            </div>
        </div>
    );
}
