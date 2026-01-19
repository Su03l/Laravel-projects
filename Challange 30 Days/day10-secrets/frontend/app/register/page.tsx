'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/context/toast-context';
import { RegisterData, ApiError } from '@/types';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { Shield, ArrowLeft } from 'lucide-react';
import axios from 'axios';

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { register: registerUser, isAuthenticated, isLoading: authLoading } = useAuth();
    const { showSuccess, showError } = useToast();
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
            // Show success toast
            showSuccess('تم إنشاء الحساب بنجاح! يرجى تسجيل الدخول.');
            // Wait 2 seconds then redirect to login
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const apiError = error.response?.data as ApiError;
                if (apiError?.errors) {
                    const firstError = Object.values(apiError.errors)[0]?.[0];
                    showError(firstError || 'فشل التسجيل.');
                } else {
                    showError(apiError?.message || 'فشل التسجيل. حاول مرة أخرى.');
                }
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
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12" dir="rtl">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-neutral-900 rounded-2xl mb-4">
                        <Shield className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-900">مركز الهوية</h1>
                    <p className="text-neutral-500 mt-1">أنشئ حسابك الآمن</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>ابدأ الآن</CardTitle>
                        <CardDescription>أنشئ حساباً جديداً للمتابعة</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Input
                                id="name"
                                label="الاسم الكامل"
                                type="text"
                                placeholder="أدخل اسمك الكامل"
                                error={errors.name?.message}
                                {...register('name', {
                                    required: 'الاسم مطلوب',
                                    minLength: { value: 2, message: 'الاسم يجب أن يكون حرفين على الأقل' },
                                })}
                            />

                            <Input
                                id="username"
                                label="اسم المستخدم"
                                type="text"
                                placeholder="اختر اسم مستخدم"
                                error={errors.username?.message}
                                {...register('username', {
                                    required: 'اسم المستخدم مطلوب',
                                    minLength: { value: 3, message: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' },
                                    pattern: {
                                        value: /^[a-zA-Z0-9_]+$/,
                                        message: 'اسم المستخدم يمكن أن يحتوي على أحرف وأرقام و _'
                                    },
                                })}
                            />

                            <Input
                                id="email"
                                label="البريد الإلكتروني"
                                type="email"
                                placeholder="أدخل بريدك الإلكتروني"
                                error={errors.email?.message}
                                {...register('email', {
                                    required: 'البريد الإلكتروني مطلوب',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'بريد إلكتروني غير صالح'
                                    },
                                })}
                            />

                            <PasswordInput
                                id="password"
                                label="كلمة المرور"
                                placeholder="أنشئ كلمة مرور"
                                error={errors.password?.message}
                                {...register('password', {
                                    required: 'كلمة المرور مطلوبة',
                                    minLength: { value: 8, message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' },
                                })}
                            />

                            <PasswordInput
                                id="password_confirmation"
                                label="تأكيد كلمة المرور"
                                placeholder="أكد كلمة المرور"
                                error={errors.password_confirmation?.message}
                                {...register('password_confirmation', {
                                    required: 'يرجى تأكيد كلمة المرور',
                                    validate: (value) => value === password || 'كلمات المرور غير متطابقة',
                                })}
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                isLoading={isLoading}
                            >
                                إنشاء الحساب
                                <ArrowLeft className="w-4 h-4 mr-2" />
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-neutral-500">
                                لديك حساب بالفعل؟{' '}
                                <Link
                                    href="/login"
                                    className="font-medium text-neutral-900 hover:underline"
                                >
                                    سجّل دخولك
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
