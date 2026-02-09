'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    User, Mail, Phone, Shield, Eye, EyeOff, Loader2,
    Check, Camera
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useUpdateProfile, useChangePassword, useToggle2FA } from '@/lib/api-hooks';
import { useAuthStore } from '@/lib/auth-store';

const profileSchema = z.object({
    name: z.string().min(2, 'الاسم مطلوب'),
    email: z.string().email('البريد الإلكتروني غير صالح'),
    phone: z.string().min(10, 'رقم الهاتف مطلوب'),
});

const passwordSchema = z.object({
    current_password: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
    new_password: z.string().min(8, 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل'),
    new_password_confirmation: z.string(),
}).refine((data) => data.new_password === data.new_password_confirmation, {
    message: "كلمات المرور غير متطابقة",
    path: ['new_password_confirmation'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
    const { user, fetchUser } = useAuthStore();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const updateProfile = useUpdateProfile();
    const changePassword = useChangePassword();
    const toggle2FA = useToggle2FA();

    // Fetch fresh user data on mount
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const profileForm = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
        },
    });

    // Update form when user data is available
    useEffect(() => {
        if (user) {
            profileForm.reset({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
            });
        }
    }, [user, profileForm]);

    const passwordForm = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            current_password: '',
            new_password: '',
            new_password_confirmation: '',
        },
    });

    const onProfileSubmit = async (data: ProfileFormData) => {
        try {
            await updateProfile.mutateAsync(data);
            await fetchUser();
            toast.success('تم تحديث الملف الشخصي بنجاح');
        } catch (error: any) {
            const message = error.response?.data?.message || 'فشل تحديث الملف الشخصي';
            const errors = error.response?.data?.errors;

            if (errors) {
                Object.keys(errors).forEach((key) => {
                    profileForm.setError(key as any, { message: errors[key][0] });
                });
            } else {
                toast.error(message);
            }
        }
    };

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (file.size > 2 * 1024 * 1024) {
            toast.error('يجب أن يكون حجم الصورة أقل من 2 ميجابايت');
            return;
        }

        try {
            await updateProfile.mutateAsync({ avatar: file });
            await fetchUser();
            toast.success('تم تحديث الصورة الشخصية بنجاح');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'فشل تحديث الصورة الشخصية');
        }
    };

    const onPasswordSubmit = async (data: PasswordFormData) => {
        try {
            await changePassword.mutateAsync(data);
            passwordForm.reset();
            toast.success('تم تغيير كلمة المرور بنجاح');
        } catch (error: any) {
            const message = error.response?.data?.message || 'فشل تغيير كلمة المرور';
            const errors = error.response?.data?.errors;

            if (errors) {
                Object.keys(errors).forEach((key) => {
                    // Map backend error keys to form fields
                    if (key === 'password') {
                        passwordForm.setError('new_password', { message: errors[key][0] });
                    } else if (key === 'current_password') {
                        passwordForm.setError('current_password', { message: errors[key][0] });
                    } else {
                        passwordForm.setError(key as any, { message: errors[key][0] });
                    }
                });
            }
            toast.error(message);
        }
    };

    const handle2FAToggle = async () => {
        try {
            await toggle2FA.mutateAsync({ enable: !user?.two_factor_enabled });
            await fetchUser();
            toast.success(user?.two_factor_enabled ? 'تم تعطيل المصادقة الثنائية' : 'تم تفعيل المصادقة الثنائية');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'فشل تغيير إعدادات المصادقة الثنائية');
        }
    };

    return (
        <div className="animate-fade-in max-w-4xl text-right">
            <div className="mb-8">
                <h1 className="font-display text-3xl font-bold mb-2">إعدادات الملف الشخصي</h1>
                <p className="text-muted-foreground">
                    إدارة إعدادات الحساب وتفضيلاتك
                </p>
            </div>

            <div className="space-y-8">
                {/* Avatar Section */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-6 flex-row-reverse">
                            <div className="relative">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={user?.avatar_url || user?.avatar} />
                                    <AvatarFallback className="text-2xl">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <button
                                    className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Camera className="h-4 w-4" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                />
                            </div>
                            <div className="text-right flex-1">
                                <h2 className="font-display text-xl font-semibold">{user?.name}</h2>
                                <p className="text-muted-foreground">{user?.email}</p>
                                <p className="text-sm text-muted-foreground capitalize">{user?.role} Account</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Profile Info */}
                <Card>
                    <CardHeader className="text-right">
                        <CardTitle>المعلومات الشخصية</CardTitle>
                        <CardDescription>تحديث بياناتك الشخصية</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">الاسم الكامل</Label>
                                    <div className="relative">
                                        <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="name"
                                            className="pr-10 text-right"
                                            {...profileForm.register('name')}
                                        />
                                    </div>
                                    {profileForm.formState.errors.name && (
                                        <p className="text-sm text-destructive">
                                            {profileForm.formState.errors.name.message}
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
                                            className="pr-10 text-right"
                                            {...profileForm.register('email')}
                                        />
                                    </div>
                                    {profileForm.formState.errors.email && (
                                        <p className="text-sm text-destructive">
                                            {profileForm.formState.errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="phone">رقم الهاتف</Label>
                                    <div className="relative">
                                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            type="tel"
                                            className="pr-10 text-right"
                                            dir="ltr"
                                            {...profileForm.register('phone')}
                                        />
                                    </div>
                                    {profileForm.formState.errors.phone && (
                                        <p className="text-sm text-destructive">
                                            {profileForm.formState.errors.phone.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <Button type="submit" disabled={updateProfile.isPending} className="w-full sm:w-auto">
                                {updateProfile.isPending ? (
                                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                                ) : (
                                    <Check className="h-4 w-4 ml-2" />
                                )}
                                حفظ التغييرات
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Security */}
                <Card>
                    <CardHeader className="text-right">
                        <CardTitle>الأمان</CardTitle>
                        <CardDescription>إدارة كلمة المرور وإعدادات الأمان</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* 2FA Toggle */}
                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl flex-row-reverse">
                            <div className="flex items-center gap-4 flex-row-reverse">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Shield className="h-5 w-5 text-primary" />
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">المصادقة الثنائية (2FA)</p>
                                    <p className="text-sm text-muted-foreground">
                                        إضافة طبقة حماية إضافية لحسابك
                                    </p>
                                </div>
                            </div>
                            <Switch
                                checked={user?.two_factor_enabled || false}
                                onCheckedChange={handle2FAToggle}
                                disabled={toggle2FA.isPending}
                            />
                        </div>

                        <Separator />

                        {/* Change Password */}
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                            <h3 className="font-semibold text-right">تغيير كلمة المرور</h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>كلمة المرور الحالية</Label>
                                    <div className="relative">
                                        <Input
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            className="text-right pr-3 pl-10"
                                            dir="ltr"
                                            {...passwordForm.register('current_password')}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {passwordForm.formState.errors.current_password && (
                                        <p className="text-sm text-destructive text-right">
                                            {passwordForm.formState.errors.current_password.message}
                                        </p>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>كلمة المرور الجديدة</Label>
                                        <div className="relative">
                                            <Input
                                                type={showNewPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                className="text-right pr-3 pl-10"
                                                dir="ltr"
                                                {...passwordForm.register('new_password')}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {passwordForm.formState.errors.new_password && (
                                            <p className="text-sm text-destructive text-right">
                                                {passwordForm.formState.errors.new_password.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>تأكيد كلمة المرور الجديدة</Label>
                                        <Input
                                            type={showNewPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            className="text-right"
                                            dir="ltr"
                                            {...passwordForm.register('new_password_confirmation')}
                                        />
                                        {passwordForm.formState.errors.new_password_confirmation && (
                                            <p className="text-sm text-destructive text-right">
                                                {passwordForm.formState.errors.new_password_confirmation.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" disabled={changePassword.isPending} className="w-full sm:w-auto">
                                {changePassword.isPending ? (
                                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                                ) : (
                                    <Check className="h-4 w-4 ml-2" />
                                )}
                                تحديث كلمة المرور
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
