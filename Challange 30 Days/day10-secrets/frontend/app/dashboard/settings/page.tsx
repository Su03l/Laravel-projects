'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/context/toast-context';
import { UpdateProfileData, ChangePasswordData, ApiError } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { User, Lock, Check } from 'lucide-react';
import axios from 'axios';

type TabType = 'profile' | 'security';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<TabType>('profile');
    const { user } = useAuth();

    const tabs = [
        { id: 'profile' as const, name: 'Edit Profile', icon: User },
        { id: 'security' as const, name: 'Security', icon: Lock },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
                <p className="text-neutral-500 mt-1">Manage your account preferences</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-neutral-100 rounded-xl w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
              transition-all duration-200
              ${activeTab === tab.id
                                ? 'bg-white text-neutral-900 shadow-sm'
                                : 'text-neutral-600 hover:text-neutral-900'
                            }
            `}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'profile' && user && <ProfileTab user={user} />}
            {activeTab === 'security' && <SecurityTab />}
        </div>
    );
}

function ProfileTab({ user }: { user: { name: string; username: string; email: string } }) {
    const [isLoading, setIsLoading] = useState(false);
    const { updateProfile } = useAuth();
    const { showSuccess, showError } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UpdateProfileData>({
        defaultValues: {
            name: user.name,
            username: user.username,
            email: user.email,
        },
    });

    const onSubmit = async (data: UpdateProfileData) => {
        setIsLoading(true);
        try {
            await updateProfile(data);
            showSuccess('Profile updated successfully!');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const apiError = error.response?.data as ApiError;
                if (apiError?.errors) {
                    const firstError = Object.values(apiError.errors)[0]?.[0];
                    showError(firstError || 'Update failed.');
                } else {
                    showError(apiError?.message || 'Failed to update profile.');
                }
            } else {
                showError('An unexpected error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg">
                    <Input
                        id="name"
                        label="Full Name"
                        type="text"
                        error={errors.name?.message}
                        {...register('name', {
                            required: 'Name is required',
                            minLength: { value: 2, message: 'Name must be at least 2 characters' },
                        })}
                    />

                    <Input
                        id="username"
                        label="Username"
                        type="text"
                        error={errors.username?.message}
                        {...register('username', {
                            required: 'Username is required',
                            minLength: { value: 3, message: 'Username must be at least 3 characters' },
                            pattern: {
                                value: /^[a-zA-Z0-9_]+$/,
                                message: 'Username can only contain letters, numbers, and underscores',
                            },
                        })}
                    />

                    <Input
                        id="email"
                        label="Email Address"
                        type="email"
                        error={errors.email?.message}
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address',
                            },
                        })}
                    />

                    <Button type="submit" isLoading={isLoading}>
                        <Check className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

function SecurityTab() {
    const [isLoading, setIsLoading] = useState(false);
    const { changePassword } = useAuth();
    const { showSuccess, showError } = useToast();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordData>();

    const password = watch('password');

    const onSubmit = async (data: ChangePasswordData) => {
        setIsLoading(true);
        try {
            await changePassword(data);
            showSuccess('Password changed successfully!');
            reset();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const apiError = error.response?.data as ApiError;
                if (apiError?.errors) {
                    const firstError = Object.values(apiError.errors)[0]?.[0];
                    showError(firstError || 'Password change failed.');
                } else {
                    showError(apiError?.message || 'Failed to change password.');
                }
            } else {
                showError('An unexpected error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg">
                    <Input
                        id="current_password"
                        label="Current Password"
                        type="password"
                        placeholder="Enter your current password"
                        error={errors.current_password?.message}
                        {...register('current_password', {
                            required: 'Current password is required',
                        })}
                    />

                    <Input
                        id="password"
                        label="New Password"
                        type="password"
                        placeholder="Enter your new password"
                        error={errors.password?.message}
                        {...register('password', {
                            required: 'New password is required',
                            minLength: { value: 8, message: 'Password must be at least 8 characters' },
                        })}
                    />

                    <Input
                        id="password_confirmation"
                        label="Confirm New Password"
                        type="password"
                        placeholder="Confirm your new password"
                        error={errors.password_confirmation?.message}
                        {...register('password_confirmation', {
                            required: 'Please confirm your new password',
                            validate: (value) => value === password || 'Passwords do not match',
                        })}
                    />

                    <Button type="submit" isLoading={isLoading}>
                        <Lock className="w-4 h-4 mr-2" />
                        Update Password
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
