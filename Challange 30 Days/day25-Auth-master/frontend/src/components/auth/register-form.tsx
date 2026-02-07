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
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
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
            toast.success("Registration successful! Please verify your email.")
            localStorage.setItem('verification_email', data.email);
            router.push("/verify-otp")
        } catch (error: any) {
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                Object.keys(errors).forEach((key) => {
                    form.setError(key as any, { message: errors[key][0] });
                });
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>Enter your details to register.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            startIcon={<User className="h-4 w-4" />}
                            {...form.register("name")}
                            error={form.formState.errors.name?.message}
                        />
                    </div>
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
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            startIcon={<Phone className="h-4 w-4" />}
                            {...form.register("phone")}
                            error={form.formState.errors.phone?.message}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
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
                        Register
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center">
                <p className="text-sm text-muted-foreground">
                    Already have an account? <Link href="/login" className="text-primary hover:underline">Sign In</Link>
                </p>
            </CardFooter>
        </Card>
    )
}
