'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userApi } from '@/lib/api';
import { User, Mail, Lock, Loader2, Save, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface ProfileForm {
    name: string;
    email: string;
}

interface PasswordForm {
    current_password: string;
    password: string;
    password_confirmation: string;
}

export default function ProfilePage() {
    const { user, refreshUser } = useAuth();
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    const {
        register: registerProfile,
        handleSubmit: handleProfileSubmit,
        formState: { errors: profileErrors },
        reset: resetProfile,
    } = useForm<ProfileForm>();

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors },
        reset: resetPassword,
        watch,
    } = useForm<PasswordForm>();

    const password = watch('password');

    useEffect(() => {
        if (user) {
            resetProfile({
                name: user.name,
                email: user.email,
            });
        }
    }, [user, resetProfile]);

    const onUpdateProfile = async (data: ProfileForm) => {
        setIsUpdatingProfile(true);
        try {
            await userApi.updateProfile(data);
            await refreshUser();
            toast.success('تم تحديث الملف الشخصي');
        } catch {
            toast.error('فشل تحديث الملف الشخصي');
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const onUpdatePassword = async (data: PasswordForm) => {
        setIsUpdatingPassword(true);
        try {
            await userApi.changePassword(data);
            toast.success('تم تغيير كلمة المرور');
            resetPassword();
        } catch {
            toast.error('فشل تغيير كلمة المرور');
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    if (!user) return null;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-[var(--foreground)] mb-8">
                Profile Settings
            </h1>

            {/* Profile Info Card */}
            <div className="card p-6 mb-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                            {user.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-[var(--foreground)]">
                            {user.name}
                        </h2>
                        <p className="text-sm text-[var(--foreground-secondary)]">
                            {user.email}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-secondary)]" />
                            <input
                                type="text"
                                {...registerProfile('name', { required: 'Name is required' })}
                                className="input pl-11"
                            />
                        </div>
                        {profileErrors.name && (
                            <p className="text-sm text-[var(--danger)] mt-1">{profileErrors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-secondary)]" />
                            <input
                                type="email"
                                {...registerProfile('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email',
                                    },
                                })}
                                className="input pl-11"
                            />
                        </div>
                        {profileErrors.email && (
                            <p className="text-sm text-[var(--danger)] mt-1">{profileErrors.email.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isUpdatingProfile}
                        className="btn btn-primary"
                    >
                        {isUpdatingProfile ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Change Password Card */}
            <div className="card p-6">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Change Password
                </h3>

                <form onSubmit={handlePasswordSubmit(onUpdatePassword)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-2">
                            Current Password
                        </label>
                        <input
                            type="password"
                            {...registerPassword('current_password', { required: 'Current password is required' })}
                            className="input"
                            placeholder="Enter current password"
                        />
                        {passwordErrors.current_password && (
                            <p className="text-sm text-[var(--danger)] mt-1">{passwordErrors.current_password.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            {...registerPassword('password', {
                                required: 'New password is required',
                                minLength: { value: 8, message: 'Password must be at least 8 characters' },
                            })}
                            className="input"
                            placeholder="Enter new password"
                        />
                        {passwordErrors.password && (
                            <p className="text-sm text-[var(--danger)] mt-1">{passwordErrors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-2">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            {...registerPassword('password_confirmation', {
                                required: 'Please confirm password',
                                validate: (value) => value === password || 'Passwords do not match',
                            })}
                            className="input"
                            placeholder="Confirm new password"
                        />
                        {passwordErrors.password_confirmation && (
                            <p className="text-sm text-[var(--danger)] mt-1">{passwordErrors.password_confirmation.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isUpdatingPassword}
                        className="btn btn-primary"
                    >
                        {isUpdatingPassword ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                Update Password
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
