"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Lock, KeyRound } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

const schema = z.object({
    password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: "كلمات المرور غير متطابقة",
    path: ["password_confirmation"],
})

type ResetForm = z.infer<typeof schema>

function ResetPasswordContent() {
    const { resetPassword } = useAuth()
    const searchParams = useSearchParams()
    const email = searchParams.get("email") || ""
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        inputRefs.current[0]?.focus()
    }, [])

    const handleOtpChange = (value: string, index: number) => {
        if (!/^\d*$/.test(value)) return
        const newOtp = [...otp]
        newOtp[index] = value.slice(-1)
        setOtp(newOtp)
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
        const newOtp = [...otp]
        pasted.split("").forEach((char, i) => { newOtp[i] = char })
        setOtp(newOtp)
        inputRefs.current[Math.min(pasted.length, 5)]?.focus()
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetForm>({
        resolver: zodResolver(schema),
    })

    const otpComplete = otp.every(d => d !== "")

    const onSubmit = async (data: ResetForm) => {
        if (!otpComplete) return
        setIsSubmitting(true)
        try {
            await resetPassword({
                email,
                otp: otp.join(""),
                password: data.password,
                password_confirmation: data.password_confirmation,
            })
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

            <div className="glass rounded-2xl p-8 glow-purple">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#a855f7]/10 border border-[#a855f7]/20 mb-6">
                        <KeyRound className="w-8 h-8 text-[#a855f7]" />
                    </div>
                    <h2 className="text-2xl font-bold gradient-text-warm mb-2">إعادة تعيين كلمة المرور</h2>
                    <p className="text-sm text-zinc-500">
                        أدخل رمز التحقق وكلمة المرور الجديدة
                    </p>
                </div>

                {/* OTP */}
                <div className="mb-6">
                    <Label className="text-zinc-400 mb-3 block text-center">رمز التحقق</Label>
                    <div className="flex gap-3 justify-center" dir="ltr" onPaste={handlePaste}>
                        {otp.map((digit, i) => (
                            <input
                                key={i}
                                ref={(el) => { inputRefs.current[i] = el }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(e.target.value, i)}
                                onKeyDown={(e) => handleKeyDown(e, i)}
                                className="otp-input"
                                style={{ borderColor: digit ? 'rgba(168,85,247,0.5)' : undefined }}
                            />
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-zinc-400">كلمة المرور الجديدة</Label>
                        <div className="relative">
                            <Lock className="absolute right-3 top-3 h-4 w-4 text-zinc-500" />
                            <Input
                                id="password"
                                type="password"
                                className="pr-10 bg-black/30 border-zinc-800 focus:border-[#a855f7]/50 h-12"
                                {...register("password")}
                            />
                        </div>
                        {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation" className="text-zinc-400">تأكيد كلمة المرور</Label>
                        <div className="relative">
                            <Lock className="absolute right-3 top-3 h-4 w-4 text-zinc-500" />
                            <Input
                                id="password_confirmation"
                                type="password"
                                className="pr-10 bg-black/30 border-zinc-800 focus:border-[#a855f7]/50 h-12"
                                {...register("password_confirmation")}
                            />
                        </div>
                        {errors.password_confirmation && <p className="text-red-400 text-xs">{errors.password_confirmation.message}</p>}
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 bg-[#a855f7] text-white font-bold hover:bg-[#a855f7]/80 glow-purple text-base"
                        disabled={isSubmitting || !otpComplete}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                                جاري التغيير...
                            </>
                        ) : (
                            "تغيير كلمة المرور"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin text-[#a855f7]" /></div>}>
            <ResetPasswordContent />
        </Suspense>
    )
}
