'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post('/login', { email, password });
            console.log('Login Response:', response.data); // Debugging

            // Support both 'token' and 'access_token' formats
            const token = response.data.token || response.data.access_token;
            const user = response.data.user;

            if (!token) {
                throw new Error('No access token received from server');
            }

            login(token, user || { id: 1, name: 'User', email });
            toast.success('تم تسجيل الدخول بنجاح');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'فشل تسجيل الدخول. يرجى التحقق من البيانات.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-full h-full bg-white opacity-40 z-0"></div>
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-sky-100 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-50 rounded-full blur-3xl opacity-60"></div>

            <div className="w-full max-w-md p-10 bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl relative z-10 transition-all hover:shadow-sky-100/50">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-sky-200 rotate-3 transition-transform hover:rotate-6">
                        <LogIn className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">تسجيل الدخول</h1>
                    <p className="text-slate-500">مرحباً بعودتك لنظام ميني ERP</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 mr-1">البريد الإلكتروني</label>
                        <div className="relative group">
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors">
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pr-12 pl-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-sky-100 focus:border-sky-500 outline-none transition-all placeholder:text-slate-300 font-medium"
                                placeholder="name@example.com"
                                dir="ltr" // Force LTR for email input
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 mr-1">كلمة المرور</label>
                        <div className="relative group">
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors">
                                <Lock size={20} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pr-12 pl-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-sky-100 focus:border-sky-500 outline-none transition-all placeholder:text-slate-300 font-medium"
                                placeholder="••••••••"
                                dir="ltr"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-4 text-lg shadow-xl shadow-sky-200/50 hover:shadow-sky-300/50 hover:-translate-y-1 transition-all"
                            disabled={isLoading}
                        >
                            {isLoading ? 'جاري الدخول...' : 'تسجيل الدخول'}
                        </Button>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-400">
                        نسيت كلمة المرور؟ <a href="#" className="text-sky-500 hover:text-sky-600 font-bold hover:underline">استعادة الحساب</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
