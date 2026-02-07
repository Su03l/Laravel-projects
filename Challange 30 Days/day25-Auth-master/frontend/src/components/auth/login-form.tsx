"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authService } from "@/services/authService"
import { useAuthStore } from "@/store/useAuthStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Lock, Mail } from "lucide-react"
import { OtpInput } from "@/components/ui/otp-input"

const loginSchema = z.object({
    email: z.string().email({ message: "البريد الإلكتروني غير صحيح" }),
    password: z.string().min(1, { message: "كلمة المرور مطلوبة" }),
    remember: z.boolean().default(false).optional(),
})

const verifySchema = z.object({
    otp_code: z.string().min(6, { message: "الرمز لازم يكون 6 أرقام" }),
})

export function LoginForm() {
    const router = useRouter()
    const { login } = useAuthStore()
    const [isLoading, setIsLoading] = useState(false)
    const [requires2FA, setRequires2FA] = useState(false)
    const [emailFor2FA, setEmailFor2FA] = useState("")

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        },
    })

    const verifyForm = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            otp_code: "",
        },
    })

    async function onLoginSubmit(data: z.infer<typeof loginSchema>) {
        setIsLoading(true)
        try {
            const response = await authService.login(data)

            if (response.status === '2fa_required') {
                setRequires2FA(true)
                setEmailFor2FA(response.email || data.email)
                toast.info("مطلوب التحقق الثنائي")
            } else if (response.token && response.user) {
                login(response.user, response.token)
                toast.success("تم تسجيل الدخول بنجاح")
                router.push("/dashboard")
            }
        } catch (error: any) {
            console.error(error)
            toast.error("فشل تسجيل الدخول، تأكد من البيانات")
        } finally {
            setIsLoading(false)
        }
    }

    async function onVerifySubmit(data: z.infer<typeof verifySchema>) {
        setIsLoading(true)
        try {
            const response = await authService.verifyLoginOtp({
                email: emailFor2FA,
                otp_code: data.otp_code,
            })

            if (response.token && response.user) {
                login(response.user, response.token)
                toast.success("تم التحقق بنجاح")
                router.push("/dashboard")
            }
        } catch (error) {
            console.error(error)
            toast.error("الرمز غلط أو انتهى")
        } finally {
            setIsLoading(false)
        }
    }

    if (requires2FA) {
        return (
            <Card className="w-full border-0 shadow-2xl bg-white/80 backdrop-blur-xl ring-1 ring-white/60">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                        التحقق الثنائي
                    </CardTitle>
                    <CardDescription className="text-base text-slate-600 mt-2">
                        أدخل الكود الذي وصلك على الإيميل
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={verifyForm.handleSubmit(onVerifySubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="otp_code">كود التحقق (OTP)</Label>
                            <div className="flex justify-center py-2">
                                <OtpInput
                                    value={verifyForm.watch('otp_code')}
                                    onChange={(val) => verifyForm.setValue('otp_code', val)}
                                />
                            </div>
                            {verifyForm.formState.errors.otp_code && (
                                <p className="text-sm font-medium text-destructive text-center">
                                    {verifyForm.formState.errors.otp_code.message}
                                </p>
                            )}
                        </div>
                        <Button type="submit" className="w-full text-lg h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-blue-500/25" isLoading={isLoading}>
                            تأكيد الدخول
                        </Button>
                    </form>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full border-0 shadow-2xl bg-white/80 backdrop-blur-xl ring-1 ring-white/60">
            <CardHeader className="text-center pb-2">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                    تسجيل الدخول
                </CardTitle>
                <CardDescription className="text-base text-slate-600 mt-2">
                    مرحباً بك مجدداً، أدخل بياناتك للدخول
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            startIcon={<Mail className="h-4 w-4" />}
                            {...loginForm.register("email")}
                            error={loginForm.formState.errors.email?.message}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">كلمة المرور</Label>
                            <a href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                نسيت الباسورد؟
                            </a>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            startIcon={<Lock className="h-4 w-4" />}
                            {...loginForm.register("password")}
                            error={loginForm.formState.errors.password?.message}
                        />
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                        <input
                            type="checkbox"
                            id="remember"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                            {...loginForm.register("remember")}
                        />
                        <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">تذكرني</Label>
                    </div>
                    <Button type="submit" className="w-full text-lg h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-blue-500/25" isLoading={isLoading}>
                        دخول
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center">
                <p className="text-sm text-muted-foreground">
                    ليس لديك حساب؟ <a href="/register" className="font-semibold text-blue-600 hover:underline">سجل حساب جديد</a>
                </p>
            </CardFooter>
        </Card>
    )
}
