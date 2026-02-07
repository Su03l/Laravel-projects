"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
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
import Link from "next/link"

const schema = z.object({
    email: z.string().email(),
})

export function ForgotPasswordForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: { email: "" },
    })

    async function onSubmit(data: z.infer<typeof schema>) {
        setIsLoading(true)
        try {
            await passwordService.forgotPassword(data.email)
            toast.success("Reset code sent to your email")
            // Pass email to reset page
            router.push(`/reset-password?email=${encodeURIComponent(data.email)}`)
        } catch (e) {
            //
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Forgot Password</CardTitle>
                <CardDescription>Enter your email to receive a reset code.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" {...form.register("email")} error={form.formState.errors.email?.message} />
                    </div>
                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        Send Reset Code
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center">
                <Link href="/login" className="text-sm text-primary hover:underline">
                    Back to Login
                </Link>
            </CardFooter>
        </Card>
    )
}
