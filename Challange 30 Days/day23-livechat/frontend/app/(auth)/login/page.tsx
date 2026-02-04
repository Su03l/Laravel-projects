'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import axios from '@/lib/axios';
import { useStore } from '@/lib/store';
import { Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();
    const { setUser } = useStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
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
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'تأكد من بياناتك يالغالي');
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
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">حياك الله 👋</h1>
                        <p className="text-slate-500 text-lg">سجل دخولك وكمل سواليفك</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 block">الإيميل</label>
                            <input
                                type="email"
                                required
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-sky-500 transition-all text-slate-900 placeholder:text-slate-400 text-left dir-ltr"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-slate-700">كلمة المرور</label>
                                <Link href="#" className="text-sm text-sky-600 hover:text-sky-700 font-bold">نسيت؟</Link>
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-sky-500 transition-all text-slate-900"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>دخول <ArrowLeft className="w-5 h-5" /></>}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-slate-500">
                        جديد معنا؟{' '}
                        <Link href="/register" className="text-sky-600 font-bold hover:underline">
                            سوي حساب جديد
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* Left Side - Art */}
            <div className="hidden lg:flex w-1/2 bg-slate-50 relative overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-100 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-100 rounded-full blur-3xl opacity-50 -translate-x-1/3 translate-y-1/3"></div>
                </div>

                <div className="relative z-10 text-center space-y-8 max-w-lg">
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="w-full aspect-square bg-white/40 backdrop-blur-xl border border-white/50 rounded-[48px] shadow-2xl flex items-center justify-center relative"
                    >
                        {/* Abstract Chat UI Mockup */}
                        <div className="w-3/4 space-y-4">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-sky-200"></div>
                                <div className="flex-1 p-4 bg-white rounded-2xl rounded-tr-none shadow-sm">
                                    <div className="h-2 w-1/2 bg-slate-100 rounded-full mb-2"></div>
                                    <div className="h-2 w-3/4 bg-slate-50 rounded-full"></div>
                                </div>
                            </div>
                            <div className="flex gap-3 flex-row-reverse">
                                <div className="w-10 h-10 rounded-full bg-purple-200"></div>
                                <div className="flex-1 p-4 bg-slate-900 text-white rounded-2xl rounded-tl-none shadow-lg shadow-slate-900/10">
                                    <div className="h-2 w-2/3 bg-slate-700 rounded-full mb-2"></div>
                                    <div className="h-2 w-1/2 bg-slate-800 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">تواصل بلا حدود</h2>
                        <p className="text-slate-500 text-lg leading-relaxed">
                            تجربة شات غير، سرعة خيالية وتشفير كامل.
                            <br />كل هذا بتصميم يفتح النفس.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
