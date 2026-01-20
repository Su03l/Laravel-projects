'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Eye, EyeOff, User, Mail, AtSign, Lock } from 'lucide-react';

interface RegisterFormData {
    name: string;
    email: string;
    username: string;
    password: string;
    password_confirmation: string;
}

export default function RegisterPage() {
    const { register: registerUser } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();
    const password = watch('password');

    const onSubmit = async (data: RegisterFormData) => {
        setIsSubmitting(true);

        try {
            await registerUser(data);
            showToast('تم إنشاء الحساب! سجل دخولك الآن.', 'success');
            router.push('/login');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
            if (error.response?.data?.errors) {
                const firstError = Object.values(error.response.data.errors)[0];
                showToast(firstError[0], 'error');
            } else {
                showToast(error.response?.data?.message || 'فشل في إنشاء الحساب', 'error');
            }
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

                <h1>Create Account</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <div className="form-group">
                        <div className="input-wrapper">
                            <User size={18} className="input-icon" />
                            <input
                                {...register('name', { required: 'Name is required' })}
                                type="text"
                                placeholder="Full Name"
                                className="form-input with-icon"
                            />
                        </div>
                        {errors.name && <span className="input-error">{errors.name.message}</span>}
                    </div>

                    <div className="form-group">
                        <div className="input-wrapper">
                            <Mail size={18} className="input-icon" />
                            <input
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                                })}
                                type="email"
                                placeholder="Email"
                                className="form-input with-icon"
                            />
                        </div>
                        {errors.email && <span className="input-error">{errors.email.message}</span>}
                    </div>

                    <div className="form-group">
                        <div className="input-wrapper">
                            <AtSign size={18} className="input-icon" />
                            <input
                                {...register('username', {
                                    required: 'Username is required',
                                    minLength: { value: 3, message: 'Username must be at least 3 characters' }
                                })}
                                type="text"
                                placeholder="Username"
                                className="form-input with-icon"
                            />
                        </div>
                        {errors.username && <span className="input-error">{errors.username.message}</span>}
                    </div>

                    <div className="form-group">
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                })}
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

                    <div className="form-group">
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                {...register('password_confirmation', {
                                    required: 'Please confirm your password',
                                    validate: value => value === password || 'Passwords do not match'
                                })}
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm Password"
                                className="form-input with-icon"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="password-toggle"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password_confirmation && <span className="input-error">{errors.password_confirmation.message}</span>}
                    </div>

                    <button type="submit" disabled={isSubmitting} className="auth-submit-btn">
                        {isSubmitting ? 'Creating account...' : 'Sign up'}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account? <Link href="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
