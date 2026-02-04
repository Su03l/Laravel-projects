'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import axios from '@/lib/axios';
import { useStore } from '@/lib/store';
import { Loader2 } from 'lucide-react';
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
            toast.success('Welcome back!');
            router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[32px] p-8 md:p-10"
        >
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-slate-950 mb-2">Welcome Back</h1>
                <p className="text-slate-500">Sign in to continue to LiveChat Pro</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
                    <input
                        type="email"
                        required
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-900 placeholder:text-slate-400"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between ml-1">
                        <label className="text-sm font-medium text-slate-700">Password</label>
                        <Link href="#" className="text-sm text-sky-600 hover:text-sky-700 font-medium">Forgot?</Link>
                    </div>
                    <input
                        type="password"
                        required
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-900"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl shadow-lg shadow-sky-500/25 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                </button>
            </form>

            <div className="mt-8 text-center text-slate-500 text-sm">
                Don't have an account?{' '}
                <Link href="/register" className="text-sky-600 font-bold hover:underline">
                    Create Account
                </Link>
            </div>
        </motion.div>
    );
}
