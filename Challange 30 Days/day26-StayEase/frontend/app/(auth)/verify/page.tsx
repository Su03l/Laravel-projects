'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/lib/auth-store';

const verifySchema = z.object({
    otp: z.string().length(4, 'رمز التحقق يجب أن يكون 4 أرقام'),
});

type VerifyFormData = z.infer<typeof verifySchema>;

function VerifyForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams?.get('email') || '';

    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const { verifyAccount, resendOtp } = useAuthStore();

    const form = useForm<VerifyFormData>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            otp: '',
        },
    });

    const onSubmit = async (data: VerifyFormData) => {
        if (!email) {
            toast.error('البريد الإلكتروني مطلوب');
            return;
        }

        setIsLoading(true);
        try {
            await verifyAccount(email, data.otp);
            toast.success('تم تفعيل الحساب بنجاح!');
            router.push('/dashboard');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
            const errorMessage = err.response?.data?.message
                || (err.response?.data?.errors?.otp?.[0])
                || 'فشل التفعيل';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-fade-in text-right">
            <div className="mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="h-8 w-8 text-primary" />
                </div>
                <h1 className="font-display text-3xl font-bold mb-2 text-center">
                    تفعيل الحساب
                </h1>
                <p className="text-muted-foreground text-center">
                    أرسلنا رمزاً مكوناً من 4 أرقام إلى<br />
                    <span className="font-medium text-foreground">{email}</span>
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="otp">رمز التحقق</Label>
                    <Input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="0000"
                        className="text-center text-2xl tracking-[0.5em] font-mono"
                        {...form.register('otp')}
                    />
                    {form.formState.errors.otp && (
                        <p className="text-sm text-destructive text-center">
                            {form.formState.errors.otp.message}
                        </p>
                    )}
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                    تفعيل الحساب
                </Button>
            </form>

            <p className="text-center text-muted-foreground mt-6 text-sm">
                لم يصلك الرمز؟{' '}
                <button
                    type="button"
                    disabled={isResending}
                    onClick={async () => {
                        if (!email) {
                            toast.error('البريد الإلكتروني مطلوب');
                            return;
                        }
                        setIsResending(true);
                        try {
                            await resendOtp(email);
                            toast.success('تم إرسال رمز جديد!');
                        } catch {
                            toast.error('فشل إرسال الرمز');
                        } finally {
                            setIsResending(false);
                        }
                    }}
                    className="text-primary font-medium hover:underline disabled:opacity-50"
                >
                    {isResending ? 'جاري الإرسال...' : 'إعادة الإرسال'}
                </button>
            </p>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="animate-pulse">جاري التحميل...</div>}>
            <VerifyForm />
        </Suspense>
    );
}
