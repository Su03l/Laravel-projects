'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';
import TweetCard from '@/components/TweetCard';
import toast from 'react-hot-toast';
import { MessageSquare, User, Key, LogOut, ArrowRight, X, Eye, EyeOff } from 'lucide-react';

interface Tweet {
    id: number;
    content: string;
    created_at: string;
    author?: {
        id: number;
        name: string;
        username: string;
    };
}

interface UserProfile {
    id: number;
    name: string;
    username: string;
    email: string;
    created_at?: string;
    followers_count?: number;
    following_count?: number;
    tweets_count?: number;
    tweets?: Tweet[];
}

type TabType = 'tweets' | 'profile' | 'password' | 'logout';

export default function ProfileDashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('tweets');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const fetchProfile = useCallback(async () => {
        try {
            const response = await api.get('/user/profile');
            const data = response.data.data || response.data;
            setProfile(data);
            setTweets(data.tweets || []);
            setName(data.name || '');
            setUsername(data.username || '');
            setEmail(data.email || '');
        } catch {
            console.error('Failed to fetch profile');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        fetchProfile();
    }, [isAuthenticated, authLoading, router, fetchProfile]);

    const handleTabChange = (tab: TabType) => {
        if (tab === 'logout') {
            setShowLogoutConfirm(true);
        } else {
            setActiveTab(tab);
        }
    };

    const handleLogout = async () => {
        setShowLogoutConfirm(false);
        await logout();
        router.push('/');
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            await api.put('/user/profile', { name, username, email });
            toast.success('تم حفظ التغييرات بنجاح');
            fetchProfile();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'فشل حفظ التغييرات');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelProfile = () => {
        if (profile) {
            setName(profile.name || '');
            setUsername(profile.username || '');
            setEmail(profile.email || '');
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('كلمات المرور غير متطابقة');
            return;
        }

        setIsChangingPassword(true);
        try {
            await api.post('/user/change-password', {
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: confirmPassword,
            });
            toast.success('تم تغيير كلمة المرور بنجاح');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'فشل تغيير كلمة المرور');
        } finally {
            setIsChangingPassword(false);
        }
    };

    if (authLoading || !isAuthenticated) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-16">
                <div className="border border-white/20 bg-white/5 p-12 text-center">
                    <div className="inline-block h-8 w-8 animate-spin border-4 border-blue-500 border-r-transparent"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-8">
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/90"
                        onClick={() => setShowLogoutConfirm(false)}
                    />
                    <div className="relative z-10 w-full max-w-sm mx-4 border border-white/20 bg-black p-6">
                        <button
                            onClick={() => setShowLogoutConfirm(false)}
                            className="absolute top-4 left-4 text-white/50 hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="text-center">
                            <div className="mx-auto mb-4 h-14 w-14 bg-red-500/20 flex items-center justify-center">
                                <LogOut className="h-7 w-7 text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">تسجيل الخروج</h3>
                            <p className="text-white/50 mb-6">هل أنت متأكد من تسجيل الخروج؟</p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="flex-1 border border-white/20 py-2.5 font-medium text-white hover:bg-white/10 transition-colors"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 bg-red-500 py-2.5 font-medium text-white hover:bg-red-600 transition-colors"
                                >
                                    تأكيد الخروج
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Link
                href="/"
                className="mb-6 inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors"
            >
                <ArrowRight className="h-4 w-4" />
                <span>العودة للرئيسية</span>
            </Link>

            <div className="border border-white/20 bg-white/5 p-8 mb-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                    {/* Avatar */}
                    <div className="h-24 w-24 shrink-0 bg-blue-500 flex items-center justify-center text-white font-black text-4xl">
                        {user?.username?.[0]?.toUpperCase() || '?'}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-black text-white">{user?.name}</h1>
                        <p className="text-lg text-white/50">@{user?.username}</p>
                        <p className="text-sm text-white/30 mt-1">{user?.email}</p>

                        {/* Stats */}
                        <div className="mt-4 flex flex-wrap gap-6">
                            <div>
                                <span className="text-xl font-bold text-white">{profile?.tweets_count || tweets.length || 0}</span>
                                <span className="mr-1 text-white/40">تغريدة</span>
                            </div>
                            <div>
                                <span className="text-xl font-bold text-white">{profile?.followers_count || 0}</span>
                                <span className="mr-1 text-white/40">متابِع</span>
                            </div>
                            <div>
                                <span className="text-xl font-bold text-white">{profile?.following_count || 0}</span>
                                <span className="mr-1 text-white/40">يتابع</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap border-b border-white/20 mb-6">
                <button
                    onClick={() => handleTabChange('tweets')}
                    className={`px-5 py-3 font-medium transition-colors relative ${activeTab === 'tweets' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                >
                    <span className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        تغريداتي
                    </span>
                    {activeTab === 'tweets' && <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-blue-500" />}
                </button>
                <button
                    onClick={() => handleTabChange('profile')}
                    className={`px-5 py-3 font-medium transition-colors relative ${activeTab === 'profile' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                >
                    <span className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        الملف الشخصي
                    </span>
                    {activeTab === 'profile' && <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-blue-500" />}
                </button>
                <button
                    onClick={() => handleTabChange('password')}
                    className={`px-5 py-3 font-medium transition-colors relative ${activeTab === 'password' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                >
                    <span className="flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        تغيير كلمة المرور
                    </span>
                    {activeTab === 'password' && <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-blue-500" />}
                </button>
                <button
                    onClick={() => handleTabChange('logout')}
                    className="px-5 py-3 font-medium transition-colors text-red-400 hover:text-red-300"
                >
                    <span className="flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        تسجيل الخروج
                    </span>
                </button>
            </div>

            {/* Content */}
            {activeTab === 'tweets' && (
                <div>
                    {isLoading ? (
                        <div className="border border-white/20 bg-white/5 p-12 text-center">
                            <div className="inline-block h-8 w-8 animate-spin border-4 border-blue-500 border-r-transparent"></div>
                        </div>
                    ) : tweets.length === 0 ? (
                        <div className="border border-white/20 bg-white/5 p-12 text-center">
                            <div className="mx-auto mb-4 h-16 w-16 bg-white/10 flex items-center justify-center">
                                <MessageSquare className="h-8 w-8 text-white/40" />
                            </div>
                            <p className="text-lg font-medium text-white/70">لا توجد تغريدات بعد</p>
                            <Link
                                href="/"
                                className="mt-4 inline-block bg-blue-500 px-6 py-2 font-bold text-white hover:bg-blue-600"
                            >
                                أضف تغريدتك الأولى
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {tweets.map((tweet) => (
                                <TweetCard
                                    key={tweet.id}
                                    tweet={{
                                        ...tweet,
                                        author: {
                                            id: user?.id || 0,
                                            name: user?.name || '',
                                            username: user?.username || '',
                                        },
                                    }}
                                    showActions={true}
                                    onDelete={fetchProfile}
                                    onUpdate={fetchProfile}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'profile' && (
                <div className="border border-white/20 bg-white/5 p-6">
                    <h2 className="text-xl font-bold text-white mb-6">تعديل الملف الشخصي</h2>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">الاسم الكامل</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-white/20 bg-black p-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">اسم المستخدم</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full border border-white/20 bg-black p-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">البريد الإلكتروني</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-white/20 bg-black p-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={handleCancelProfile}
                                className="flex-1 border border-white/20 py-3 font-medium text-white hover:bg-white/10 transition-colors"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                                className="flex-1 bg-blue-500 py-3 font-bold text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
                            >
                                {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'password' && (
                <div className="border border-white/20 bg-white/5 p-6">
                    <h2 className="text-xl font-bold text-white mb-6">تغيير كلمة المرور</h2>

                    <form onSubmit={handleChangePassword} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">كلمة المرور الحالية</label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                    className="w-full border border-white/20 bg-black p-3 pl-10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                                >
                                    {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">كلمة المرور الجديدة</label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    className="w-full border border-white/20 bg-black p-3 pl-10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                                >
                                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">تأكيد كلمة المرور الجديدة</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={8}
                                className="w-full border border-white/20 bg-black p-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setCurrentPassword('');
                                    setNewPassword('');
                                    setConfirmPassword('');
                                }}
                                className="flex-1 border border-white/20 py-3 font-medium text-white hover:bg-white/10 transition-colors"
                            >
                                إلغاء
                            </button>
                            <button
                                type="submit"
                                disabled={isChangingPassword}
                                className="flex-1 bg-blue-500 py-3 font-bold text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
                            >
                                {isChangingPassword ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
