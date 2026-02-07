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
import { Loader2, Mail, Lock } from "lucide-react"

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
    remember: z.boolean().default(false).optional(),
})

const verifySchema = z.object({
    otp_code: z.string().min(6, { message: "OTP must be 6 digits" }),
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
                toast.info("Two-Factor Authentication required")
            } else if (response.token && response.user) {
                login(response.user, response.token)
                toast.success("Logged in successfully")
                router.push("/profile")
            }
        } catch (error: any) {
            // Error handled by interceptor or generic catch
            console.error(error)
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
                toast.success("Verified successfully")
                router.push("/profile")
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    if (requires2FA) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>Enter the code sent to your email.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={verifyForm.handleSubmit(onVerifySubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="otp_code">OTP Code</Label>
                            <Input
                                id="otp_code"
                                placeholder="123456"
                                {...verifyForm.register("otp_code")}
                                error={verifyForm.formState.errors.otp_code?.message}
                            />
                        </div>
                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Verify
                        </Button>
                    </form>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
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
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            startIcon={<Lock className="h-4 w-4" />}
                            {...loginForm.register("password")}
                            error={loginForm.formState.errors.password?.message}
                        />
                    </div>
                    <div className="flex justify-end">
                        <a href="/forgot-password" className="text-sm text-primary hover:underline">
                            Forgot Password?
                        </a>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="remember"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            {...loginForm.register("remember")}
                        />
                        <Label htmlFor="remember" className="text-sm font-normal">Remember me</Label>
                    </div>
                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        Sign In
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center">
                <p className="text-sm text-muted-foreground">
                    Don't have an account? <a href="/register" className="text-primary hover:underline">Register</a>
                </p>
            </CardFooter>
        </Card>
    )
}
