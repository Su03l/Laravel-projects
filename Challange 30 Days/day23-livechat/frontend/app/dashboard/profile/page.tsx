'use client';

import { useState, useRef } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Camera, LogOut, Loader2, Save, ArrowLeft, Shield, User, FileText, LayoutDashboard, Lock, PenSquare } from 'lucide-react';
import Link from 'next/link';
import axios from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'overview' | 'edit' | 'security';

export default function ProfilePage() {
    const { user, setUser } = useStore();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    const handleLogout = () => {
        localStorage.removeItem('token');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push('/login');
    };

    return (
        <div className="h-full relative overflow-hidden bg-slate-50">
            {/* Background Gradients & Decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-sky-100/40 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-3xl opacity-60"></div>
            </div>

            <div className="h-full overflow-y-auto relative z-10 p-6 flex flex-col items-center">
                <div className="w-full max-w-4xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">الملف الشخصي</h1>
                            <p className="text-slate-500 mt-1">إدارة حسابك ومعلوماتك الشخصية</p>
                        </div>
                        <Link href="/dashboard" className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-all group">
                            <ArrowLeft className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
                        {/* Sidebar / Tabs */}
                        <div className="bg-white/80 backdrop-blur-xl p-4 rounded-[24px] border border-white/50 shadow-xl shadow-slate-200/50 flex flex-col gap-2">
                            <TabButton
                                active={activeTab === 'overview'}
                                onClick={() => setActiveTab('overview')}
                                icon={<LayoutDashboard className="w-5 h-5" />}
                                label="نظرة عامة"
                            />
                            <TabButton
                                active={activeTab === 'edit'}
                                onClick={() => setActiveTab('edit')}
                                icon={<PenSquare className="w-5 h-5" />}
                                label="تعديل الملف"
                            />
                            <TabButton
                                active={activeTab === 'security'}
                                onClick={() => setActiveTab('security')}
                                icon={<Shield className="w-5 h-5" />}
                                label="الأمان وكلمة المرور"
                            />

                            <div className="h-px bg-slate-100 my-2" />

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium"
                            >
                                <LogOut className="w-5 h-5" />
                                تسجيل خروج
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-white/50 shadow-xl shadow-slate-200/50 min-h-[400px] p-8 relative overflow-hidden">
                            <AnimatePresence mode="wait">
                                {activeTab === 'overview' && (
                                    <OverviewTab key="overview" user={user} />
                                )}
                                {activeTab === 'edit' && (
                                    <EditProfileTab key="edit" user={user} setUser={setUser} />
                                )}
                                {activeTab === 'security' && (
                                    <SecurityTab key="security" />
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${active
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/25'
                : 'text-slate-600 hover:bg-slate-50'
                }`}
        >
            {icon}
            {label}
        </button>
    );
}

function OverviewTab({ user }: { user: any }) {
    const displayAvatar = user?.avatar ? (user.avatar.startsWith('http') ? user.avatar : `http://localhost:8000/storage/${user.avatar}`) : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center text-center"
        >
            {/* Professional Card Header */}
            <div className="w-full h-32 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-2xl mb-[-64px] relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-black rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                </div>
            </div>

            <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full bg-white p-1 shadow-xl">
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-100">
                        {displayAvatar ? (
                            <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold text-4xl">
                                {user?.name?.[0] || 'م'}
                            </div>
                        )}
                    </div>
                </div>
                {user?.is_online && (
                    <div className="absolute bottom-2 left-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full" title="متصل الآن"></div>
                )}
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">{user?.name}</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8 px-4 leading-relaxed">
                {user?.bio || 'لا توجد نبذة شخصية'}
            </p>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center">
                    <span className="text-sm text-slate-500 mb-1">تاريخ الانضمام</span>
                    <span className="font-bold text-slate-700 dir-ltr">{new Date(user?.created_at || Date.now()).toLocaleDateString('en-US')}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center">
                    <span className="text-sm text-slate-500 mb-1">رقم الجوال</span>
                    <span className="font-bold text-slate-700 dir-ltr">{user?.phone}</span>
                </div>
            </div>
        </motion.div>
    );
}

function EditProfileTab({ user, setUser }: { user: any, setUser: any }) {
    const [loading, setLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
    });

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

            toast.success('تم تحديث الملف الشخصي بنجاح');
            setAvatarFile(null);
        } catch (error: any) {
            console.error('Error updating profile:', error);
            const message = error.response?.data?.message || 'فشل تحديث الملف الشخصي';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const displayAvatar = avatarPreview || (user?.avatar ? (user.avatar.startsWith('http') ? user.avatar : `http://localhost:8000/storage/${user.avatar}`) : null);

    return (
        <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={handleSave}
            className="space-y-8"
        >
            <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                <div className="relative group cursor-pointer flex-shrink-0" onClick={handleAvatarClick}>
                    <div className="w-20 h-20 rounded-full bg-slate-100 overflow-hidden border-2 border-slate-200">
                        {displayAvatar ? (
                            <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 font-bold text-2xl">
                                {user?.name?.[0] || 'م'}
                            </div>
                        )}
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <Camera className="w-6 h-6 text-white" />
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">صورة الملف الشخصي</h3>
                    <p className="text-sm text-slate-500">اضغط على الصورة لتغييرها</p>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                />
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">الإسم الكريم</label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">نبذة عنك</label>
                    <textarea
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all resize-none"
                        rows={3}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl shadow-lg shadow-sky-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> حفظ التغييرات</>}
                </button>
            </div>
        </motion.form>
    );
}

function SecurityTab() {
    const [loading, setLoading] = useState(false);
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });
    const [pin, setPin] = useState('');

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

    const handleSetPin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pin.length !== 4) return;

        try {
            await axios.post('/profile/pin', { pin });
            toast.success('تم تعيين رمز الحماية');
            setPin('');
        } catch (error) {
            console.error('Error setting pin:', error);
            toast.error('فشل تعيين الرمز');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-10"
        >
            {/* Change Password */}
            <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg pb-2 border-b border-indigo-50">
                    <Lock className="w-5 h-5" />
                    <h2>تغيير كلمة المرور</h2>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">كلمة المرور الحالية</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            value={passwordData.current_password}
                            onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">كلمة المرور الجديدة</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                value={passwordData.new_password}
                                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">تأكيد كلمة المرور</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                value={passwordData.new_password_confirmation}
                                onChange={(e) => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تحديث كلمة المرور'}
                    </button>
                </div>
            </form>

            {/* Chat PIN */}
            <form onSubmit={handleSetPin} className="space-y-6">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-lg pb-2 border-b border-emerald-50">
                    <Shield className="w-5 h-5" />
                    <h2>رقم سري للمحادثات (PIN)</h2>
                </div>

                <div className="space-y-2">
                    <p className="text-sm text-slate-500 mb-2">يحمي محادثاتك المقفلة برقم سري مكون من 4 أرقام.</p>
                    <div className="relative max-w-xs">
                        <input
                            type="password"
                            placeholder="****"
                            className="w-full px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono text-center tracking-[1em] text-lg"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            maxLength={4}
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={pin.length !== 4}
                        className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        تعيين الرمز
                    </button>
                </div>
            </form>
        </motion.div>
    );
}

