"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { passwordService } from "@/services/passwordService"
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
import { Lock, Mail, KeyRound } from "lucide-react"

const schema = z.object({
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    otp_code: z.string().min(1, "كود الاستعادة مطلوب"),
    password: z.string().min(8, "كلمة المرور لازم تكون 8 خانات على الأقل"),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: "كلمات المرور غير متطابقة",
    path: ["password_confirmation"],
})

export function ResetPasswordForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: searchParams.get("email") || "",
            otp_code: "",
            password: "",
            password_confirmation: "",
        },
    })

    async function onSubmit(data: z.infer<typeof schema>) {
        setIsLoading(true)
        try {
            await passwordService.resetPassword(data)
            toast.success("تم تغيير الباسورد بنجاح! سجل دخولك الآن.")
            router.push("/login")
        } catch (e) {
            toast.error("حدث خطأ، تأكد من الكود وحاول مرة ثانية")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full border-0 shadow-2xl bg-white/80 backdrop-blur-xl ring-1 ring-white/60">
            <CardHeader className="text-center pb-2">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                    تغيير كلمة المرور
                </CardTitle>
                <CardDescription className="text-base text-slate-600 mt-2">
                    أدخل الكود المرسل إليك وكلمة المرور الجديدة
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                        <Label htmlFor="otp_code">كود الاستعادة</Label>
                        <Input
                            id="otp_code"
                            className="tracking-widest"
                            startIcon={<KeyRound className="h-4 w-4" />}
                            {...form.register("otp_code")}
                            error={form.formState.errors.otp_code?.message}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">كلمة المرور الجديدة</Label>
                        <Input
                            id="password"
                            type="password"
                            startIcon={<Lock className="h-4 w-4" />}
                            {...form.register("password")}
                            error={form.formState.errors.password?.message}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation">تأكيد كلمة المرور</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            startIcon={<Lock className="h-4 w-4" />}
                            {...form.register("password_confirmation")}
                            error={form.formState.errors.password_confirmation?.message}
                        />
                    </div>
                    <Button type="submit" className="w-full text-lg h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-blue-500/25" isLoading={isLoading}>
                        تغيير الباسورد
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
