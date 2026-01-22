'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { RegisterCredentials } from '@/types';
import Link from 'next/link';
import { HardDrive, Mail, Lock, User, Loader2, Eye, EyeOff } from 'lucide-react';

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

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#0f0f0f]">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-4 bg-[var(--primary-light)] rounded-2xl mb-4">
                        <HardDrive className="w-10 h-10 text-[var(--primary)]" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)]">
                        Create Account
                    </h1>
                    <p className="text-[var(--foreground-secondary)] mt-2">
                        Start your cloud storage journey
                    </p>
                </div>

                {/* Form Card */}
                <div className="card p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-secondary)]" />
                                <input
                                    type="text"
                                    {...register('name', {
                                        required: 'Name is required',
                                        minLength: {
                                            value: 2,
                                            message: 'Name must be at least 2 characters',
                                        },
                                    })}
                                    placeholder="Enter your name"
                                    className="input pl-11"
                                />
                            </div>
                            {errors.name && (
                                <p className="text-sm text-[var(--danger)] mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-secondary)]" />
                                <input
                                    type="email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address',
                                        },
                                    })}
                                    placeholder="Enter your email"
                                    className="input pl-11"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-[var(--danger)] mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-secondary)]" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 8,
                                            message: 'Password must be at least 8 characters',
                                        },
                                    })}
                                    placeholder="Create a password"
                                    className="input pl-11 pr-11"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-[var(--danger)] mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-secondary)]" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password_confirmation', {
                                        required: 'Please confirm your password',
                                        validate: (value) =>
                                            value === password || 'Passwords do not match',
                                    })}
                                    placeholder="Confirm your password"
                                    className="input pl-11"
                                />
                            </div>
                            {errors.password_confirmation && (
                                <p className="text-sm text-[var(--danger)] mt-1">
                                    {errors.password_confirmation.message}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className="btn btn-primary w-full py-3"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-[var(--foreground-secondary)]">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
