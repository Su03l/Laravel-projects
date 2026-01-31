'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, Loader2, Wallet, Eye, EyeOff, Hand, Rocket, Sparkles } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/login', {
                email,
                password
            });
            const { token, role } = response.data;
            login(token, role);
            toast.success('يا هلا والله! نورت الكون', {
                icon: <Sparkles className="h-5 w-5 text-yellow-500" />,
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'أفا.. البيانات غلط، تأكد منها');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 to-white px-4">
            <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-10 shadow-2xl border border-sky-100">
                <div className="text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-600 shadow-lg shadow-sky-600/30">
                        <Wallet className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center justify-center gap-2">
                        هلا والله، نورت! <Hand className="h-8 w-8 text-yellow-500 animate-pulse" />
                    </h2>
                    <p className="mt-3 text-sm text-gray-500 flex items-center justify-center gap-1">
                        خش حسابك عشان تابع أمورك المالية أول بأول <Rocket className="h-4 w-4 text-sky-500" />
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div className="relative group">
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-sky-500 transition-colors" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pr-11 pl-4 text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all duration-200"
                                placeholder="إيميلك الشخصي"
                            />
                        </div>
                        <div className="relative group">
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-sky-500 transition-colors" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pr-11 pl-12 text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all duration-200"
                                placeholder="كلمة المرور السرية"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 hover:text-sky-600 transition-colors focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-2xl bg-sky-600 py-4 text-sm font-bold text-white transition-all hover:bg-sky-700 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-sky-500/30 disabled:bg-sky-400 disabled:cursor-not-allowed shadow-lg shadow-sky-600/30"
                        >
                            {loading ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                "دخول للحساب"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
