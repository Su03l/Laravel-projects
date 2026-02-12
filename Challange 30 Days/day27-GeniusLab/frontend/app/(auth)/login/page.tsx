"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, Lock, ArrowLeft } from "lucide-react"
import { useState } from "react"

const loginSchema = z.object({
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
    const { login } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginForm) => {
        setIsSubmitting(true)
        try {
            await login(data)
        } catch {
            // handled by interceptor
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
                <h1 className="text-3xl font-bold">
                    Genius<span className="text-[#39ff14]">Lab</span>
                </h1>
            </div>

            <div className="glass rounded-2xl p-8 glow-green">
                <div className="space-y-2 text-center mb-8">
                    <h2 className="text-2xl font-bold gradient-text">تسجيل الدخول</h2>
                    <p className="text-sm text-zinc-500">
                        أدخل بيانات حسابك للمتابعة
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-zinc-400">البريد الإلكتروني</Label>
                        <div className="relative">
                            <Mail className="absolute right-3 top-3 h-4 w-4 text-zinc-500" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="user@example.com"
                                className="pr-10 bg-black/30 border-zinc-800 focus:border-[#39ff14]/50 focus:ring-[#39ff14]/20 h-12"
                                {...register("email")}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-400 text-xs">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-zinc-400">كلمة المرور</Label>
                            <Link href="/forgot-password" className="text-xs text-[#39ff14] hover:text-[#39ff14]/80 transition-colors">
                                نسيت كلمة المرور؟
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute right-3 top-3 h-4 w-4 text-zinc-500" />
                            <Input
                                id="password"
                                type="password"
                                className="pr-10 bg-black/30 border-zinc-800 focus:border-[#39ff14]/50 focus:ring-[#39ff14]/20 h-12"
                                {...register("password")}
                            />
                        </div>
                        {errors.password && (
                            <p className="text-red-400 text-xs">{errors.password.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 bg-[#39ff14] text-black font-bold hover:bg-[#39ff14]/80 glow-green-strong transition-all text-base"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                                جاري الدخول...
                            </>
                        ) : (
                            <>
                                دخول
                                <ArrowLeft className="mr-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-zinc-500">
                        ليس لديك حساب؟{" "}
                        <Link href="/register" className="text-[#39ff14] hover:text-[#39ff14]/80 font-medium transition-colors">
                            إنشاء حساب جديد
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
