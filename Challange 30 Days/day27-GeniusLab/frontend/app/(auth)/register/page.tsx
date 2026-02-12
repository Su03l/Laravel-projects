"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, Lock, User, ArrowLeft } from "lucide-react"
import { useState } from "react"

const registerSchema = z.object({
    name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: "كلمات المرور غير متطابقة",
    path: ["password_confirmation"],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
    const { register: registerUser } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    })

    const password = watch("password", "")

    const getPasswordStrength = (pass: string) => {
        if (!pass) return { level: 0, text: "", color: "" }
        let score = 0
        if (pass.length >= 8) score++
        if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++
        if (/\d/.test(pass)) score++
        if (/[^a-zA-Z0-9]/.test(pass)) score++

        const levels = [
            { level: 0, text: "", color: "" },
            { level: 1, text: "ضعيف", color: "bg-red-500" },
            { level: 2, text: "متوسط", color: "bg-yellow-500" },
            { level: 3, text: "جيد", color: "bg-blue-500" },
            { level: 4, text: "قوي", color: "bg-[#39ff14]" },
        ]
        return levels[score]
    }

    const strength = getPasswordStrength(password)

    const onSubmit = async (data: RegisterForm) => {
        setIsSubmitting(true)
        try {
            await registerUser(data)
        } catch {
            // handled
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="lg:hidden text-center mb-8">
                <h1 className="text-3xl font-bold">
                    Genius<span className="text-[#39ff14]">Lab</span>
                </h1>
            </div>

            <div className="glass rounded-2xl p-8 glow-green">
                <div className="space-y-2 text-center mb-8">
                    <h2 className="text-2xl font-bold gradient-text">إنشاء حساب جديد</h2>
                    <p className="text-sm text-zinc-500">
                        انضم إلينا واستمتع بقوة الذكاء الاصطناعي
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-zinc-400">الاسم الكامل</Label>
                        <div className="relative">
                            <User className="absolute right-3 top-3 h-4 w-4 text-zinc-500" />
                            <Input
                                id="name"
                                type="text"
                                placeholder="أحمد محمد"
                                className="pr-10 bg-black/30 border-zinc-800 focus:border-[#39ff14]/50 h-12"
                                {...register("name")}
                            />
                        </div>
                        {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-zinc-400">البريد الإلكتروني</Label>
                        <div className="relative">
                            <Mail className="absolute right-3 top-3 h-4 w-4 text-zinc-500" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="user@example.com"
                                className="pr-10 bg-black/30 border-zinc-800 focus:border-[#39ff14]/50 h-12"
                                {...register("email")}
                            />
                        </div>
                        {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-zinc-400">كلمة المرور</Label>
                        <div className="relative">
                            <Lock className="absolute right-3 top-3 h-4 w-4 text-zinc-500" />
                            <Input
                                id="password"
                                type="password"
                                className="pr-10 bg-black/30 border-zinc-800 focus:border-[#39ff14]/50 h-12"
                                {...register("password")}
                            />
                        </div>
                        {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
                        {/* Password strength */}
                        {password && (
                            <div className="space-y-1">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength.level ? strength.color : 'bg-zinc-800'}`} />
                                    ))}
                                </div>
                                <p className="text-[10px] text-zinc-500">{strength.text}</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation" className="text-zinc-400">تأكيد كلمة المرور</Label>
                        <div className="relative">
                            <Lock className="absolute right-3 top-3 h-4 w-4 text-zinc-500" />
                            <Input
                                id="password_confirmation"
                                type="password"
                                className="pr-10 bg-black/30 border-zinc-800 focus:border-[#39ff14]/50 h-12"
                                {...register("password_confirmation")}
                            />
                        </div>
                        {errors.password_confirmation && <p className="text-red-400 text-xs">{errors.password_confirmation.message}</p>}
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 bg-[#39ff14] text-black font-bold hover:bg-[#39ff14]/80 glow-green-strong transition-all text-base mt-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                                جاري التسجيل...
                            </>
                        ) : (
                            <>
                                إنشاء الحساب
                                <ArrowLeft className="mr-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-zinc-500">
                        لديك حساب بالفعل؟{" "}
                        <Link href="/login" className="text-[#39ff14] hover:text-[#39ff14]/80 font-medium transition-colors">
                            تسجيل الدخول
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
