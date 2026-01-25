'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { Loader2, UserPlus, User, Mail, Lock, Eye, EyeOff, AtSign } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import InputField from '@/components/InputField';

export default function Register() {
    const router = useRouter();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data } = await api.post('/register', formData);
            if (data.token) {
                login(data.token, data.user);
                router.push('/');
            } else {
                router.push('/login?registered=true');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please check your inputs.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <UserPlus className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Create an account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Join our community of tech enthusiasts
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            icon={User}
                            type="text"
                            placeholder="First Name"
                            value={formData.first_name}
                            onChange={(e: any) => setFormData({ ...formData, first_name: e.target.value })}
                        />
                        <InputField
                            icon={User}
                            type="text"
                            placeholder="Last Name"
                            value={formData.last_name}
                            onChange={(e: any) => setFormData({ ...formData, last_name: e.target.value })}
                        />
                    </div>

                    <InputField
                        icon={AtSign}
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={(e: any) => setFormData({ ...formData, username: e.target.value })}
                    />

                    <InputField
                        icon={Mail}
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                    />

                    <InputField
                        icon={Lock}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
                        togglePassword={() => setShowPassword(!showPassword)}
                        showPassword={showPassword}
                    />

                    <InputField
                        icon={Lock}
                        type="password"
                        placeholder="Confirm Password"
                        value={formData.password_confirmation}
                        onChange={(e: any) => setFormData({ ...formData, password_confirmation: e.target.value })}
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-primary hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-6"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                    </button>

                    <div className="text-center mt-4 text-sm text-gray-500">
                        Already have an account?
                        <Link href="/login" className="font-medium text-primary hover:text-blue-500 ml-1">
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
