'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/context/toast-context';
import { RegisterData, ApiError } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { Shield, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { register: registerUser, isAuthenticated, isLoading: authLoading } = useAuth();
    const { showError } = useToast();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterData>();

    const password = watch('password');

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, authLoading, router]);

    const onSubmit = async (data: RegisterData) => {
        setIsLoading(true);
        try {
            await registerUser(data);
            // Set cookie for middleware
            document.cookie = `token=true; path=/; max-age=${60 * 60 * 24 * 7}`;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const apiError = error.response?.data as ApiError;
                if (apiError?.errors) {
                    const firstError = Object.values(apiError.errors)[0]?.[0];
                    showError(firstError || 'Registration failed.');
                } else {
                    showError(apiError?.message || 'Registration failed. Please try again.');
                }
            } else {
                showError('An unexpected error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <div className="animate-pulse text-neutral-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-neutral-900 rounded-2xl mb-4">
                        <Shield className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-900">Identity Hub</h1>
                    <p className="text-neutral-500 mt-1">Create your secure account</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Get started</CardTitle>
                        <CardDescription>Create a new account to continue</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Input
                                id="name"
                                label="Full Name"
                                type="text"
                                placeholder="Enter your full name"
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
                                placeholder="Choose a username"
                                error={errors.username?.message}
                                {...register('username', {
                                    required: 'Username is required',
                                    minLength: { value: 3, message: 'Username must be at least 3 characters' },
                                    pattern: {
                                        value: /^[a-zA-Z0-9_]+$/,
                                        message: 'Username can only contain letters, numbers, and underscores'
                                    },
                                })}
                            />

                            <Input
                                id="email"
                                label="Email Address"
                                type="email"
                                placeholder="Enter your email"
                                error={errors.email?.message}
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    },
                                })}
                            />

                            <Input
                                id="password"
                                label="Password"
                                type="password"
                                placeholder="Create a password"
                                error={errors.password?.message}
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                                })}
                            />

                            <Input
                                id="password_confirmation"
                                label="Confirm Password"
                                type="password"
                                placeholder="Confirm your password"
                                error={errors.password_confirmation?.message}
                                {...register('password_confirmation', {
                                    required: 'Please confirm your password',
                                    validate: (value) => value === password || 'Passwords do not match',
                                })}
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                isLoading={isLoading}
                            >
                                Create Account
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-neutral-500">
                                Already have an account?{' '}
                                <Link
                                    href="/login"
                                    className="font-medium text-neutral-900 hover:underline"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
