'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/context/toast-context';
import { LoginCredentials, ApiError } from '@/types';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { Shield, ArrowLeft } from 'lucide-react';
import axios from 'axios';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { login, isAuthenticated, isLoading: authLoading } = useAuth();
    const { showError } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/dashboard';

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginCredentials>();

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.push(redirect);
        }
    }, [isAuthenticated, authLoading, router, redirect]);

    const onSubmit = async (data: LoginCredentials) => {
        setIsLoading(true);
        try {
            await login(data);
            // Set cookie for middleware
            document.cookie = `token=true; path=/; max-age=${60 * 60 * 24 * 7}`;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const apiError = error.response?.data as ApiError;
                showError(apiError?.message || 'فشل تسجيل الدخول. حاول مرة أخرى.');
            } else {
                showError('حدث خطأ غير متوقع.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50" dir="rtl">
                <div className="animate-pulse text-neutral-500">جاري التحميل...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4" dir="rtl">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-neutral-900 rounded-2xl mb-4">
                        <Shield className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-900">مركز الهوية</h1>
                    <p className="text-neutral-500 mt-1">نظام مصادقة آمن</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>مرحباً بعودتك</CardTitle>
                        <CardDescription>سجّل دخولك للمتابعة</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Input
                                id="login"
                                label="البريد الإلكتروني أو اسم المستخدم"
                                type="text"
                                placeholder="أدخل الإيميل أو اسم المستخدم"
                                error={errors.login?.message}
                                {...register('login', {
                                    required: 'هذا الحقل مطلوب',
                                })}
                            />

                            <PasswordInput
                                id="password"
                                label="كلمة المرور"
                                placeholder="أدخل كلمة المرور"
                                error={errors.password?.message}
                                {...register('password', {
                                    required: 'كلمة المرور مطلوبة',
                                })}
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                isLoading={isLoading}
                            >
                                تسجيل الدخول
                                <ArrowLeft className="w-4 h-4 mr-2" />
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-neutral-500">
                                ليس لديك حساب؟{' '}
                                <Link
                                    href="/register"
                                    className="font-medium text-neutral-900 hover:underline"
                                >
                                    أنشئ حساباً
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
