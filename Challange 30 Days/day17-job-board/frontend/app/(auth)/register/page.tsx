"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function RegisterPage() {
    const { register, error } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        type: "seeker",
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Type Selection helper
    const handleTypeSelect = (type: string) => {
        setFormData({ ...formData, type });
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(formData);
        } catch (err) {
            // Error handled in context
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white pt-24">
            {/* Right Side - Form (Reversed for RTL feeling) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
                <div className="w-full max-w-lg space-y-10 my-6">
                    <div className="text-center lg:text-right">
                        <h2 className="text-4xl font-extrabold text-slate-900">انضم إلينا</h2>
                        <p className="mt-4 text-lg text-slate-500">أنشئ حسابك وابدأ رحلتك في ثواني</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-base flex items-center gap-3 animate-in slide-in-from-top-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                {error}
                            </div>
                        )}

                        {/* Account Type Selection (Radio Cards) */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div
                                onClick={() => handleTypeSelect('seeker')}
                                className={`cursor-pointer border-2 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 transition-all ${formData.type === 'seeker' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'}`}
                            >
                                <div className={`p-4 rounded-full ${formData.type === 'seeker' ? 'bg-blue-100 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                </div>
                                <span className={`font-bold text-base ${formData.type === 'seeker' ? 'text-blue-900' : 'text-slate-600'}`}>باحث عن عمل</span>
                            </div>

                            <div
                                onClick={() => handleTypeSelect('company')}
                                className={`cursor-pointer border-2 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 transition-all ${formData.type === 'company' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'}`}
                            >
                                <div className={`p-4 rounded-full ${formData.type === 'company' ? 'bg-blue-100 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5M12 6.75h1.5M15 6.75h1.5M9 10.5h1.5M12 10.5h1.5M15 10.5h1.5M9 14.25h1.5M12 14.25h1.5M15 14.25h1.5M9 18h1.5M12 18h1.5M15 18h1.5" />
                                    </svg>
                                </div>
                                <span className={`font-bold text-base ${formData.type === 'company' ? 'text-blue-900' : 'text-slate-600'}`}>صاحب عمل</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="relative group">
                                <label className="block text-base font-semibold text-slate-700 mb-2">الاسم الكامل</label>
                                <div className="relative">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        className="block w-full rounded-2xl border-slate-200 py-4 pr-12 pl-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white text-lg text-right"
                                        placeholder="مثال: فهد ناصر"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="relative group">
                                <label className="block text-base font-semibold text-slate-700 mb-2">البريد الإلكتروني</label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        className="block w-full rounded-2xl border-slate-200 py-4 pr-12 pl-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white text-lg text-right"
                                        placeholder="name@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="relative group">
                                <label className="block text-base font-semibold text-slate-700 mb-2">كلمة المرور</label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="block w-full rounded-2xl border-slate-200 py-4 pr-12 pl-12 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white text-lg text-right"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )}
                                    </button>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="relative group">
                                <label className="block text-base font-semibold text-slate-700 mb-2">تأكيد كلمة المرور</label>
                                <div className="relative">
                                    <input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        className="block w-full rounded-2xl border-slate-200 py-4 pr-12 pl-12 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white sm:text-sm text-right"
                                        placeholder="••••••••"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                                    >
                                        {showConfirmPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )}
                                    </button>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative flex w-full justify-center rounded-2xl bg-slate-900 px-6 py-4 text-lg font-bold text-white hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-3">
                                        <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        جارٍ إنشاء الحساب...
                                    </span>
                                ) : "إنشاء الحساب"}
                            </button>
                        </div>

                        <div className="text-center">
                            <p className="text-base text-slate-500">
                                عندك حساب أصلاً؟{" "}
                                <Link href="/login" className="font-bold text-blue-600 hover:text-blue-500 hover:underline transition-all">
                                    سجل دخولك من هنا
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Left Side - Visual (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 justify-center items-center rounded-3xl m-4 my-8">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 mix-blend-multiply"></div>

                <div className="relative z-10 p-16 text-white text-center max-w-xl">
                    <div className="mb-8 flex justify-center">
                        <div className="h-24 w-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold mb-6 leading-tight">انضم لمجتمعنا المهني</h2>
                    <p className="text-xl text-indigo-100/90 leading-relaxed">
                        سواء كنت تدور على أفضل المواهب لشركتك، أو تبحث عن فرصتك الوظيفية القادمة، حنا هنا عشان نساعدك توصل لهدفك.
                    </p>
                </div>
            </div>
        </div>
    );
}
