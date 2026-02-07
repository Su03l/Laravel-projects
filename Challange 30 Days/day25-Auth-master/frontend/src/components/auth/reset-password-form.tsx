"use client"

import { useState, useEffect } from "react"
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
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Lock, Mail, KeyRound } from "lucide-react"

const schema = z.object({
    email: z.string().email(),
    otp_code: z.string().min(1, "Code is required"),
    password: z.string().min(8),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
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
            toast.success("Password reset successfully. Please login.")
            router.push("/login")
        } catch (e) {
            //
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>Enter the code and your new password.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            startIcon={<Mail className="h-4 w-4" />}
                            {...form.register("email")}
                            error={form.formState.errors.email?.message}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="otp_code">Reset Code</Label>
                        <Input
                            id="otp_code"
                            startIcon={<KeyRound className="h-4 w-4" />}
                            {...form.register("otp_code")}
                            error={form.formState.errors.otp_code?.message}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            id="password"
                            type="password"
                            startIcon={<Lock className="h-4 w-4" />}
                            {...form.register("password")}
                            error={form.formState.errors.password?.message}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation">Confirm Password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            startIcon={<Lock className="h-4 w-4" />}
                            {...form.register("password_confirmation")}
                            error={form.formState.errors.password_confirmation?.message}
                        />
                    </div>
                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        Reset Password
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
