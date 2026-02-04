'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Camera, LogOut, Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
    const { user, setUser } = useStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setUser({ ...user!, ...formData });
            toast.success('تم تحديث الملف الشخصي بنجاح');
        }, 1000);
    };

    return (
        <div className="h-full bg-white flex flex-col items-center justify-center p-6 relative">
            <Link href="/dashboard" className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-50 text-slate-500 transition-colors">
                <ArrowLeft className="w-6 h-6 rotate-180" />
            </Link>

            <div className="w-full max-w-2xl">
                <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">الإعدادات</h1>

                <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 shadow-sm">
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative group cursor-pointer">
                            <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden border-4 border-white shadow-sm">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
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
