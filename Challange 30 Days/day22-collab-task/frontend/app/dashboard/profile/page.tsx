"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { User, Lock, Briefcase, AtSign, Mail, Save, RefreshCw } from "lucide-react";

export default function ProfilePage() {
    const [loading, setLoading] = useState(false);
    const [savingInfo, setSavingInfo] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    const [userInfo, setUserInfo] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        job_title: "",
    });

    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/profile');
                const u = res.data.user;
                setUserInfo({
                    first_name: u.first_name || "",
                    last_name: u.last_name || "",
                    username: u.username || "",
                    email: u.email || "",
                    job_title: u.job_title || "",
                });
            } catch (error) {
                console.error(error);
                toast.error("فشل تحميل البيانات الشخصية");
            }
        };
        fetchProfile();
    }, []);

    const handleUpdateInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingInfo(true);
        try {
            await api.put('/profile', userInfo);
            toast.success("تم تحديث المعلومات بنجاح");
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = error.response.data.errors;
                Object.keys(errors).forEach((key) => {
                    toast.error(errors[key][0]);
                });
            } else {
                toast.error("فشل تحديث المعلومات");
            }
        } finally {
            setSavingInfo(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new_password !== passwordData.new_password_confirmation) {
            toast.error("كلمتا المرور غير متطابقتين");
            return;
        }

        setSavingPassword(true);
        try {
            await api.put('/profile/password', {
                current_password: passwordData.current_password,
                new_password: passwordData.new_password,
                new_password_confirmation: passwordData.new_password_confirmation
            });
            toast.success("تم تغيير كلمة المرور بنجاح");
            setPasswordData({ current_password: "", new_password: "", new_password_confirmation: "" });
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("فشل تغيير كلمة المرور");
            }
        } finally {
            setSavingPassword(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">الملف الشخصي</h1>
                <p className="text-slate-500 mt-2 font-medium">إدارة معلوماتك الشخصية وإعدادات الأمان.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Update Info */}
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                    <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-50">
                        <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 shadow-inner">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">المعلومات الأساسية</h2>
                            <p className="text-xs text-slate-400">قم بتحديث بياناتك العامة</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdateInfo} className="space-y-5">
                        <div className="flex gap-4 flex-col sm:flex-row">
                            <div className="flex-1 relative group">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">الاسم الأول</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={userInfo.first_name}
                                        onChange={(e) => setUserInfo({ ...userInfo, first_name: e.target.value })}
                                        className="w-full rounded-2xl border-slate-200 border px-4 py-3 pr-10 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-slate-50 focus:bg-white transition-all font-medium"
                                        placeholder="الاسم الأول"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 relative group">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">الاسم الأخير</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={userInfo.last_name}
                                        onChange={(e) => setUserInfo({ ...userInfo, last_name: e.target.value })}
                                        className="w-full rounded-2xl border-slate-200 border px-4 py-3 pr-10 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-slate-50 focus:bg-white transition-all font-medium"
                                        placeholder="الاسم الأخير"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="relative group">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">اسم المستخدم</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <AtSign className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={userInfo.username}
                                    onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
                                    className="w-full rounded-2xl border-slate-200 border px-4 py-3 pr-10 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-slate-50 focus:bg-white transition-all font-medium"
                                    placeholder="username"
                                />
                            </div>
                        </div>

                        <div className="relative group">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">المسمى الوظيفي</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Briefcase className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={userInfo.job_title}
                                    onChange={(e) => setUserInfo({ ...userInfo, job_title: e.target.value })}
                                    className="w-full rounded-2xl border-slate-200 border px-4 py-3 pr-10 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-slate-50 focus:bg-white transition-all font-medium"
                                    placeholder="مثال: مطور برمجيات"
                                />
                            </div>
                        </div>

                        <div className="relative group">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">البريد الإلكتروني</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    value={userInfo.email}
                                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                    className="w-full rounded-2xl border-slate-200 border px-4 py-3 pr-10 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-slate-50 focus:bg-white transition-all font-medium"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={savingInfo}
                                className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-sky-600 text-white px-8 py-3 rounded-xl font-bold hover:from-sky-600 hover:to-sky-700 focus:ring-4 focus:ring-sky-100 transition-all shadow-lg shadow-sky-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                {savingInfo ? "جاري الحفظ..." : "حفظ التغييرات"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Change Password */}
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 h-fit">
                    <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-50">
                        <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 shadow-inner">
                            <Lock className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">الأمان وكلمة المرور</h2>
                            <p className="text-xs text-slate-400">حافظ على أمان حسابك</p>
                        </div>
                    </div>

                    <form onSubmit={handleChangePassword} className="space-y-5">
                        <div className="relative group">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">كلمة المرور الحالية</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={passwordData.current_password}
                                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                    className="w-full rounded-2xl border-slate-200 border px-4 py-3 pr-10 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-slate-50 focus:bg-white transition-all font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <div className="relative group">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">كلمة المرور الجديدة</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={passwordData.new_password}
                                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                    className="w-full rounded-2xl border-slate-200 border px-4 py-3 pr-10 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-slate-50 focus:bg-white transition-all font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <div className="relative group">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">تأكيد كلمة المرور</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={passwordData.new_password_confirmation}
                                    onChange={(e) => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })}
                                    className="w-full rounded-2xl border-slate-200 border px-4 py-3 pr-10 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-slate-50 focus:bg-white transition-all font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={savingPassword}
                                className="w-full sm:w-auto bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 focus:ring-4 focus:ring-slate-100 transition-all shadow-lg shadow-slate-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-5 h-5" />
                                {savingPassword ? "جاري التحديث..." : "تحديث كلمة المرور"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
