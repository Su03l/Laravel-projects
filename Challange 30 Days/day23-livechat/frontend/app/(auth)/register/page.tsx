'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import axios from '@/lib/axios';
import { useStore } from '@/lib/store';
import { Loader2, ArrowLeft, User, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const router = useRouter();
    const { setUser } = useStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await axios.post('/register', formData);
            localStorage.setItem('token', data.token);
            document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
            setUser(data.user);
            toast.success('تم إنشاء الحساب بنجاح! حياك 👋');
            router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'صار خطأ، جرب مرة ثانية');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex">
            {/* Right Side - Form */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white"
            >
                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">حساب جديد 🚀</h1>
                        <p className="text-slate-500 text-lg">دقايق وتكون جاهز للسواليف</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 block">الإسم الكريم</label>
                            <div className="relative">
                                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    className="w-full pr-12 pl-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-sky-500 transition-all text-slate-900"
                                    placeholder="فلان الفلاني"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 block">الإيميل</label>
                            <div className="relative">
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    className="w-full pr-12 pl-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-sky-500 transition-all text-slate-900 text-left dir-ltr placeholder:text-right"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 block">كلمة المرور</label>
                                <div className="relative">
                                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full pr-12 pl-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-sky-500 transition-all text-slate-900"
                                        placeholder="••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 block">تأكيدها</label>
                                <div className="relative">
                                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full pr-12 pl-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-sky-500 transition-all text-slate-900"
                                        placeholder="••••••"
                                        value={formData.password_confirmation}
                                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl shadow-lg shadow-sky-500/25 hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>أنشئ الحساب <ArrowLeft className="w-5 h-5" /></>}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-slate-500">
                        عندك حساب من قبل؟{' '}
                        <Link href="/login" className="text-slate-900 font-bold hover:underline">
                            سجل دخولك هنا
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* Left Side - Art */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-800 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-900 rounded-full blur-3xl opacity-30 -translate-x-1/3 translate-y-1/3"></div>
                </div>

                <div className="relative z-10 text-center space-y-8 max-w-lg text-white">
                    <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="w-full aspect-video bg-gradient-to-tr from-sky-500 to-purple-600 rounded-[32px] shadow-2xl flex items-center justify-center relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="font-bold text-xl">إنضم للعالم الجديد</p>
                        </div>
                        {/* Decorative Circles */}
                        <div className="w-32 h-32 border-4 border-white/20 rounded-full absolute -top-10 -left-10"></div>
                        <div className="w-48 h-48 border-4 border-white/20 rounded-full absolute -bottom-20 -right-20"></div>
                    </motion.div>

                    <div>
                        <h2 className="text-3xl font-bold mb-4">مجتمع متكامل</h2>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            أكثر من مجرد شات. <br />شارك ملفاتك، صورك، ولحظاتك بأمان تام.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
