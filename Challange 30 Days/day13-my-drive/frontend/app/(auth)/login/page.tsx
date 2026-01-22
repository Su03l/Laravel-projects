'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { LoginCredentials } from '@/types';
import Link from 'next/link';
import { HardDrive, AtSign, Lock, Loader2, Eye, EyeOff } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-10">
                    <div
                        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
                        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    >
                        <HardDrive className="w-10 h-10 text-white" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p style={{ color: 'var(--muted)' }}>
                        Sign in to your cloud storage
                    </p>
                </div>

                {/* Form Card */}
                <div className="card p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email or Username */}
                        <div>
                            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--muted)' }}>
                                Email or Username
                            </label>
                            <div className="relative flex items-center">
                                <AtSign
                                    className="absolute left-4 w-5 h-5 pointer-events-none"
                                    style={{ color: 'var(--muted-dark)' }}
                                    strokeWidth={1.5}
                                />
                                <input
                                    type="text"
                                    {...register('login', {
                                        required: 'Email or username is required',
                                    })}
                                    placeholder="Enter your email or username"
                                    className="input"
                                    style={{ paddingLeft: '3rem' }}
                                />
                            </div>
                            {errors.login && (
                                <p className="text-sm mt-2" style={{ color: 'var(--danger)' }}>
                                    {errors.login.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--muted)' }}>
                                Password
                            </label>
                            <div className="relative flex items-center">
                                <Lock
                                    className="absolute left-4 w-5 h-5 pointer-events-none"
                                    style={{ color: 'var(--muted-dark)' }}
                                    strokeWidth={1.5}
                                />
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
                                    className="input"
                                    style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
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
                                <p className="text-sm mt-2" style={{ color: 'var(--danger)' }}>
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className="btn btn-primary w-full py-3.5 text-base font-semibold mt-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-8 text-center">
                        <p className="text-sm" style={{ color: 'var(--muted)' }}>
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="text-white hover:underline font-semibold">
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
