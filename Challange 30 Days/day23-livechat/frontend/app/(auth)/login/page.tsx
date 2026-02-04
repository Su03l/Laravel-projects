'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import axios from '@/lib/axios';
import { useStore } from '@/lib/store';
import { Loader2, ArrowLeft, Phone, Lock, Sparkles, Eye, EyeOff, MessageCircle, Users, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();
    const { setUser } = useStore();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        phone: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await axios.post('/login', formData);
            localStorage.setItem('token', data.token);
            document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
            setUser(data.user);
            toast.success('هلا والله! نورتنا');
            router.push('/dashboard');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'تأكد من بياناتك يالغالي');
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) value = value.slice(0, 10);
        setFormData({ ...formData, phone: value });
    };

    return (
        <div className="min-h-screen w-full flex" dir="rtl">
            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-lg"
                >
                    {/* Header */}
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-2xl mb-6 shadow-lg shadow-sky-500/25">
                            <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">حياك الله 👋</h1>
                        <p className="text-slate-500 text-lg">سجل دخولك وكمل سواليفك</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">رقم الجوال</label>
                            <div className="relative">
                                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="tel"
                                    required
                                    maxLength={10}
                                    className="w-full pr-12 pl-16 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all text-slate-900 text-left"
                                    placeholder="05XXXXXXXX"
                                    value={formData.phone}
                                    onChange={handlePhoneChange}
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">+966</span>
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-bold text-slate-700">كلمة المرور</label>
                                <Link href="#" className="text-sm text-sky-600 hover:underline font-medium">نسيت كلمة المرور؟</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full pr-12 pl-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all text-slate-900"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg rounded-xl shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>دخول <ArrowLeft className="w-5 h-5" /></>}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-8 text-center">
                        <p className="text-slate-500">
                            جديد معنا؟{' '}
                            <Link href="/register" className="text-sky-600 font-bold hover:underline">سوي حساب جديد</Link>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Left Side - Branding */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-sky-50 via-white to-purple-50 relative items-center justify-center p-16 overflow-hidden">
                {/* Background Shapes */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 right-20 w-72 h-72 bg-sky-200/50 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-200/50 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-md text-center">
                    {/* Floating Chat Mockup */}
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="bg-white rounded-3xl shadow-2xl p-6 mb-10 border border-slate-100"
                    >
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                            <div className="w-12 h-12 bg-gradient-to-tr from-sky-400 to-blue-500 rounded-xl flex items-center justify-center">
                                <MessageCircle className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-right">
                                <h4 className="font-bold text-slate-900">لايف شات برو</h4>
                                <p className="text-sm text-green-500">متصل الآن</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="bg-slate-100 rounded-2xl rounded-tr-none p-3 text-right max-w-[80%] mr-auto">
                                <p className="text-slate-700 text-sm">السلام عليكم، كيف حالك؟</p>
                            </div>
                            <div className="bg-sky-500 rounded-2xl rounded-tl-none p-3 text-right max-w-[80%] ml-auto">
                                <p className="text-white text-sm">وعليكم السلام، الحمدلله بخير!</p>
                            </div>
                        </div>
                    </motion.div>

                    <h2 className="text-3xl font-bold text-slate-900 mb-4">تواصل بلا حدود</h2>
                    <p className="text-slate-500 text-lg leading-relaxed mb-8">
                        تجربة شات غير، سرعة خيالية وتشفير كامل. كل هذا بتصميم يفتح النفس.
                    </p>

                    {/* Stats */}
                    <div className="flex justify-center gap-8">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                                <Users className="w-6 h-6 text-sky-600" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900">10K+</p>
                            <p className="text-sm text-slate-500">مستخدم</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                                <Globe className="w-6 h-6 text-purple-600" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900">50+</p>
                            <p className="text-sm text-slate-500">دولة</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
