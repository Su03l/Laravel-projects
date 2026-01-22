'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { LoginCredentials } from '@/types';
import Link from 'next/link';
import { HardDrive, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const { login, isLoading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginCredentials>();

    const onSubmit = async (data: LoginCredentials) => {
        setIsSubmitting(true);
        try {
            await login(data);
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
                        Welcome Back
                    </h1>
                    <p className="text-[var(--foreground-secondary)] mt-2">
                        Sign in to your cloud storage
                    </p>
                </div>

                {/* Form Card */}
                <div className="card p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                                            value: 6,
                                            message: 'Password must be at least 6 characters',
                                        },
                                    })}
                                    placeholder="Enter your password"
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

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className="btn btn-primary w-full py-3"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-[var(--foreground-secondary)]">
                            Don&apos;t have an account?{' '}
                            <Link
                                href="/register"
                                className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium"
                            >
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
