'use client';

import { useState, useRef } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Camera, LogOut, Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import axios from '@/lib/axios';

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
        <div className="h-full bg-white flex flex-col items-center justify-center p-6 relative">
            <Link href="/dashboard" className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-50 text-slate-500 transition-colors">
                <ArrowLeft className="w-6 h-6 rotate-180" />
            </Link>

            <div className="w-full max-w-2xl">
                <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">الإعدادات</h1>

                <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 shadow-sm">
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                            <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden border-4 border-white shadow-sm">
                                {displayAvatar ? (
                                    <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-sky-100 text-sky-600 font-bold text-2xl">
                                        {user?.name?.[0] || 'م'}
                                    </div>
                                )}
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                        <p className="text-slate-400 text-sm mt-2">اضغط لتغيير الصورة</p>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 block">الإسم الكريم</label>
                            <input
                                type="text"
                                className="w-full px-6 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 block">نبذة عنك</label>
                            <textarea
                                className="w-full px-6 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all resize-none"
                                rows={3}
                                placeholder="اكتب شي عنك..."
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 block">رقم سري للمحادثات (PIN)</label>
                            <input
                                type="password"
                                placeholder="****"
                                className="w-full px-6 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-mono text-center tracking-widest"
                                value={formData.pin}
                                onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                                maxLength={4}
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> حفظ التغييرات</>}
                            </button>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-500 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <LogOut className="w-4 h-4" /> خروج
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

