'use client';

import { useState, useRef } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Camera, LogOut, Loader2, Save, ArrowLeft, Shield, User, FileText } from 'lucide-react';
import Link from 'next/link';
import axios from '@/lib/axios';
import { motion } from 'framer-motion';

export default function ProfilePage() {
    const { user, setUser } = useStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
        pin: '',
    });

    const handleLogout = () => {
        localStorage.removeItem('token');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push('/login');
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('about', formData.bio);

            if (avatarFile) {
                data.append('avatar', avatarFile);
            }

            const response = await axios.post('/profile', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const updatedUser = response.data.user;
            setUser({
                ...user!,
                name: updatedUser.name,
                bio: updatedUser.about,
                avatar: updatedUser.avatar ? `http://localhost:8000/storage/${updatedUser.avatar}` : user?.avatar,
            });

            // Save PIN separately if provided
            if (formData.pin && formData.pin.length === 4) {
                await axios.post('/profile/pin', { pin: formData.pin });
                toast.success('تم تعيين رمز الحماية');
            }

            toast.success('تم تحديث الملف الشخصي بنجاح');
            setAvatarFile(null);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('فشل تحديث الملف الشخصي');
        } finally {
            setLoading(false);
        }
    };

    const displayAvatar = avatarPreview || (user?.avatar ? (user.avatar.startsWith('http') ? user.avatar : `http://localhost:8000/storage/${user.avatar}`) : null);

    return (
        <div className="h-full relative overflow-hidden bg-slate-50">
            {/* Background Gradients & Decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-sky-100/40 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-3xl opacity-60"></div>
            </div>

            <div className="h-full overflow-y-auto relative z-10 p-6 flex flex-col items-center">
                <div className="w-full max-w-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-slate-900">الإعدادات</h1>
                        <Link href="/dashboard" className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-all group">
                            <ArrowLeft className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white/80 backdrop-blur-xl p-8 rounded-[32px] border border-white/50 shadow-xl shadow-slate-200/50"
                    >
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center mb-10">
                            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                                <div className="w-32 h-32 rounded-full bg-slate-100 overflow-hidden border-4 border-white shadow-lg shadow-sky-100 group-hover:scale-105 transition-transform duration-300">
                                    {displayAvatar ? (
                                        <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-sky-400 to-indigo-500 text-white font-bold text-4xl">
                                            {user?.name?.[0] || 'م'}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <Camera className="w-8 h-8 text-white scale-75 group-hover:scale-100 transition-transform" />
                                </div>
                                <div className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md text-sky-500 border border-slate-50 group-hover:rotate-12 transition-transform">
                                    <Camera className="w-4 h-4" />
                                </div>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                            <p className="text-slate-400 text-sm mt-4">اضغط على الصورة للتغيير</p>
                        </div>

                        <form onSubmit={handleSave} className="space-y-8">
                            <div className="grid gap-6">
                                {/* Name Input */}
                                <div className="space-y-2 group">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <User className="w-4 h-4 text-sky-500" />
                                        الإسم الكريم
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 hover:bg-white transition-all text-slate-700 font-medium"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                {/* Bio Input */}
                                <div className="space-y-2 group">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-purple-500" />
                                        نبذة عنك
                                    </label>
                                    <textarea
                                        className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 hover:bg-white transition-all resize-none text-slate-700 leading-relaxed"
                                        rows={3}
                                        placeholder="اكتب شي عنك..."
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    />
                                </div>

                                {/* PIN Input */}
                                <div className="space-y-2 group">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-emerald-500" />
                                        رقم سري للمحادثات (PIN)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            placeholder="****"
                                            className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 hover:bg-white transition-all font-mono text-center tracking-[1em] text-lg"
                                            value={formData.pin}
                                            onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                                            maxLength={4}
                                        />
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-xs text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">
                                            مكون من 4 أرقام
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4 border-t border-slate-100">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-[2] py-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-sky-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> حفظ التغييرات</>}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex-1 py-4 bg-red-50 hover:bg-red-100 text-red-500 font-bold rounded-2xl border border-red-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="hidden sm:inline">خروج</span>
                                </button>
                            </div>
                        </form>

                        {/* Change Password Section */}
                        <div className="mt-12 pt-8 border-t border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-indigo-500" />
                                تغيير كلمة المرور
                            </h2>
                            <ChangePasswordForm />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function ChangePasswordForm() {
    const [loading, setLoading] = useState(false);
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('/profile/password', passwordData);
            toast.success('تم تغيير كلمة المرور بنجاح');
            setPasswordData({
                current_password: '',
                new_password: '',
                new_password_confirmation: '',
            });
        } catch (error: any) {
            console.error('Error changing password:', error);
            const message = error.response?.data?.message || 'فشل تغيير كلمة المرور';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="space-y-2 group">
                <label className="text-sm font-bold text-slate-700">كلمة المرور الحالية</label>
                <input
                    type="password"
                    required
                    className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:bg-white transition-all"
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                    <label className="text-sm font-bold text-slate-700">كلمة المرور الجديدة</label>
                    <input
                        type="password"
                        required
                        minLength={6}
                        className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:bg-white transition-all"
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    />
                </div>
                <div className="space-y-2 group">
                    <label className="text-sm font-bold text-slate-700">تأكيد كلمة المرور</label>
                    <input
                        type="password"
                        required
                        minLength={6}
                        className="w-full px-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:bg-white transition-all"
                        value={passwordData.new_password_confirmation}
                        onChange={(e) => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })}
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold rounded-2xl border border-indigo-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تحديث كلمة المرور'}
            </button>
        </form>
    );
}

