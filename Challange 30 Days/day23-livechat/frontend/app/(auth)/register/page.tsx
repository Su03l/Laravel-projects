'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import axios from '@/lib/axios';
import { useStore } from '@/lib/store';
import { Loader2, ArrowLeft, User, Phone, Lock, Rocket, Eye, EyeOff, MessageCircle, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const router = useRouter();
    const { setUser } = useStore();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.password_confirmation) {
            toast.error('كلمات المرور غير متطابقة');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
            return;
        }

        setLoading(true);

        try {
            const { data } = await axios.post('/register', formData);
            if (data.token) {
                localStorage.setItem('token', data.token);
                document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
                setUser(data.user);
                toast.success('تم إنشاء الحساب بنجاح! حياك 👋');
                router.push('/dashboard');
            } else {
                toast.success('تم إنشاء الحساب! سجل دخولك الحين');
                router.push('/login');
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'حدث خطأ، تأكد من البيانات');
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
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-2xl mb-6 shadow-lg shadow-sky-500/25">
                            <Rocket className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">حساب جديد</h1>
                        <p className="text-slate-500 text-lg">انضم لمجتمعنا وابدأ رحلة التواصل</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">الإسم الكريم</label>
                            <div className="relative">
                                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    className="w-full pr-12 pl-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all text-slate-900"
                                    placeholder="أدخل اسمك الكامل"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

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

                        {/* Passwords Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">كلمة المرور</label>
                                <div className="relative">
                                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        minLength={6}
                                        className="w-full pr-12 pl-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all text-slate-900"
                                        placeholder="••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">تأكيد كلمة المرور</label>
                                <div className="relative">
                                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        minLength={6}
                                        className="w-full pr-12 pl-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all text-slate-900"
                                        placeholder="••••••"
                                        value={formData.password_confirmation}
                                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                    />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-sky-500/25 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>إنشاء حساب <ArrowLeft className="w-5 h-5 rotate-180" /></>}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-8 text-center">
                        <p className="text-slate-500">
                            عندك حساب؟{' '}
                            <Link href="/login" className="text-sky-600 font-bold hover:underline">سجل دخولك</Link>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Left Side - Branding */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative items-center justify-center p-16 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]"></div>
                </div>

                <div className="relative z-10 max-w-md text-center">
                    {/* Logo */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl border border-white/10"
                    >
                        <MessageCircle className="w-10 h-10 text-sky-400" />
                    </motion.div>

                    <h2 className="text-4xl font-bold text-white mb-6">مجتمع متكامل</h2>
                    <p className="text-slate-400 text-xl leading-relaxed mb-12">
                        أكثر من مجرد شات. شارك ملفاتك، صورك، ولحظاتك بأمان تام.
                    </p>

                    {/* Features */}
                    <div className="space-y-4 text-right">
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                            <div className="w-12 h-12 bg-sky-500/20 rounded-xl flex items-center justify-center">
                                <Zap className="w-6 h-6 text-sky-400" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">سرعة فائقة</h4>
                                <p className="text-slate-400 text-sm">رسائل فورية بدون تأخير</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                <Shield className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">تشفير كامل</h4>
                                <p className="text-slate-400 text-sm">خصوصيتك أولويتنا</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}