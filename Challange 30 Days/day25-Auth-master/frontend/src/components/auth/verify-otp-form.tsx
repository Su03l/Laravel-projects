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

const verifySchema = z.object({
    email: z.string().email(),
    otp: z.string().min(6, "OTP must be 6 digits"),
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
                toast.success("Account verified successfully!")
                localStorage.removeItem('verification_email')
                router.push("/profile") // Redirect to dashboard/profile
            }
        } catch (error: any) {
            if (error.response?.data?.errors) {
                // handle validation errors
            }
        } finally {
            setIsLoading(false)
        }
    }

    async function onResend() {
        const email = form.getValues('email');
        if (!email) {
            toast.error("Please enter email to resend OTP");
            return;
        }
        try {
            await authService.resendOtp(email);
            toast.success("OTP Code Resent");
        } catch (e) {
            // error handled by api
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Verify Account</CardTitle>
                <CardDescription>Enter the code sent to your email.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            {...form.register("email")}
                            error={form.formState.errors.email?.message}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="otp">OTP Code</Label>
                        <Input
                            id="otp"
                            placeholder="123456"
                            {...form.register("otp")}
                            error={form.formState.errors.otp?.message}
                        />
                    </div>
                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        Verify
                    </Button>
                </form>
                <div className="mt-4 text-center">
                    <Button variant="link" onClick={onResend} type="button">Resend Code</Button>
                </div>
            </CardContent>
        </Card>
    )
}
