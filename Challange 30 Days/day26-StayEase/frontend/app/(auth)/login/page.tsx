'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/lib/auth-store';

const loginSchema = z.object({
    email: z.string().email('البريد الإلكتروني غير صحيح'),
    password: z.string().min(1, 'كلمة المرور مطلوبة'),
    remember: z.boolean().optional(),
});

const otpSchema = z.object({
    otp: z.string().length(4, 'رمز التحقق يجب أن يكون 4 أرقام'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type OtpFormData = z.infer<typeof otpSchema>;

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams?.get('redirect') || '/dashboard';

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login, verify2FA, requires2FA, pendingEmail } = useAuthStore();

    const loginForm = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            remember: false,
        },
    });

    const otpForm = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: '',
        },
    });

    const onLoginSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        try {
            const result = await login(data);

            if (result.status === '2fa_required') {
                toast.info('الرجاء إدخال رمز التحقق المرسل إلى بريدك الإلكتروني');
            } else {
                toast.success('أهلاً بعودتك!');
                router.push(redirectTo);
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'بيانات الدخول غير صحيحة');
        } finally {
            setIsLoading(false);
        }
    };

    const onOtpSubmit = async (data: OtpFormData) => {
        if (!pendingEmail) return;

        setIsLoading(true);
        try {
            await verify2FA(pendingEmail, data.otp);
            toast.success('أهلاً بعودتك!');
            router.push(redirectTo);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'رمز التحقق غير صحيح');
        } finally {
            setIsLoading(false);
        }
    };

    if (requires2FA) {
        return (
            <div className="animate-fade-in text-right">
                <div className="mb-8">
                    <h1 className="font-display text-3xl font-bold mb-2">
                        التحقق بخطوتين
                    </h1>
                    <p className="text-muted-foreground">
                        أدخل الرمز المكون من 4 أرقام المرسل إلى بريدك الإلكتروني
                    </p>
                </div>

                <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="otp">رمز التحقق</Label>
                        <Input
                            id="otp"
                            type="text"
                            inputMode="numeric"
                            maxLength={4}
                            placeholder="0000"
                            className="text-center text-2xl tracking-[0.5em] font-mono"
                            {...otpForm.register('otp')}
                        />
                        {otpForm.formState.errors.otp && (
                            <p className="text-sm text-destructive">
                                {otpForm.formState.errors.otp.message}
                            </p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                        {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                        تأكيد
                    </Button>
                </form>
            </div>
        );
    }

    return (
        <div className="animate-fade-in text-right">
            <div className="mb-8">
                <h1 className="font-display text-3xl font-bold mb-2">تسجيل الدخول</h1>
                <p className="text-muted-foreground">
                    سجل دخولك للمتابعة إلى حسابك
                </p>
            </div>

            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <div className="relative">
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            className="pr-10 text-right"
                            dir="ltr"
                            {...loginForm.register('email')}
                        />
                    </div>
                    {loginForm.formState.errors.email && (
                        <p className="text-sm text-destructive">
                            {loginForm.formState.errors.email.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between flex-row-reverse">
                        <Label htmlFor="password">كلمة المرور</Label>
                        <Link
                            href="/forgot-password"
                            className="text-sm text-primary hover:underline"
                        >
                            نسيت كلمة المرور؟
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="pr-10 pl-10 text-right"
                            dir="ltr"
                            {...loginForm.register('password')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {loginForm.formState.errors.password && (
                        <p className="text-sm text-destructive">
                            {loginForm.formState.errors.password.message}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2 flex-row-reverse justify-start">
                    <input
                        type="checkbox"
                        id="remember"
                        className="rounded border-input"
                        {...loginForm.register('remember')}
                    />
                    <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                        تذكرني لمدة 30 يوم
                    </Label>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                    تسجيل الدخول
                </Button>
            </form>

            <Separator className="my-8" />

            <p className="text-center text-muted-foreground">
                ليس لديك حساب؟{' '}
                <Link href="/register" className="text-primary font-medium hover:underline">
                    أنشئ حساباً
                </Link>
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="animate-pulse">جاري التحميل...</div>}>
            <LoginForm />
        </Suspense>
    );
}
