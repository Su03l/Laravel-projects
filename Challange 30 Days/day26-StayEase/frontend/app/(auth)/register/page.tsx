'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/lib/auth-store';

const registerSchema = z.object({
    name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
    email: z.string().email('البريد الإلكتروني غير صحيح'),
    phone: z.string().min(10, 'رقم الهاتف غير صحيح'),
    password: z.string().min(8, 'كمة المرور يجب أن تكون 8 أحرف على الأقل'),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: "كلمات المرور غير متطابقة",
    path: ["password_confirmation"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register: registerUser } = useAuthStore();

    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            password: '',
            password_confirmation: '',
        },
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        try {
            await registerUser(data);
            toast.success('تم إنشاء الحساب! الرجاء تفعيل بريدك الإلكتروني.');
            router.push(`/verify?email=${encodeURIComponent(data.email)}`);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
            if (err.response?.data?.errors) {
                Object.entries(err.response.data.errors).forEach(([, messages]) => {
                    messages.forEach((message: string) => toast.error(message));
                });
            } else {
                toast.error(err.response?.data?.message || 'فشل إنشاء الحساب');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-fade-in text-right">
            <div className="mb-8">
                <h1 className="font-display text-3xl font-bold mb-2">إنشاء حساب</h1>
                <p className="text-muted-foreground">
                    انضم إلى StayEase واستمتع بمزايا حصرية
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل</Label>
                    <div className="relative">
                        <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="name"
                            type="text"
                            placeholder="محمد العلي"
                            className="pr-10 text-right"
                            {...form.register('name')}
                        />
                    </div>
                    {form.formState.errors.name && (
                        <p className="text-sm text-destructive">
                            {form.formState.errors.name.message}
                        </p>
                    )}
                </div>

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

                <div className="space-y-2">
                    <Label htmlFor="phone">رقم الجوال</Label>
                    <div className="relative">
                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="0500000000"
                            className="pr-10 text-right"
                            dir="ltr"
                            {...form.register('phone')}
                        />
                    </div>
                    {form.formState.errors.phone && (
                        <p className="text-sm text-destructive">
                            {form.formState.errors.phone.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">كلمة المرور</Label>
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
                    <Label htmlFor="password_confirmation">تأكيد كلمة المرور</Label>
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
                    إنشاء حساب
                </Button>
            </form>

            <Separator className="my-8" />

            <p className="text-center text-muted-foreground">
                لديك حساب بالفعل؟{' '}
                <Link href="/login" className="text-primary font-medium hover:underline">
                    تسجيل الدخول
                </Link>
            </p>
        </div>
    );
}
