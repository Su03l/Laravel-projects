"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { useAuthStore } from "@/store/useAuthStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import api from "@/services/api"
import { User, Phone, Save, Shield, KeyRound, Loader2, UploadCloud } from "lucide-react"
import Image from "next/image"

const profileSchema = z.object({
    name: z.string().min(2, "الاسم لازم يكون حرفين على الأقل"),
    phone: z.string().min(10, "رقم الجوال لازم يكون 10 أرقام").optional().or(z.literal("")),
})

const passwordSchema = z.object({
    current_password: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
    password: z.string().min(8, "كلمة المرور الجديدة لازم تكون 8 خانات"),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: "كلمات المرور غير متطابقة",
    path: ["password_confirmation"],
})

export default function ProfilePage() {
    const { user, updateUser } = useAuthStore()
    const [isLoading, setIsLoading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    const profileForm = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || "",
            phone: user?.phone || "",
        },
    })

    const passwordForm = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            current_password: "",
            password: "",
            password_confirmation: "",
        },
    })

    async function onProfileSubmit(data: z.infer<typeof profileSchema>) {
        setIsLoading(true)
        try {
            const response = await api.post('/profile/update', data)
            updateUser(response.data.data || response.data)
            toast.success("تم تحديث الملف الشخصي بنجاح")
        } catch (error: any) {
            toast.error(error.response?.data?.message || "فشل تحديث البيانات")
        } finally {
            setIsLoading(false)
        }
    }

    async function onPasswordSubmit(data: z.infer<typeof passwordSchema>) {
        setIsLoading(true)
        try {
            await api.post('/profile/change-password', data)
            toast.success("تم تغيير كلمة المرور بنجاح")
            passwordForm.reset()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "فشل تغيير كلمة المرور")
        } finally {
            setIsLoading(false)
        }
    }

    async function toggle2FA() {
        try {
            const shouldEnable = !user?.two_factor_enabled;
            const response = await api.post('/profile/2fa', { enable: shouldEnable })
            updateUser({ ...user!, two_factor_enabled: shouldEnable })
            toast.success(shouldEnable ? "تم تفعيل التحقق الثنائي" : "تم تعطيل التحقق الثنائي")
        } catch (e) {
            console.error(e)
            toast.error("فشل تحديث إعدادات الأمان")
        }
    }

    async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files?.[0]) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('avatar', file);
        formData.append('name', user?.name || "");
        if (user?.phone) formData.append('phone', user.phone);

        setIsUploading(true);
        try {
            const res = await api.post('/profile/update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            updateUser(res.data.data || res.data);
            toast.success("تم تحديث الصورة الرمزية");
        } catch (e) {
            toast.error("فشل رفع الصورة")
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pt-20 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        إعدادات الملف الشخصي
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        تحكم في بيانات حسابك وإعدادات الأمان من هنا
                    </p>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-12">
                {/* Right Column: Avatar & Personal Info (RTL: First visual column) */}
                <div className="md:col-span-12 lg:col-span-7 space-y-8">
                    <Card className="border-0 shadow-2xl bg-white/70 backdrop-blur-xl ring-1 ring-white/50">
                        <CardHeader>
                            <CardTitle className="text-2xl text-right bg-transparent text-foreground">المعلومات الشخصية</CardTitle>
                            <CardDescription className="text-right">
                                تحديث صورتك وبياناتك الأساسية
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 p-1 shadow-lg relative group">
                                    <div className="h-full w-full rounded-full bg-white overflow-hidden flex items-center justify-center relative">
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        ) : (
                                            <span className="text-3xl font-bold text-blue-600">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                        {isUploading && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <Loader2 className="h-8 w-8 text-white animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    <label htmlFor="avatar" className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-colors hover:scale-105 active:scale-95">
                                        <UploadCloud className="h-4 w-4" />
                                        <input
                                            id="avatar"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleAvatarUpload}
                                            disabled={isUploading}
                                        />
                                    </label>
                                </div>
                                <div className="text-center sm:text-right space-y-1">
                                    <h3 className="font-semibold text-lg text-foreground">الصورة الشخصية</h3>
                                    <p className="text-sm text-muted-foreground">
                                        بيتم عرضها في ملفك الشخصي والتعليقات
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">الاسم الكامل</Label>
                                        <Input
                                            id="name"
                                            startIcon={<User className="h-4 w-4" />}
                                            {...profileForm.register("name")}
                                            error={profileForm.formState.errors.name?.message}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">رقم الجوال</Label>
                                        <Input
                                            id="phone"
                                            startIcon={<Phone className="h-4 w-4" />}
                                            {...profileForm.register("phone")}
                                            error={profileForm.formState.errors.phone?.message}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto min-w-[150px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/25">
                                        <Save className="ml-2 h-4 w-4" />
                                        حفظ التغييرات
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Left Column: Security (RTL: Second visual column) */}
                <div className="md:col-span-12 lg:col-span-5 space-y-8">
                    <Card className="border-0 shadow-2xl bg-white/70 backdrop-blur-xl ring-1 ring-white/50 h-full">
                        <CardHeader>
                            <CardTitle className="text-2xl text-right bg-transparent text-foreground">إعدادات الأمان</CardTitle>
                            <CardDescription className="text-right">
                                تغيير كلمة المرور والتحقق الثنائي
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {/* 2FA Toggle */}
                            <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100/50 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                            <Shield className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-foreground">التحقق الثنائي (2FA)</h3>
                                            <p className="text-xs text-muted-foreground">أمان إضافي لحسابك</p>
                                        </div>
                                    </div>
                                    <div className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${user?.two_factor_enabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                        onClick={toggle2FA}
                                    >
                                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${user?.two_factor_enabled ? '-translate-x-5' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                            </div>

                            {/* Password Form */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 text-primary border-b border-border/50">
                                    <KeyRound className="h-5 w-5" />
                                    <h3 className="font-medium">تغيير كلمة المرور</h3>
                                </div>
                                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="current_password">كلمة المرور الحالية</Label>
                                        <Input id="current_password" type="password" {...passwordForm.register("current_password")} error={passwordForm.formState.errors.current_password?.message} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new_password">كلمة المرور الجديدة</Label>
                                        <Input id="new_password" type="password" {...passwordForm.register("password")} error={passwordForm.formState.errors.password?.message} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">تأكيد كلمة المرور الجديدة</Label>
                                        <Input id="password_confirmation" type="password" {...passwordForm.register("password_confirmation")} error={passwordForm.formState.errors.password_confirmation?.message} />
                                    </div>
                                    <Button type="submit" isLoading={isLoading} variant="outline" className="w-full hover:bg-slate-100">
                                        تحديث كلمة المرور
                                    </Button>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
