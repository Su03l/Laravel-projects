'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/axios';
import { useUserStore } from '@/store/useUserStore';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { Loader2, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
    const { setAuth } = useUserStore();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const response = await api.post('/register', data);
            const { token } = response.data;

            // Get user data
            const userResponse = await api.get('/me', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setAuth(userResponse.data.data, token);
            toast.success('تم إنشاء الحساب بنجاح');
            window.location.href = '/dashboard';
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'فشل التسجيل');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-brand-dark py-12">
            <Toaster position="top-center" />
            <div className="w-full max-w-md space-y-8 glass p-8 rounded-2xl">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-brand-blue tracking-tight">PayFlow</h1>
                    <p className="mt-2 text-slate-400">انضم إلينا وابدأ رحلتك المالية اليوم</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">الاسم الكامل</label>
                            <input
                                {...register('name', { required: true })}
                                className="w-full px-4 py-3 bg-brand-bg border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all text-white placeholder:text-slate-600"
                                placeholder="أحمد محمد"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">البريد الإلكتروني</label>
                            <input
                                {...register('email', { required: true })}
                                type="email"
                                className="w-full px-4 py-3 bg-brand-bg border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all text-white placeholder:text-slate-600"
                                placeholder="name@example.com"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">رقم الجوال</label>
                                <input
                                    {...register('phone', {
                                        required: true,
                                        pattern: /^05\d{8}$/
                                    })}
                                    className="w-full px-4 py-3 bg-brand-bg border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all text-white placeholder:text-slate-600"
                                    placeholder="05xxxxxxxx"
                                />
                                {errors.phone && <p className="text-[10px] text-red-500 mt-1">يجب أن يبدأ بـ 05 ويتكون من 10 أرقام</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">الهوية الوطنية</label>
                                <input
                                    {...register('national_id', {
                                        required: true,
                                        minLength: 10,
                                        maxLength: 10
                                    })}
                                    className="w-full px-4 py-3 bg-brand-bg border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all text-white placeholder:text-slate-600"
                                    placeholder="1xxxxxxxxx"
                                />
                                {errors.national_id && <p className="text-[10px] text-red-500 mt-1">يجب أن تكون 10 أرقام</p>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">تاريخ الميلاد</label>
                            <input
                                {...register('dob', { required: true })}
                                type="date"
                                className="w-full px-4 py-3 bg-brand-bg border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">كلمة المرور</label>
                            <input
                                {...register('password', { required: true, minLength: 8 })}
                                type="password"
                                className="w-full px-4 py-3 bg-brand-bg border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all text-white placeholder:text-slate-600"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 group shadow-lg shadow-brand-blue/20 mt-4"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                إنشاء حساب
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform rotate-180" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-slate-400">
                    لديك حساب بالفعل؟{' '}
                    <Link href="/login" className="text-brand-blue font-semibold hover:underline">
                        سجل دخولك
                    </Link>
                </p>
            </div>
        </div>
    );
}
