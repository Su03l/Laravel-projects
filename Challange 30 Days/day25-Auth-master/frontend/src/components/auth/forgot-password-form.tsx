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
import { Mail } from "lucide-react"

const schema = z.object({
    email: z.string().email("البريد الإلكتروني غير صحيح"),
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
            toast.success("تم إرسال كود الاستعادة على إيميلك")
            // Pass email to reset page
            router.push(`/reset-password?email=${encodeURIComponent(data.email)}`)
        } catch (e) {
            toast.error("حدث خطأ، تأكد من الإيميل وحاول مرة ثانية")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full border-0 shadow-xl bg-white/80 backdrop-blur-md ring-1 ring-white/50">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    نسيت الباسورد؟
                </CardTitle>
                <CardDescription className="text-lg">
                    ولا يهمك، اكتب إيميلك وبنرسل لك كود الاستعادة
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            startIcon={<Mail className="h-4 w-4" />}
                            {...form.register("email")}
                            error={form.formState.errors.email?.message}
                        />
                    </div>
                    <Button type="submit" className="w-full text-lg h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-blue-500/25" isLoading={isLoading}>
                        إرسال الكود
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center">
                <Link href="/login" className="text-sm font-medium text-blue-600 hover:underline">
                    رجوع لتسجيل الدخول
                </Link>
            </CardFooter>
        </Card>
    )
}
