'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useForm } from 'react-hook-form';
import api from '@/lib/axios';
import Sidebar from '@/components/Sidebar';
import { User, Mail, AtSign, Lock, Eye, EyeOff, Edit3, Trash2, X, Save } from 'lucide-react';

interface TweetData {
    id: number;
    content: string;
    author?: { name: string; username: string };
    user?: { name: string; username: string };
    created_at: string;
    is_mine: boolean;
}

interface ProfileFormData {
    name: string;
    email: string;
    username: string;
}

interface PasswordFormData {
    current_password: string;
    password: string;
    password_confirmation: string;
}

interface EditTweetFormData {
    content: string;
}

export default function ProfilePage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();

    const [tweets, setTweets] = useState<TweetData[]>([]);
    const [isLoadingTweets, setIsLoadingTweets] = useState(true);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showEditTweet, setShowEditTweet] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const profileForm = useForm<ProfileFormData>();
    const passwordForm = useForm<PasswordFormData>();
    const editTweetForm = useForm<EditTweetFormData>();

    // Redirect if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    // Set profile form defaults when user loads
    useEffect(() => {
        if (user) {
            profileForm.reset({
                name: user.name,
                email: user.email,
                username: user.username,
            });
        }
    }, [user, profileForm]);

    const fetchMyTweets = useCallback(async () => {
        try {
            const response = await api.get('/user/tweets');
            const tweetsData = response.data.data || response.data.tweets || response.data;
            setTweets(Array.isArray(tweetsData) ? tweetsData : []);
        } catch (error) {
            console.error('Failed to fetch tweets:', error);
        } finally {
            setIsLoadingTweets(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchMyTweets();
        }
    }, [isAuthenticated, fetchMyTweets]);

    const handleUpdateProfile = async (data: ProfileFormData) => {
        setIsSubmitting(true);
        try {
            await api.put('/user/profile', data);
            showToast('تم تحديث البيانات بنجاح', 'success');
            setShowEditProfile(false);
            // Reload page to update user data
            window.location.reload();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            showToast(err.response?.data?.message || 'فشل في تحديث البيانات', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChangePassword = async (data: PasswordFormData) => {
        setIsSubmitting(true);
        try {
            await api.post('/user/change-password', data);
            showToast('تم تغيير كلمة المرور بنجاح', 'success');
            setShowChangePassword(false);
            passwordForm.reset();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            showToast(err.response?.data?.message || 'فشل في تغيير كلمة المرور', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditTweet = async (id: number, data: EditTweetFormData) => {
        setIsSubmitting(true);
        try {
            await api.put(`/tweets/${id}`, data);
            showToast('تم تعديل التغريدة بنجاح', 'success');
            setShowEditTweet(null);
            fetchMyTweets();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            showToast(err.response?.data?.message || 'فشل في تعديل التغريدة', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTweet = async (id: number) => {
        if (!confirm('هل أنت متأكد من حذف هذه التغريدة؟')) return;

        setTweets(tweets.filter(t => t.id !== id));
        try {
            await api.delete(`/tweets/${id}`);
            showToast('تم حذف التغريدة', 'success');
        } catch (error) {
            console.error('Failed to delete tweet:', error);
            showToast('فشل في حذف التغريدة', 'error');
            fetchMyTweets();
        }
    };

    const openEditTweet = (tweet: TweetData) => {
        editTweetForm.reset({ content: tweet.content });
        setShowEditTweet(tweet.id);
    };

    if (isLoading) {
        return (
            <div className="app-layout">
                <Sidebar />
                <main className="main-feed">
                    <div className="loading"><div className="loading-spinner"></div></div>
                </main>
            </div>
        );
    }

    return (
        <div className="app-layout">
            <Sidebar />

            <main className="main-feed">
                <header className="feed-header">
                    <h1>الملف الشخصي</h1>
                </header>

                {/* User Info Section */}
                <section className="profile-section">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="profile-info">
                            <h2 className="profile-name">{user?.name}</h2>
                            <p className="profile-username">@{user?.username}</p>
                            <p className="profile-email">{user?.email}</p>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button onClick={() => setShowEditProfile(true)} className="profile-btn">
                            <Edit3 size={16} />
                            <span>تعديل البيانات</span>
                        </button>
                        <button onClick={() => setShowChangePassword(true)} className="profile-btn secondary">
                            <Lock size={16} />
                            <span>تغيير كلمة المرور</span>
                        </button>
                    </div>
                </section>

                {/* My Tweets Section */}
                <section className="profile-tweets-section">
                    <h3 className="section-title">تغريداتي ({tweets.length})</h3>

                    <div className="timeline">
                        {isLoadingTweets ? (
                            <div className="loading"><div className="loading-spinner"></div></div>
                        ) : tweets.length === 0 ? (
                            <div className="empty-timeline">
                                <p>لم تنشر أي تغريدات بعد</p>
                            </div>
                        ) : (
                            tweets.map((tweet) => (
                                <article key={tweet.id} className="post-card">
                                    {showEditTweet === tweet.id ? (
                                        <form onSubmit={editTweetForm.handleSubmit((data) => handleEditTweet(tweet.id, data))} className="edit-tweet-form">
                                            <textarea
                                                {...editTweetForm.register('content', { required: true, maxLength: 280 })}
                                                className="tweet-input"
                                                rows={3}
                                            />
                                            <div className="edit-tweet-actions">
                                                <button type="button" onClick={() => setShowEditTweet(null)} className="cancel-btn">
                                                    <X size={16} />
                                                    إلغاء
                                                </button>
                                                <button type="submit" disabled={isSubmitting} className="save-btn">
                                                    <Save size={16} />
                                                    {isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            <div className="post-header">
                                                <div className="post-avatar">
                                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div className="post-meta">
                                                    <span className="post-author">{user?.name}</span>
                                                    <span className="post-username">@{user?.username}</span>
                                                </div>
                                                <span className="post-time">{tweet.created_at}</span>
                                            </div>
                                            <div className="post-body">
                                                <p>{tweet.content}</p>
                                            </div>
                                            <div className="post-actions">
                                                <button onClick={() => openEditTweet(tweet)} className="action-btn edit">
                                                    <Edit3 size={16} />
                                                    تعديل
                                                </button>
                                                <button onClick={() => handleDeleteTweet(tweet.id)} className="action-btn delete">
                                                    <Trash2 size={16} />
                                                    حذف
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </article>
                            ))
                        )}
                    </div>
                </section>
            </main>

            {/* Edit Profile Modal */}
            {showEditProfile && (
                <div className="modal-overlay" onClick={() => setShowEditProfile(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>تعديل البيانات</h2>
                            <button onClick={() => setShowEditProfile(false)} className="modal-close">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={profileForm.handleSubmit(handleUpdateProfile)} className="modal-form">
                            <div className="form-group">
                                <div className="input-wrapper">
                                    <User size={18} className="input-icon" />
                                    <input
                                        {...profileForm.register('name', { required: 'الاسم مطلوب' })}
                                        type="text"
                                        placeholder="الاسم الكامل"
                                        className="form-input with-icon"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-wrapper">
                                    <Mail size={18} className="input-icon" />
                                    <input
                                        {...profileForm.register('email', { required: 'البريد الإلكتروني مطلوب' })}
                                        type="email"
                                        placeholder="البريد الإلكتروني"
                                        className="form-input with-icon"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-wrapper">
                                    <AtSign size={18} className="input-icon" />
                                    <input
                                        {...profileForm.register('username', { required: 'اسم المستخدم مطلوب' })}
                                        type="text"
                                        placeholder="اسم المستخدم"
                                        className="form-input with-icon"
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={isSubmitting} className="auth-submit-btn">
                                {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {showChangePassword && (
                <div className="modal-overlay" onClick={() => setShowChangePassword(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>تغيير كلمة المرور</h2>
                            <button onClick={() => setShowChangePassword(false)} className="modal-close">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} className="modal-form">
                            <div className="form-group">
                                <div className="input-wrapper">
                                    <Lock size={18} className="input-icon" />
                                    <input
                                        {...passwordForm.register('current_password', { required: 'كلمة المرور الحالية مطلوبة' })}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="كلمة المرور الحالية"
                                        className="form-input with-icon"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-wrapper">
                                    <Lock size={18} className="input-icon" />
                                    <input
                                        {...passwordForm.register('password', { required: 'كلمة المرور الجديدة مطلوبة', minLength: 6 })}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="كلمة المرور الجديدة"
                                        className="form-input with-icon"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-wrapper">
                                    <Lock size={18} className="input-icon" />
                                    <input
                                        {...passwordForm.register('password_confirmation', { required: 'تأكيد كلمة المرور مطلوب' })}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="تأكيد كلمة المرور"
                                        className="form-input with-icon"
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={isSubmitting} className="auth-submit-btn">
                                {isSubmitting ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
