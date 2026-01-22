'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userApi } from '@/lib/api';
import { User, Mail, Lock, Loader2, Save, Check, Eye, EyeOff, AtSign } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface ProfileForm { name: string; username: string; email: string; }
interface PasswordForm { current_password: string; password: string; password_confirmation: string; }

export default function ProfilePage() {
    const { user, refreshUser } = useAuth();
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors }, reset: resetProfile } = useForm<ProfileForm>();
    const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword, watch } = useForm<PasswordForm>();
    const password = watch('password');

    useEffect(() => {
        if (user) resetProfile({ name: user.name, username: user.username || '', email: user.email });
    }, [user, resetProfile]);

    const onUpdateProfile = async (data: ProfileForm) => {
        setIsUpdatingProfile(true);
        try { await userApi.updateProfile(data); await refreshUser(); toast.success('تم تحديث الملف الشخصي'); }
        catch { toast.error('فشل تحديث الملف الشخصي'); }
        finally { setIsUpdatingProfile(false); }
    };

    const onUpdatePassword = async (data: PasswordForm) => {
        setIsUpdatingPassword(true);
        try { await userApi.changePassword(data); toast.success('تم تغيير كلمة المرور'); resetPassword(); }
        catch { toast.error('فشل تغيير كلمة المرور'); }
        finally { setIsUpdatingPassword(false); }
    };

    if (!user) return null;

    const inputWithIconStyle = { paddingLeft: '3rem' };
    const inputWithBothIconsStyle = { paddingLeft: '3rem', paddingRight: '3rem' };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-8">Profile Settings</h1>

            {/* Profile Info Card */}
            <div className="card p-8 mb-6">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-black">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">{user.name}</h2>
                        <p className="text-sm" style={{ color: 'var(--muted)' }}>@{user.username || 'username'}</p>
                        <p className="text-sm" style={{ color: 'var(--muted)' }}>{user.email}</p>
                    </div>
                </div>

                <form onSubmit={handleProfileSubmit(onUpdateProfile)}>
                    {/* Grid Layout - 2 columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                        <div>
                            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--muted)' }}>Full Name</label>
                            <div className="relative flex items-center">
                                <User className="absolute left-4 w-5 h-5 pointer-events-none" style={{ color: 'var(--muted-dark)' }} strokeWidth={1.5} />
                                <input type="text" {...registerProfile('name', { required: 'Name is required' })} className="input" style={inputWithIconStyle} />
                            </div>
                            {profileErrors.name && <p className="text-sm mt-2" style={{ color: 'var(--danger)' }}>{profileErrors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--muted)' }}>Username</label>
                            <div className="relative flex items-center">
                                <AtSign className="absolute left-4 w-5 h-5 pointer-events-none" style={{ color: 'var(--muted-dark)' }} strokeWidth={1.5} />
                                <input
                                    type="text"
                                    {...registerProfile('username', {
                                        required: 'Username is required',
                                        pattern: { value: /^[a-zA-Z0-9_-]+$/, message: 'Invalid username format' }
                                    })}
                                    className="input"
                                    style={inputWithIconStyle}
                                />
                            </div>
                            {profileErrors.username && <p className="text-sm mt-2" style={{ color: 'var(--danger)' }}>{profileErrors.username.message}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--muted)' }}>Email Address</label>
                            <div className="relative flex items-center">
                                <Mail className="absolute left-4 w-5 h-5 pointer-events-none" style={{ color: 'var(--muted-dark)' }} strokeWidth={1.5} />
                                <input type="email" {...registerProfile('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' } })} className="input" style={inputWithIconStyle} />
                            </div>
                            {profileErrors.email && <p className="text-sm mt-2" style={{ color: 'var(--danger)' }}>{profileErrors.email.message}</p>}
                        </div>
                    </div>

                    <button type="submit" disabled={isUpdatingProfile} className="btn btn-primary">
                        {isUpdatingProfile ? (<><Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />Saving...</>) : (<><Save className="w-4 h-4" strokeWidth={1.5} />Save Changes</>)}
                    </button>
                </form>
            </div>

            {/* Change Password Card */}
            <div className="card p-8">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
                    <Lock className="w-5 h-5" strokeWidth={1.5} />
                    Change Password
                </h3>

                <form onSubmit={handlePasswordSubmit(onUpdatePassword)}>
                    {/* Grid Layout - 2 columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--muted)' }}>Current Password</label>
                            <div className="relative flex items-center">
                                <Lock className="absolute left-4 w-5 h-5 pointer-events-none" style={{ color: 'var(--muted-dark)' }} strokeWidth={1.5} />
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    {...registerPassword('current_password', { required: 'Current password is required' })}
                                    className="input"
                                    placeholder="Enter current password"
                                    style={inputWithBothIconsStyle}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-4 p-1 rounded-md transition-colors hover:bg-white/10"
                                    style={{ color: 'var(--muted-dark)' }}
                                >
                                    {showCurrentPassword ? <EyeOff className="w-5 h-5" strokeWidth={1.5} /> : <Eye className="w-5 h-5" strokeWidth={1.5} />}
                                </button>
                            </div>
                            {passwordErrors.current_password && <p className="text-sm mt-2" style={{ color: 'var(--danger)' }}>{passwordErrors.current_password.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--muted)' }}>New Password</label>
                            <div className="relative flex items-center">
                                <Lock className="absolute left-4 w-5 h-5 pointer-events-none" style={{ color: 'var(--muted-dark)' }} strokeWidth={1.5} />
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    {...registerPassword('password', { required: 'New password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
                                    className="input"
                                    placeholder="Enter new password"
                                    style={inputWithBothIconsStyle}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-4 p-1 rounded-md transition-colors hover:bg-white/10"
                                    style={{ color: 'var(--muted-dark)' }}
                                >
                                    {showNewPassword ? <EyeOff className="w-5 h-5" strokeWidth={1.5} /> : <Eye className="w-5 h-5" strokeWidth={1.5} />}
                                </button>
                            </div>
                            {passwordErrors.password && <p className="text-sm mt-2" style={{ color: 'var(--danger)' }}>{passwordErrors.password.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--muted)' }}>Confirm New Password</label>
                            <div className="relative flex items-center">
                                <Lock className="absolute left-4 w-5 h-5 pointer-events-none" style={{ color: 'var(--muted-dark)' }} strokeWidth={1.5} />
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    {...registerPassword('password_confirmation', { required: 'Please confirm password', validate: (value) => value === password || 'Passwords do not match' })}
                                    className="input"
                                    placeholder="Confirm new password"
                                    style={inputWithBothIconsStyle}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-4 p-1 rounded-md transition-colors hover:bg-white/10"
                                    style={{ color: 'var(--muted-dark)' }}
                                >
                                    {showNewPassword ? <EyeOff className="w-5 h-5" strokeWidth={1.5} /> : <Eye className="w-5 h-5" strokeWidth={1.5} />}
                                </button>
                            </div>
                            {passwordErrors.password_confirmation && <p className="text-sm mt-2" style={{ color: 'var(--danger)' }}>{passwordErrors.password_confirmation.message}</p>}
                        </div>
                    </div>

                    <button type="submit" disabled={isUpdatingPassword} className="btn btn-primary">
                        {isUpdatingPassword ? (<><Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />Updating...</>) : (<><Check className="w-4 h-4" strokeWidth={1.5} />Update Password</>)}
                    </button>
                </form>
            </div>
        </div>
    );
}
