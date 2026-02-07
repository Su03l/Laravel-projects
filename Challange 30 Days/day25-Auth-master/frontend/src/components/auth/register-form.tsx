"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authService } from "@/services/authService"
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
import Link from "next/link"
import { User, Mail, Phone, Lock } from "lucide-react"

const registerSchema = z.object({
    name: z.string().min(2, "الاسم لازم يكون حرفين على الأقل"),
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    phone: z.string().min(10, "رقم الجوال لازم يكون 10 أرقام على الأقل"),
    password: z.string().min(8, "كلمة المرور لازم تكون 8 خانات على الأقل"),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: "كلمات المرور غير متطابقة",
    path: ["password_confirmation"],
})

export function RegisterForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            password_confirmation: "",
        },
    })

    async function onSubmit(data: z.infer<typeof registerSchema>) {
        setIsLoading(true)
        try {
            await authService.register(data)
            toast.success("تم إنشاء الحساب بنجاح! يرجى تفعيل بريدك الإلكتروني.")
            localStorage.setItem('verification_email', data.email);
            router.push("/verify-otp")
        } catch (error: any) {
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                Object.keys(errors).forEach((key) => {
                    form.setError(key as any, { message: errors[key][0] });
                });
            } else {
                toast.error("حدث خطأ ما، حاول مرة أخرى")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full border-0 shadow-2xl bg-white/80 backdrop-blur-xl ring-1 ring-white/60">
            <CardHeader className="text-center pb-2">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                    إنشاء حساب جديد
                </CardTitle>
                <CardDescription className="text-base text-slate-600 mt-2">
                    سجل بياناتك عشان تبدأ معنا
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="name">الاسم الكامل</Label>
                        <Input
                            id="name"
                            placeholder="مثال: محمد أحمد"
                            startIcon={<User className="h-4 w-4" />}
                            {...form.register("name")}
                            error={form.formState.errors.name?.message}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            startIcon={<Mail className="h-4 w-4" />}
                            {...form.register("email")}
                            error={form.formState.errors.email?.message}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">رقم الجوال</Label>
                        <Input
                            id="phone"
                            placeholder="05xxxxxxxx"
                            startIcon={<Phone className="h-4 w-4" />}
                            {...form.register("phone")}
                            error={form.formState.errors.phone?.message}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">كلمة المرور</Label>
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
                        تسجيل حساب
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center">
                <p className="text-sm text-muted-foreground">
                    عندك حساب؟ <Link href="/login" className="font-semibold text-blue-600 hover:underline">سجل دخول</Link>
                </p>
            </CardFooter>
        </Card>
    )
}
