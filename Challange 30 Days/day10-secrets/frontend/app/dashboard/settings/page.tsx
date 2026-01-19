'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/context/toast-context';
import { UpdateProfileData, ChangePasswordData, ApiError } from '@/types';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { User, Lock, Check } from 'lucide-react';
import axios from 'axios';

type TabType = 'profile' | 'security';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<TabType>('profile');
    const { user } = useAuth();

    const tabs = [
        { id: 'profile' as const, name: 'تعديل الملف الشخصي', icon: User },
        { id: 'security' as const, name: 'الأمان', icon: Lock },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-neutral-900">الإعدادات</h1>
                <p className="text-neutral-500 mt-1">إدارة تفضيلات حسابك</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-neutral-100 rounded-xl w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
              transition-all duration-200
              ${activeTab === tab.id
                                ? 'bg-white text-neutral-900 shadow-sm'
                                : 'text-neutral-600 hover:text-neutral-900'
                            }
            `}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'profile' && user && <ProfileTab user={user} />}
            {activeTab === 'security' && <SecurityTab />}
        </div>
    );
}

function ProfileTab({ user }: { user: { name: string; username: string; email: string } }) {
    const [isLoading, setIsLoading] = useState(false);
    const { updateProfile } = useAuth();
    const { showSuccess, showError } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UpdateProfileData>({
        defaultValues: {
            name: user.name,
            username: user.username,
            email: user.email,
        },
    });

    const onSubmit = async (data: UpdateProfileData) => {
        setIsLoading(true);
        try {
            await updateProfile(data);
            showSuccess('تم تحديث الملف الشخصي بنجاح!');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const apiError = error.response?.data as ApiError;
                if (apiError?.errors) {
                    const firstError = Object.values(apiError.errors)[0]?.[0];
                    showError(firstError || 'فشل التحديث.');
                } else {
                    showError(apiError?.message || 'فشل تحديث الملف الشخصي.');
                }
            } else {
                showError('حدث خطأ غير متوقع.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>معلومات الملف الشخصي</CardTitle>
                <CardDescription>تحديث بياناتك الشخصية</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg">
                    <Input
                        id="name"
                        label="الاسم الكامل"
                        type="text"
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
                        error={errors.username?.message}
                        {...register('username', {
                            required: 'اسم المستخدم مطلوب',
                            minLength: { value: 3, message: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' },
                            pattern: {
                                value: /^[a-zA-Z0-9_]+$/,
                                message: 'اسم المستخدم يمكن أن يحتوي على أحرف وأرقام و _',
                            },
                        })}
                    />

                    <Input
                        id="email"
                        label="البريد الإلكتروني"
                        type="email"
                        error={errors.email?.message}
                        {...register('email', {
                            required: 'البريد الإلكتروني مطلوب',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'بريد إلكتروني غير صالح',
                            },
                        })}
                    />

                    <Button type="submit" isLoading={isLoading}>
                        <Check className="w-4 h-4 ml-2" />
                        حفظ التغييرات
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

function SecurityTab() {
    const [isLoading, setIsLoading] = useState(false);
    const { changePassword } = useAuth();
    const { showSuccess, showError } = useToast();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordData>();

    const newPassword = watch('new_password');

    const onSubmit = async (data: ChangePasswordData) => {
        setIsLoading(true);
        try {
            await changePassword(data);
            showSuccess('تم تغيير كلمة المرور بنجاح!');
            reset();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const apiError = error.response?.data as ApiError;
                if (apiError?.errors) {
                    const firstError = Object.values(apiError.errors)[0]?.[0];
                    showError(firstError || 'فشل تغيير كلمة المرور.');
                } else {
                    showError(apiError?.message || 'فشل تغيير كلمة المرور.');
                }
            } else {
                showError('حدث خطأ غير متوقع.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>تغيير كلمة المرور</CardTitle>
                <CardDescription>حدّث كلمة مرورك للحفاظ على أمان حسابك</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg">
                    <PasswordInput
                        id="current_password"
                        label="كلمة المرور الحالية"
                        placeholder="أدخل كلمة المرور الحالية"
                        error={errors.current_password?.message}
                        {...register('current_password', {
                            required: 'كلمة المرور الحالية مطلوبة',
                        })}
                    />

                    <PasswordInput
                        id="new_password"
                        label="كلمة المرور الجديدة"
                        placeholder="أدخل كلمة المرور الجديدة"
                        error={errors.new_password?.message}
                        {...register('new_password', {
                            required: 'كلمة المرور الجديدة مطلوبة',
                            minLength: { value: 8, message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' },
                        })}
                    />

                    <PasswordInput
                        id="new_password_confirmation"
                        label="تأكيد كلمة المرور الجديدة"
                        placeholder="أكد كلمة المرور الجديدة"
                        error={errors.new_password_confirmation?.message}
                        {...register('new_password_confirmation', {
                            required: 'يرجى تأكيد كلمة المرور الجديدة',
                            validate: (value) => value === newPassword || 'كلمات المرور غير متطابقة',
                        })}
                    />

                    <Button type="submit" isLoading={isLoading}>
                        <Lock className="w-4 h-4 ml-2" />
                        تحديث كلمة المرور
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
