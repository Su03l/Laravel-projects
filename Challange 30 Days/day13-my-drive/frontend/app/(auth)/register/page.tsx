'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { RegisterCredentials } from '@/types';
import Link from 'next/link';
import { HardDrive, Mail, Lock, User, AtSign, Loader2, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
    const { register: registerUser, isLoading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterCredentials>();

    const password = watch('password');

    const onSubmit = async (data: RegisterCredentials) => {
        setIsSubmitting(true);
        try {
            await registerUser(data);
        } catch {
            // Error handled in context
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputWithIconStyle = { paddingLeft: '3rem' };
    const inputWithBothIconsStyle = { paddingLeft: '3rem', paddingRight: '3rem' };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-10">
                    <div
                        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
                        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    >
                        <HardDrive className="w-10 h-10 text-white" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p style={{ color: 'var(--muted)' }}>
                        Start your cloud storage journey
                    </p>
                </div>

                {/* Form Card */}
                <div className="card p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--muted)' }}>
                                Full Name
                            </label>
                            <div className="relative flex items-center">
                                <User className="absolute left-4 w-5 h-5 pointer-events-none" style={{ color: 'var(--muted-dark)' }} strokeWidth={1.5} />
                                <input
                                    type="text"
                                    {...register('name', {
                                        required: 'Name is required',
                                        minLength: { value: 2, message: 'Name must be at least 2 characters' },
                                    })}
                                    placeholder="Enter your full name"
                                    className="input"
                                    style={inputWithIconStyle}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-sm mt-2" style={{ color: 'var(--danger)' }}>{errors.name.message}</p>
                            )}
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--muted)' }}>
                                Username
                            </label>
                            <div className="relative flex items-center">
                                <AtSign className="absolute left-4 w-5 h-5 pointer-events-none" style={{ color: 'var(--muted-dark)' }} strokeWidth={1.5} />
                                <input
                                    type="text"
                                    {...register('username', {
                                        required: 'Username is required',
                                        minLength: { value: 3, message: 'Username must be at least 3 characters' },
                                        pattern: {
                                            value: /^[a-zA-Z0-9_-]+$/,
                                            message: 'Username can only contain letters, numbers, underscores, and hyphens'
                                        },
                                    })}
                                    placeholder="Choose a username"
                                    className="input"
                                    style={inputWithIconStyle}
                                />
                            </div>
                            {errors.username && (
                                <p className="text-sm mt-2" style={{ color: 'var(--danger)' }}>{errors.username.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--muted)' }}>
                                Email Address
                            </label>
                            <div className="relative flex items-center">
                                <Mail className="absolute left-4 w-5 h-5 pointer-events-none" style={{ color: 'var(--muted-dark)' }} strokeWidth={1.5} />
                                <input
                                    type="email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' },
                                    })}
                                    placeholder="Enter your email"
                                    className="input"
                                    style={inputWithIconStyle}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm mt-2" style={{ color: 'var(--danger)' }}>{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--muted)' }}>
                                Password
                            </label>
                            <div className="relative flex items-center">
                                <Lock className="absolute left-4 w-5 h-5 pointer-events-none" style={{ color: 'var(--muted-dark)' }} strokeWidth={1.5} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: { value: 8, message: 'Password must be at least 8 characters' },
                                    })}
                                    placeholder="Create a password"
                                    className="input"
                                    style={inputWithBothIconsStyle}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 p-1 rounded-md transition-colors hover:bg-white/10"
                                    style={{ color: 'var(--muted-dark)' }}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" strokeWidth={1.5} /> : <Eye className="w-5 h-5" strokeWidth={1.5} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm mt-2" style={{ color: 'var(--danger)' }}>{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--muted)' }}>
                                Confirm Password
                            </label>
                            <div className="relative flex items-center">
                                <Lock className="absolute left-4 w-5 h-5 pointer-events-none" style={{ color: 'var(--muted-dark)' }} strokeWidth={1.5} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password_confirmation', {
                                        required: 'Please confirm your password',
                                        validate: (value) => value === password || 'Passwords do not match',
                                    })}
                                    placeholder="Confirm your password"
                                    className="input"
                                    style={inputWithBothIconsStyle}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 p-1 rounded-md transition-colors hover:bg-white/10"
                                    style={{ color: 'var(--muted-dark)' }}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" strokeWidth={1.5} /> : <Eye className="w-5 h-5" strokeWidth={1.5} />}
                                </button>
                            </div>
                            {errors.password_confirmation && (
                                <p className="text-sm mt-2" style={{ color: 'var(--danger)' }}>{errors.password_confirmation.message}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button type="submit" disabled={isSubmitting || isLoading} className="btn btn-primary w-full py-3.5 text-base font-semibold mt-4">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-8 text-center">
                        <p className="text-sm" style={{ color: 'var(--muted)' }}>
                            Already have an account?{' '}
                            <Link href="/login" className="text-white hover:underline font-semibold">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
