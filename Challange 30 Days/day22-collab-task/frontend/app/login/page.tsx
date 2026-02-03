"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post("/login", { email, password });

            // Store token & user
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user)); // Store basic user info

            toast.success("تم تسجيل الدخول بنجاح!");
            router.push("/dashboard");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "فشل تسجيل الدخول");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-sky-200/30 rounded-full blur-3xl opacity-50 animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl opacity-50 animate-pulse delay-700" />

            <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 relative z-10 transition-all hover:shadow-sky-100/50">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 mb-6">
                        <LogIn className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        مرحباً بعودتك!
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 font-medium">
                        قم بتسجيل الدخول لمتابعة مهامك ومشاريعك
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div className="relative group">
                            <label htmlFor="email" className="sr-only">
                                البريد الإلكتروني
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-2xl relative block w-full pr-10 pl-3 py-4 border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all bg-slate-50/50 focus:bg-white text-sm font-medium shadow-sm"
                                    placeholder="البريد الإلكتروني"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="relative group">
                            <label htmlFor="password" className="sr-only">
                                كلمة المرور
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-2xl relative block w-full pr-10 pl-10 py-4 border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all bg-slate-50/50 focus:bg-white text-sm font-medium shadow-sm"
                                    placeholder="كلمة المرور"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-sky-500 transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-slate-300 rounded cursor-pointer"
                            />
                            <label htmlFor="remember-me" className="mr-2 block text-sm text-slate-600 cursor-pointer">
                                تذكرني
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-sky-600 hover:text-sky-500 hover:underline">
                                نسيت كلمة المرور؟
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 transition-all shadow-lg shadow-sky-500/30 transform hover:-translate-y-0.5"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    جاري الدخول...
                                </span>
                            ) : "تسجيل الدخول"}
                        </button>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-sm text-slate-500">
                            ليس لديك حساب؟{" "}
                            <Link href="/register" className="font-bold text-sky-600 hover:text-sky-500 transition-colors">
                                أنشئ حساباً جديداً
                            </Link>
                        </p>
                    </div>
                </form>
            </div>

            {/* Footer Copyright */}
            <div className="absolute bottom-6 text-center text-slate-400 text-xs">
                &copy; {new Date().getFullYear()} Collaborative Task SaaS. جميع الحقوق محفوظة.
            </div>
        </div>
    );
}
