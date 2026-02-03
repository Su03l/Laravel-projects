"use client";

import { useEffect, useState, useRef } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { User, Lock, Briefcase, AtSign, Mail, Save, RefreshCw, Eye, EyeOff, Camera, Upload } from "lucide-react";
import clsx from "clsx";

export default function ProfilePage() {
    const [loading, setLoading] = useState(false);
    const [savingInfo, setSavingInfo] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    // Show/Hide Password States
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [userInfo, setUserInfo] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        job_title: "",
    });

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                if (u.avatar) {
                    // Check if already full URL, else prepend backend URL
                    const avatarUrl = u.avatar.startsWith('http')
                        ? u.avatar
                        : `http://localhost:8000${u.avatar}`;
                    setAvatarPreview(avatarUrl);
                }
            } catch (error) {
                console.error(error);
                toast.error("فشل تحميل البيانات الشخصية");
            }
        };
        fetchProfile();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleUpdateInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingInfo(true);
        try {
            const formData = new FormData();
            formData.append('_method', 'PUT');
            formData.append('first_name', userInfo.first_name);
            formData.append('last_name', userInfo.last_name);
            formData.append('username', userInfo.username);
            formData.append('email', userInfo.email);
            if (userInfo.job_title) formData.append('job_title', userInfo.job_title);
            if (avatarFile) formData.append('avatar', avatarFile);

            const res = await api.post('/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const updatedUser = res.data.user;
            localStorage.setItem("user", JSON.stringify(updatedUser)); // Update LocalStorage
            toast.success("تم تحديث المعلومات بنجاح");

            // Dispatch event to update layout (if listening)
            window.dispatchEvent(new Event("storage"));
            // Fallback: force reload to update header avatar if standard storage event not caught
            // window.location.reload(); 
        } catch (error: any) {
            console.error(error);
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
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-10">
            {/* Header Section */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">الملف الشخصي</h1>
                    <p className="text-slate-500 text-lg font-medium">
                        إدارة معلوماتك الشخصية وإعدادات الأمان.
                    </p>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Update Info Card */}
                <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-50">
                        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
                            <User className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">المعلومات الأساسية</h2>
                            <p className="text-sm font-medium text-slate-400">قم بتحديث بياناتك العامة</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdateInfo} className="space-y-6">
                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center justify-center gap-4 mb-8">
                            <div className="relative group">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-32 h-32 rounded-full bg-slate-100 border-8 border-slate-50 shadow-xl flex items-center justify-center overflow-hidden cursor-pointer hover:border-slate-200 transition-all group-hover:scale-105"
                                >
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-12 h-12 text-slate-300" />
                                    )}

                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <Camera className="w-10 h-10 text-white" />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-2 right-2 bg-slate-900 text-white p-3 rounded-full shadow-lg hover:bg-slate-800 transition-all hover:-translate-y-1"
                                >
                                    <Upload className="w-4 h-4" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-black text-slate-900">الاسم الأول</label>
                                <input
                                    type="text"
                                    value={userInfo.first_name}
                                    onChange={(e) => setUserInfo({ ...userInfo, first_name: e.target.value })}
                                    className="w-full rounded-2xl border-slate-200 border-2 px-4 py-3.5 text-sm font-bold text-slate-900 focus:border-slate-900 focus:ring-0 transition-colors"
                                    placeholder="الاسم الأول"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-black text-slate-900">الاسم الأخير</label>
                                <input
                                    type="text"
                                    value={userInfo.last_name}
                                    onChange={(e) => setUserInfo({ ...userInfo, last_name: e.target.value })}
                                    className="w-full rounded-2xl border-slate-200 border-2 px-4 py-3.5 text-sm font-bold text-slate-900 focus:border-slate-900 focus:ring-0 transition-colors"
                                    placeholder="الاسم الأخير"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-black text-slate-900">اسم المستخدم</label>
                            <div className="relative">
                                <AtSign className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={userInfo.username}
                                    onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
                                    className="w-full rounded-2xl border-slate-200 border-2 px-4 py-3.5 pr-12 text-sm font-bold text-slate-900 focus:border-slate-900 focus:ring-0 transition-colors"
                                    placeholder="username"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-black text-slate-900">المسمى الوظيفي</label>
                            <input
                                type="text"
                                value={userInfo.job_title}
                                onChange={(e) => setUserInfo({ ...userInfo, job_title: e.target.value })}
                                className="w-full rounded-2xl border-slate-200 border-2 px-4 py-3.5 text-sm font-bold text-slate-900 focus:border-slate-900 focus:ring-0 transition-colors"
                                placeholder="مثال: مطور برمجيات"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-black text-slate-900">البريد الإلكتروني</label>
                            <input
                                type="email"
                                value={userInfo.email}
                                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                className="w-full rounded-2xl border-slate-200 border-2 px-4 py-3.5 text-sm font-bold text-slate-900 focus:border-slate-900 focus:ring-0 transition-colors"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={savingInfo}
                                className="w-full bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-3"
                            >
                                <Save className="w-5 h-5" />
                                {savingInfo ? "جاري الحفظ..." : "حفظ التغييرات"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Change Password Card */}
                <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-fit">
                    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-50">
                        <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shadow-inner">
                            <Lock className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">الأمان وكلمة المرور</h2>
                            <p className="text-sm font-medium text-slate-400">حافظ على أمان حسابك</p>
                        </div>
                    </div>

                    <form onSubmit={handleChangePassword} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-black text-slate-900">كلمة المرور الحالية</label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={passwordData.current_password}
                                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                    className="w-full rounded-2xl border-slate-200 border-2 px-4 py-3.5 pl-12 text-sm font-bold text-slate-900 focus:border-slate-900 focus:ring-0 transition-colors"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 hover:text-slate-900 transition-colors"
                                >
                                    {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-black text-slate-900">كلمة المرور الجديدة</label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={passwordData.new_password}
                                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                    className="w-full rounded-2xl border-slate-200 border-2 px-4 py-3.5 pl-12 text-sm font-bold text-slate-900 focus:border-slate-900 focus:ring-0 transition-colors"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 hover:text-slate-900 transition-colors"
                                >
                                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-black text-slate-900">تأكيد كلمة المرور</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={passwordData.new_password_confirmation}
                                    onChange={(e) => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })}
                                    className="w-full rounded-2xl border-slate-200 border-2 px-4 py-3.5 pl-12 text-sm font-bold text-slate-900 focus:border-slate-900 focus:ring-0 transition-colors"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 hover:text-slate-900 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={savingPassword}
                                className="w-full bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-3"
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
