'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Eye, EyeOff, User, Lock } from 'lucide-react';

interface LoginFormData {
    login: string;
    password: string;
}

export default function LoginPage() {
    const { login } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

    const onSubmit = async (data: LoginFormData) => {
        setIsSubmitting(true);

        try {
            await login(data);
            showToast('مرحباً بعودتك!', 'success');
            router.push('/');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            showToast(error.response?.data?.message || 'بيانات الدخول غير صحيحة', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-logo">
                    <span className="logo-text">MT</span>
                </div>

                <h1>Welcome Back</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <div className="form-group">
                        <div className="input-wrapper">
                            <User size={18} className="input-icon" />
                            <input
                                {...register('login', { required: 'Username or email is required' })}
                                type="text"
                                placeholder="Username or email"
                                className="form-input with-icon"
                            />
                        </div>
                        {errors.login && <span className="input-error">{errors.login.message}</span>}
                    </div>

                    <div className="form-group">
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                {...register('password', { required: 'Password is required' })}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                className="form-input with-icon"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="password-toggle"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && <span className="input-error">{errors.password.message}</span>}
                    </div>

                    <button type="submit" disabled={isSubmitting} className="auth-submit-btn">
                        {isSubmitting ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <p className="auth-switch">
                    Don&apos;t have an account? <Link href="/register">Sign up</Link>
                </p>
            </div>
        </div>
    );
}
