'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/axios';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { Loader2, ArrowRight, Eye, EyeOff, Mail, User, Phone, IdCard, Calendar, Lock } from 'lucide-react';

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const password = watch('password');

    const onSubmit = async (data: Record<string, any>) => {
        setLoading(true);
        try {
            await api.post('/register', data);
            toast.success('تم إنشاء الحساب بنجاح! نرجو تسجيل الدخول.');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
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
                        <div className="relative">
                            <label className="block text-sm font-medium text-slate-300 mb-1">الاسم الكامل</label>
                            <input
                                {...register('name', { required: true })}
                                className="w-full pr-12 pl-4 py-3 bg-brand-bg border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all text-white placeholder:text-slate-600"
                                placeholder="أحمد محمد"
                            />
                            <div className="absolute right-4 top-[38px] text-slate-500">
                                <User className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-slate-300 mb-1">البريد الإلكتروني</label>
                            <input
                                {...register('email', { required: true })}
                                type="email"
                                className="w-full pr-12 pl-4 py-3 bg-brand-bg border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all text-white placeholder:text-slate-600"
                                placeholder="name@example.com"
                            />
                            <div className="absolute right-4 top-[38px] text-slate-500">
                                <Mail className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-medium text-slate-300 mb-1">رقم الجوال</label>
                                <input
                                    {...register('phone', {
                                        required: true,
                                        pattern: /^05\d{8}$/
                                    })}
                                    maxLength={10}
                                    className="w-full pr-12 pl-4 py-3 bg-brand-bg border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all text-white placeholder:text-slate-600"
                                    placeholder="05xxxxxxxx"
                                />
                                <div className="absolute right-4 top-[38px] text-slate-500">
                                    <Phone className="w-5 h-5" />
                                </div>
                                {errors.phone && <p className="text-[10px] text-red-500 mt-1">يجب أن يبدأ بـ 05 ويتكون من 10 أرقام</p>}
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-medium text-slate-300 mb-1">الهوية الوطنية</label>
                                <input
                                    {...register('national_id', {
                                        required: true,
                                        minLength: 10,
                                        maxLength: 10
                                    })}
                                    maxLength={10}
                                    className="w-full pr-12 pl-4 py-3 bg-brand-bg border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all text-white placeholder:text-slate-600"
                                    placeholder="1xxxxxxxxx"
                                />
                                <div className="absolute right-4 top-[38px] text-slate-500">
                                    <IdCard className="w-5 h-5" />
                                </div>
                                {errors.national_id && <p className="text-[10px] text-red-500 mt-1">يجب أن تكون 10 أرقام</p>}
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-slate-300 mb-1">تاريخ الميلاد</label>
                            <input
                                {...register('dob', { required: true })}
                                type="date"
                                className="w-full pr-12 pl-4 py-3 bg-brand-bg border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all text-white"
                            />
                            <div className="absolute right-4 top-[38px] text-slate-500">
                                <Calendar className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-slate-300 mb-1">كلمة المرور</label>
                            <input
                                {...register('password', { required: true, minLength: 6 })}
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
                            {errors.password && <p className="text-[10px] text-red-500 mt-1">يجب أن تكون 6 أحرف على الأقل</p>}
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-slate-300 mb-1">تأكيد كلمة المرور</label>
                            <input
                                {...register('confirmPassword', {
                                    required: true,
                                    validate: (value) => value === password || 'كلمات المرور غير متطابقة'
                                })}
                                type={showConfirmPassword ? 'text' : 'password'}
                                className="w-full pr-12 pl-12 py-3 bg-brand-bg border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all text-white placeholder:text-slate-600"
                                placeholder="••••••••"
                            />
                            <div className="absolute right-4 top-[38px] text-slate-500">
                                <Lock className="w-5 h-5" />
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute left-3 top-[38px] text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                            {errors.confirmPassword && <p className="text-[10px] text-red-500 mt-1">{errors.confirmPassword.message as string}</p>}
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
