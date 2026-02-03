"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { User, Mail, Lock, AtSign, UserPlus, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.password_confirmation) {
            toast.error("كلمتا المرور غير متطابقتين");
            return;
        }

        setLoading(true);
        try {
            await api.post("/register", formData);
            toast.success("تم إنشاء الحساب بنجاح. يرجى تسجيل الدخول.");
            router.push("/login");
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = error.response.data.errors;
                Object.keys(errors).forEach((key) => {
                    toast.error(errors[key][0]);
                });
            } else {
                toast.error(error.response?.data?.message || "فشل إنشاء الحساب");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl opacity-50 animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-sky-200/30 rounded-full blur-3xl opacity-50 animate-pulse delay-700" />

            <div className="max-w-xl w-full space-y-8 bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 relative z-10 transition-all hover:shadow-sky-100/50">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-bl from-sky-50 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 mb-6">
                        <UserPlus className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        إنشاء حساب جديد
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 font-medium">
                        انضم إلينا وابدأ في تنظيم مهامك باحترافية
                    </p>
                </div>
                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>

                    <div className="flex gap-4 flex-col sm:flex-row">
                        <div className="flex-1 relative group">
                            <label htmlFor="first_name" className="sr-only">الاسم الأول</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                                </div>
                                <input
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    required
                                    className="appearance-none rounded-2xl relative block w-full pr-10 pl-3 py-4 border border-slate-200 placeholder-slate-400 text-black focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all bg-slate-50/50 focus:bg-white text-sm font-bold shadow-sm"
                                    placeholder="الاسم الأول"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="flex-1 relative group">
                            <label htmlFor="last_name" className="sr-only">الاسم الأخير</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                                </div>
                                <input
                                    id="last_name"
                                    name="last_name"
                                    type="text"
                                    required
                                    className="appearance-none rounded-2xl relative block w-full pr-10 pl-3 py-4 border border-slate-200 placeholder-slate-400 text-black focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all bg-slate-50/50 focus:bg-white text-sm font-bold shadow-sm"
                                    placeholder="الاسم الأخير"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        <label htmlFor="username" className="sr-only">
                            اسم المستخدم
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <AtSign className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                            </div>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="appearance-none rounded-2xl relative block w-full pr-10 pl-3 py-4 border border-slate-200 placeholder-slate-400 text-black focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all bg-slate-50/50 focus:bg-white text-sm font-bold shadow-sm"
                                placeholder="اسم المستخدم"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

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
                                required
                                className="appearance-none rounded-2xl relative block w-full pr-10 pl-3 py-4 border border-slate-200 placeholder-slate-400 text-black focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all bg-slate-50/50 focus:bg-white text-sm font-bold shadow-sm"
                                placeholder="البريد الإلكتروني"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Password */}
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
                                required
                                className="appearance-none rounded-2xl relative block w-full pr-10 pl-10 py-4 border border-slate-200 placeholder-slate-400 text-black focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all bg-slate-50/50 focus:bg-white text-sm font-bold shadow-sm"
                                placeholder="كلمة المرور"
                                value={formData.password}
                                onChange={handleChange}
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

                    {/* Confirm Password */}
                    <div className="relative group">
                        <label htmlFor="password_confirmation" className="sr-only">
                            تأكيد كلمة المرور
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                            </div>
                            <input
                                id="password_confirmation"
                                name="password_confirmation"
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                className="appearance-none rounded-2xl relative block w-full pr-10 pl-10 py-4 border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all bg-slate-50/50 focus:bg-white text-sm font-medium shadow-sm"
                                placeholder="تأكيد كلمة المرور"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-sky-500 transition-colors focus:outline-none"
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-gradient-to-l from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 transition-all shadow-lg shadow-sky-500/30 transform hover:-translate-y-0.5"
                        >
                            {loading ? "جاري الإنشاء..." : "إنشاء حساب"}
                        </button>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-sm text-slate-500">
                            لديك حساب بالفعل؟{" "}
                            <Link href="/login" className="font-bold text-sky-600 hover:text-sky-500 transition-colors">
                                تسجيل الدخول
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
