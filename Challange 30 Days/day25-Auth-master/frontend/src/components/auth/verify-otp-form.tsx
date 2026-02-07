"use client"

import { useState, useEffect } from "react"
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
import { Mail, KeyRound } from "lucide-react"

const verifySchema = z.object({
    email: z.string().email(),
    otp: z.string().min(6, "الكود لازم يكون 6 أرقام"),
})

export function VerifyOtpForm() {
    const router = useRouter()
    const { login } = useAuthStore()
    const [isLoading, setIsLoading] = useState(false)

    // We try to get email from localStorage if available
    const [prefilledEmail, setPrefilledEmail] = useState("")

    useEffect(() => {
        const stored = localStorage.getItem('verification_email')
        if (stored) setPrefilledEmail(stored)
    }, [])

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            email: prefilledEmail,
            otp: "",
        },
    })

    // Update default value when effect runs
    useEffect(() => {
        if (prefilledEmail) {
            form.setValue('email', prefilledEmail);
        }
    }, [prefilledEmail, form])


    async function onSubmit(data: z.infer<typeof verifySchema>) {
        setIsLoading(true)
        try {
            const response = await authService.verifyOtp({
                email: data.email,
                otp_code: data.otp,
            })
            if (response.token && response.user) {
                login(response.user, response.token)
                toast.success("تم تفعيل الحساب بنجاح! حياك الله.")
                localStorage.removeItem('verification_email')
                router.push("/profile") // Redirect to dashboard/profile
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                // handle validation errors
            }
            toast.error("الكود غلط أو انتهى وقته")
        } finally {
            setIsLoading(false)
        }
    }

    async function onResend() {
        const email = form.getValues('email');
        if (!email) {
            toast.error("اكتب الإيميل عشان نرسل لك الكود مرة ثانية");
            return;
        }
        try {
            await authService.resendOtp(email);
            toast.success("تم إعادة إرسال الكود");
        } catch (e) {
            // error handled by api
        }
    }

    return (
        <Card className="w-full border-0 shadow-xl bg-white/80 backdrop-blur-md ring-1 ring-white/50">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    تفعيل الحساب
                </CardTitle>
                <CardDescription className="text-lg">
                    وصلك كود على الإيميل، اكتبه هنا عشان نتأكد
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <Input
                            id="email"
                            type="email"
                            startIcon={<Mail className="h-4 w-4" />}
                            {...form.register("email")}
                            error={form.formState.errors.email?.message}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="otp">كود التفعيل</Label>
                        <Input
                            id="otp"
                            placeholder="123456"
                            className="text-center text-lg tracking-widest"
                            startIcon={<KeyRound className="h-4 w-4" />}
                            {...form.register("otp")}
                            error={form.formState.errors.otp?.message}
                        />
                    </div>
                    <Button type="submit" className="w-full text-lg h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-blue-500/25" isLoading={isLoading}>
                        تفعيل
                    </Button>
                </form>
                <div className="mt-6 text-center">
                    <Button variant="link" onClick={onResend} type="button" className="text-sm text-muted-foreground hover:text-blue-600">
                        ما وصلك الكود؟ أعد الإرسال
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
