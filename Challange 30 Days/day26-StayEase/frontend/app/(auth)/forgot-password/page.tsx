'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Mail, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/lib/auth-store';

const forgotSchema = z.object({
    email: z.string().email('البريد الإلكتروني غير صحيح'),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { forgotPassword } = useAuthStore();

    const form = useForm<ForgotFormData>({
        resolver: zodResolver(forgotSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: ForgotFormData) => {
        setIsLoading(true);
        try {
            await forgotPassword(data.email);
            toast.success('تم إرسال رمز إعادة الضبط إلى بريدك الإلكتروني');
            router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'فشل إرسال رمز إعادة الضبط');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-fade-in text-right">
            <div className="mb-8">
                <h1 className="font-display text-3xl font-bold mb-2">نسيت كلمة المرور؟</h1>
                <p className="text-muted-foreground">
                    لا تقلق، سنرسل لك تعليمات إعادة الضبط.
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                            {...form.register('email')}
                        />
                    </div>
                    {form.formState.errors.email && (
                        <p className="text-sm text-destructive">
                            {form.formState.errors.email.message}
                        </p>
                    )}
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                    إرسال رمز إعادة الضبط
                </Button>
            </form>

            <div className="mt-8 text-center">
                <Link
                    href="/login"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground flex-row-reverse"
                >
                    <ArrowRight className="h-4 w-4 ml-2" />
                    العودة لتسجيل الدخول
                </Link>
            </div>
        </div>
    );
}
