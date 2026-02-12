"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, ArrowRight } from "lucide-react"
import { useState } from "react"

const schema = z.object({
    email: z.string().email("البريد الإلكتروني غير صحيح"),
})

type ForgotForm = z.infer<typeof schema>

export default function ForgotPasswordPage() {
    const { forgotPassword } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotForm>({
        resolver: zodResolver(schema),
    })

    const onSubmit = async (data: ForgotForm) => {
        setIsSubmitting(true)
        try {
            await forgotPassword(data.email)
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

            <div className="glass rounded-2xl p-8 glow-purple text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#a855f7]/10 border border-[#a855f7]/20 mb-6">
                    <Mail className="w-8 h-8 text-[#a855f7]" />
                </div>

                <h2 className="text-2xl font-bold gradient-text-warm mb-2">نسيت كلمة المرور</h2>
                <p className="text-sm text-zinc-500 mb-8">
                    أدخل بريدك الإلكتروني وسنرسل لك رمز إعادة التعيين
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-right">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-zinc-400">البريد الإلكتروني</Label>
                        <div className="relative">
                            <Mail className="absolute right-3 top-3 h-4 w-4 text-zinc-500" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="user@example.com"
                                className="pr-10 bg-black/30 border-zinc-800 focus:border-[#a855f7]/50 h-12"
                                {...register("email")}
                            />
                        </div>
                        {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 bg-[#a855f7] text-white font-bold hover:bg-[#a855f7]/80 glow-purple text-base"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                                جاري الإرسال...
                            </>
                        ) : (
                            "إرسال رمز التحقق"
                        )}
                    </Button>
                </form>

                <div className="mt-6">
                    <Link href="/login" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                        العودة لتسجيل الدخول
                    </Link>
                </div>
            </div>
        </div>
    )
}
