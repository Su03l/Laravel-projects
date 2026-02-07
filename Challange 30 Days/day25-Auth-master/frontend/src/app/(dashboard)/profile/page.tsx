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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import api from "@/services/api"
import { User, Phone, Save, Shield, KeyRound, Loader2, UploadCloud, LogOut, Settings, Mail, BadgeCheck } from "lucide-react"

const profileSchema = z.object({
    name: z.string().min(2, "الاسم لازم يكون حرفين على الأقل"),
    phone: z.string().min(10, "رقم الجوال لازم يكون 10 أرقام").optional().or(z.literal("")),
})

const passwordSchema = z.object({
    password: z.string().min(8, "كلمة المرور الجديدة لازم تكون 8 خانات"),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: "كلمات المرور غير متطابقة",
    path: ["password_confirmation"],
})

export default function ProfilePage() {
    const { user, updateUser, logout } = useAuthStore()
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

    const [passwordStep, setPasswordStep] = useState<'email' | 'otp' | 'new_password'>('email')
    const [resetEmail, setResetEmail] = useState(user?.email || "")
    const [otpCode, setOtpCode] = useState("")

    // Update email state if user loads later
    if (user?.email && !resetEmail) {
        setResetEmail(user.email)
    }

    async function handleSendCode() {
        if (!resetEmail || !/\S+@\S+\.\S+/.test(resetEmail)) {
            toast.error("الرجاء إدخال بريد إلكتروني صحيح")
            return
        }
        setIsLoading(true)
        try {
            // Using passwordService defined in components/auth/forgot-password-form
            await api.post('/auth/forgot-password', { email: resetEmail })
            toast.success("تم إرسال رمز التحقق إلى بريدك الإلكتروني")
            setPasswordStep('otp')
        } catch (error: any) {
            toast.error(error.response?.data?.message || "فشل إرسال الرمز")
        } finally {
            setIsLoading(false)
        }
    }

    function handleVerifyCode() {
        if (otpCode.length < 6) {
            toast.error("الرمز يجب أن يكون 6 أرقام")
            return
        }
        // Client-side validation only as requested, real check happens at reset
        setPasswordStep('new_password')
    }

    async function onResetPasswordSubmit(data: z.infer<typeof passwordSchema>) {
        setIsLoading(true)
        try {
            await api.post('/auth/reset-password', {
                email: resetEmail,
                token: otpCode, // Backend expects 'token' usually, or 'otp_code'
                password: data.password,
                password_confirmation: data.password_confirmation
            })
            toast.success("تم تغيير كلمة المرور بنجاح")
            setPasswordStep('email')
            setOtpCode("")
            passwordForm.reset()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "فشل تغيير كلمة المرور، تأكد من الرمز")
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

    const handleLogout = async () => {
        if (!confirm("هل أنت متأكد من تسجيل الخروج؟")) return;
        try {
            await logout()
            toast.success("تم تسجيل الخروج بنجاح")
        } catch (e) {
            toast.error("حدث خطأ أثناء تسجيل الخروج")
        }
    }

    return (
        <div className="space-y-6 pt-20 pb-10 animate-in fade-in duration-500">
            {/* Header Card - Read Only & Taller */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden relative">
                <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                </div>
                <div className="px-6 pb-8">
                    <div className="relative -mt-20 flex flex-col items-center">
                        <div className="h-40 w-40 rounded-full bg-white p-1.5 shadow-2xl ring-4 ring-white/50 mb-4 z-10">
                            <div className="h-full w-full rounded-full overflow-hidden bg-slate-100 flex items-center justify-center relative">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                                ) : (
                                    <span className="text-6xl font-bold text-blue-600">{user?.name?.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                        </div>

                        <div className="text-center space-y-2 max-w-2xl mx-auto">
                            <div className="flex flex-col items-center gap-2">
                                <h1 className="text-4xl font-bold text-slate-900">{user?.name}</h1>
                                <span className={`px-4 py-1 rounded-full text-sm font-medium border ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>
                                    {user?.role === 'admin' ? 'مسؤول النظام' : user?.role === 'employee' ? 'موظف' : 'مستخدم'}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mt-4">
                                <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                                    <Mail className="h-4 w-4" />
                                    {user?.email}
                                </div>
                                {user?.phone && (
                                    <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                                        <Phone className="h-4 w-4" />
                                        {user.phone}
                                    </div>
                                )}
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${user?.email_verified_at ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                                    <BadgeCheck className="h-4 w-4" />
                                    {user?.email_verified_at ? 'حساب موثق' : 'غير موثق'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Interface */}
            <div className="max-w-4xl mx-auto">
                <Tabs defaultValue="profile" className="w-full" dir="rtl">
                    <TabsList className="grid w-full grid-cols-4 h-12 bg-white/50 p-1 backdrop-blur-sm shadow-sm rounded-xl">
                        <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">تعديل الملف</TabsTrigger>
                        <TabsTrigger value="password" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">كلمة المرور</TabsTrigger>
                        <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">الإعدادات</TabsTrigger>
                        <div className="px-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full h-full text-red-600 hover:text-red-700 hover:bg-red-50 gap-2 font-medium rounded-lg"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">خروج</span>
                            </Button>
                        </div>
                    </TabsList>

                    <TabsContent value="profile" className="mt-6 animate-in slide-in-from-bottom-4 duration-500">
                        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-xl ring-1 ring-slate-100">
                            <CardHeader>
                                <CardTitle className="text-lg">البيانات الأساسية</CardTitle>
                                <CardDescription>قم بتحديث اسمك ورقم هاتفك</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-5 mb-8 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                    <div className="relative group shrink-0">
                                        <div className="h-16 w-16 rounded-full overflow-hidden bg-white ring-2 ring-slate-200 shadow-sm">
                                            {user?.avatar ? (
                                                <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-400">
                                                    <User className="h-8 w-8" />
                                                </div>
                                            )}
                                            {isUploading && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                                                </div>
                                            )}
                                        </div>
                                        <label className="absolute -bottom-1 -right-1 bg-white text-slate-700 border border-slate-200 p-1.5 rounded-full shadow-sm cursor-pointer hover:bg-slate-50 transition-all">
                                            <UploadCloud className="h-3.5 w-3.5" />
                                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploading} />
                                        </label>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-slate-900">الصورة الشخصية</h4>
                                        <p className="text-xs text-muted-foreground mt-1">اضغط لتغيير الصورة (يفضل 1:1).</p>
                                    </div>
                                </div>

                                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
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
                                    <Button type="submit" isLoading={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]">
                                        <Save className="ml-2 h-4 w-4" />
                                        حفظ التغييرات
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="password" className="mt-6">
                        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-xl ring-1 ring-white/50">
                            <CardHeader>
                                <CardTitle>تغيير كلمة المرور</CardTitle>
                                <CardDescription>
                                    {passwordStep === 'email' && "أدخل بريدك الإلكتروني لاستلام رمز التحقق"}
                                    {passwordStep === 'otp' && "تم إرسال الرمز إلى بريدك الإلكتروني"}
                                    {passwordStep === 'new_password' && "عين كلمة المرور الجديدة"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {passwordStep === 'email' && (
                                    <div className="space-y-4 max-w-lg">
                                        <div className="space-y-2">
                                            <Label htmlFor="reset-email">البريد الإلكتروني</Label>
                                            <Input
                                                id="reset-email"
                                                value={resetEmail}
                                                onChange={(e) => setResetEmail(e.target.value)}
                                                placeholder="name@example.com"
                                                dir="ltr"
                                            />
                                        </div>
                                        <Button onClick={handleSendCode} isLoading={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
                                            <Mail className="ml-2 h-4 w-4" />
                                            إرسال رمز التحقق
                                        </Button>
                                    </div>
                                )}

                                {passwordStep === 'otp' && (
                                    <div className="space-y-4 max-w-lg">
                                        <div className="space-y-2">
                                            <Label>رمز التحقق</Label>
                                            <div className="flex justify-center" dir="ltr">
                                                <Input
                                                    value={otpCode}
                                                    onChange={(e) => setOtpCode(e.target.value)}
                                                    className="tracking-[1em] text-center text-lg font-bold uppercase"
                                                    maxLength={6}
                                                    placeholder="XXXXXX"
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground text-center">أدخل الرمز المكون من 6 أرقام</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>تأكيد البريد الإلكتروني</Label>
                                            <Input value={resetEmail} readOnly disabled className="bg-slate-50" dir="ltr" />
                                        </div>
                                        <Button onClick={handleVerifyCode} className="w-full bg-indigo-600 hover:bg-indigo-700">
                                            تحقق ومتابعة
                                        </Button>
                                        <Button variant="ghost" onClick={() => setPasswordStep('email')} className="w-full">
                                            تغيير البريد الإلكتروني
                                        </Button>
                                    </div>
                                )}

                                {passwordStep === 'new_password' && (
                                    <form onSubmit={passwordForm.handleSubmit(onResetPasswordSubmit)} className="space-y-4 max-w-lg">
                                        <div className="space-y-2">
                                            <Label htmlFor="new_password">كلمة المرور الجديدة</Label>
                                            <Input id="new_password" type="password" {...passwordForm.register("password")} error={passwordForm.formState.errors.password?.message} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password_confirmation">تأكيد كلمة المرور</Label>
                                            <Input id="password_confirmation" type="password" {...passwordForm.register("password_confirmation")} error={passwordForm.formState.errors.password_confirmation?.message} />
                                        </div>
                                        <Button type="submit" isLoading={isLoading} className="w-full bg-green-600 hover:bg-green-700">
                                            <KeyRound className="ml-2 h-4 w-4" />
                                            تغيير كلمة المرور
                                        </Button>
                                        <Button variant="ghost" type="button" onClick={() => setPasswordStep('otp')} className="w-full">
                                            العودة
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="settings" className="mt-6 space-y-6">
                        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-xl ring-1 ring-white/50">
                            <CardHeader>
                                <CardTitle>التحقق بخطوتين (2FA)</CardTitle>
                                <CardDescription>تعزيز أمان حسابك عن طريق رمز إضافي عند الدخول</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-full ${user?.two_factor_enabled ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                                            <Shield className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm">
                                                {user?.two_factor_enabled ? 'الميزة مفعلة حالياً' : 'الميزة غير مفعلة'}
                                            </h4>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                سيتم طلب رمز تحقق عبر البريد الإلكتروني عند تسجيل الدخول من جهاز جديد.
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${user?.two_factor_enabled ? 'bg-green-500' : 'bg-slate-300'}`}
                                        onClick={toggle2FA}
                                    >
                                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${user?.two_factor_enabled ? '-translate-x-5' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-xl ring-1 ring-white/50">
                            <CardHeader>
                                <CardTitle>إشعارات النظام</CardTitle>
                                <CardDescription>تخصيص الإشعارات التي تصلك</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                                    <Settings className="h-12 w-12 mb-4 opacity-20" />
                                    <h3 className="text-lg font-medium text-slate-900">قريباً...</h3>
                                    <p>المزيد من خيارات التخصيص ستتوفر هنا</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
