"use client"

import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Loader2, ShieldCheck } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function VerifyPageContent() {
    const { verifyAccount } = useAuth()
    const searchParams = useSearchParams()
    const email = searchParams.get("email") || ""
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        inputRefs.current[0]?.focus()
    }, [])

    const handleChange = (value: string, index: number) => {
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

    const handleSubmit = async () => {
        const code = otp.join("")
        if (code.length !== 6) return
        setIsSubmitting(true)
        try {
            await verifyAccount(email, code)
        } catch {
            setOtp(["", "", "", "", "", ""])
            inputRefs.current[0]?.focus()
        } finally {
            setIsSubmitting(false)
        }
    }

    const isComplete = otp.every(d => d !== "")

    return (
        <div className="space-y-6">
            <div className="lg:hidden text-center mb-8">
                <h1 className="text-3xl font-bold">
                    Genius<span className="text-[#39ff14]">Lab</span>
                </h1>
            </div>

            <div className="glass rounded-2xl p-8 glow-green text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#39ff14]/10 border border-[#39ff14]/20 mb-6">
                    <ShieldCheck className="w-8 h-8 text-[#39ff14]" />
                </div>

                <h2 className="text-2xl font-bold gradient-text mb-2">تفعيل الحساب</h2>
                <p className="text-sm text-zinc-500 mb-8">
                    أدخل رمز التحقق المرسل إلى
                    <br />
                    <span className="text-zinc-300 font-mono">{email}</span>
                </p>

                <div className="flex gap-3 justify-center mb-8" dir="ltr" onPaste={handlePaste}>
                    {otp.map((digit, i) => (
                        <input
                            key={i}
                            ref={(el) => { inputRefs.current[i] = el }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(e.target.value, i)}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                            className="otp-input"
                        />
                    ))}
                </div>

                <Button
                    onClick={handleSubmit}
                    className="w-full h-12 bg-[#39ff14] text-black font-bold hover:bg-[#39ff14]/80 glow-green-strong text-base"
                    disabled={isSubmitting || !isComplete}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                            جاري التحقق...
                        </>
                    ) : (
                        "تفعيل الحساب"
                    )}
                </Button>

                <p className="text-xs text-zinc-600 mt-6">
                    لم يصلك الرمز؟ تحقق من مجلد الرسائل غير المرغوب فيها
                </p>
            </div>
        </div>
    )
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin text-[#39ff14]" /></div>}>
            <VerifyPageContent />
        </Suspense>
    )
}
