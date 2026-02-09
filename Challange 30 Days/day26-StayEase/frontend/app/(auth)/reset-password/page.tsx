'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/lib/auth-store';

const resetSchema = z.object({
    otp: z.string().length(4, 'رمز التحقق يجب أن يكون 4 أرقام'),
    password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: "كلمات المرور غير متطابقة",
    path: ["password_confirmation"],
});

type ResetFormData = z.infer<typeof resetSchema>;

function ResetForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams?.get('email') || '';

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { resetPassword } = useAuthStore();

    const form = useForm<ResetFormData>({
        resolver: zodResolver(resetSchema),
        defaultValues: {
            otp: '',
            password: '',
            password_confirmation: '',
        },
    });

    const onSubmit = async (data: ResetFormData) => {
        if (!email) {
            toast.error('البريد الإلكتروني مطلوب');
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword(email, data.otp, data.password, data.password_confirmation);
            toast.success('تم إعادة تعيين كلمة المرور بنجاح!');
            router.push('/login');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'فشل إعادة تعيين كلمة المرور');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-fade-in text-right">
            <div className="mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <KeyRound className="h-8 w-8 text-primary" />
                </div>
                <h1 className="font-display text-3xl font-bold mb-2 text-center">
                    إعادة تعيين كلمة المرور
                </h1>
                <p className="text-muted-foreground text-center">
                    أدخل الرمز المرسل إلى بريدك الإلكتروني وكلمة المرور الجديدة
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="otp">رمز التحقق</Label>
                    <Input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="0000"
                        className="text-center text-xl tracking-[0.5em] font-mono"
                        {...form.register('otp')}
                    />
                    {form.formState.errors.otp && (
                        <p className="text-sm text-destructive text-center">
                            {form.formState.errors.otp.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">كلمة المرور الجديدة</Label>
                    <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="pr-10 pl-10 text-right"
                            dir="ltr"
                            {...form.register('password')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {form.formState.errors.password && (
                        <p className="text-sm text-destructive">
                            {form.formState.errors.password.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password_confirmation">تأكيد كلمة المرور الجديدة</Label>
                    <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="password_confirmation"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="pr-10 pl-10 text-right"
                            dir="ltr"
                            {...form.register('password_confirmation')}
                        />
                    </div>
                    {form.formState.errors.password_confirmation && (
                        <p className="text-sm text-destructive">
                            {form.formState.errors.password_confirmation.message}
                        </p>
                    )}
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                    إعادة تعيين كلمة المرور
                </Button>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="animate-pulse">جاري التحميل...</div>}>
            <ResetForm />
        </Suspense>
    );
}
