"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import api from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { User, Mail, Phone, Lock, Shield, Save, ArrowRight } from "lucide-react"

const createUserSchema = z.object({
    name: z.string().min(2, "الاسم لازم يكون حرفين على الأقل"),
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    phone: z.string().min(10, "رقم الجوال لازم يكون 10 أرقام"),
    password: z.string().min(6, "كلمة المرور لازم تكون 6 خانات على الأقل"),
    role: z.enum(["admin", "user", "employee"], {
        required_error: "يرجى اختيار الصلاحية",
    }),
})

export default function CreateUserPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof createUserSchema>>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            role: "user",
        },
    })

    async function onSubmit(data: z.infer<typeof createUserSchema>) {
        setIsLoading(true)
        try {
            await api.post('/admin/users', data)
            toast.success("تم إضافة المستخدم بنجاح")
            router.push('/admin')
        } catch (error: any) {
            toast.error(error.response?.data?.message || "فشل إضافة المستخدم")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto pt-20 pb-10 animate-in fade-in duration-500">
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-6 hover:bg-slate-100 -mr-4"
            >
                <ArrowRight className="ml-2 h-4 w-4" />
                رجوع للقائمة
            </Button>

            <Card className="border-0 shadow-2xl bg-white/70 backdrop-blur-xl ring-1 ring-white/50">
                <CardHeader>
                    <CardTitle className="text-2xl text-right bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        إضافة مستخدم جديد
                    </CardTitle>
                    <CardDescription className="text-right">
                        أدخل بيانات المستخدم الجديد وحدد صلاحياته
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">الاسم الكامل</Label>
                                <Input
                                    id="name"
                                    startIcon={<User className="h-4 w-4" />}
                                    placeholder="مثال: محمد أحمد"
                                    {...form.register("name")}
                                    error={form.formState.errors.name?.message}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">البريد الإلكتروني</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    startIcon={<Mail className="h-4 w-4" />}
                                    placeholder="example@domain.com"
                                    {...form.register("email")}
                                    error={form.formState.errors.email?.message}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">رقم الجوال</Label>
                                <Input
                                    id="phone"
                                    startIcon={<Phone className="h-4 w-4" />}
                                    placeholder="05xxxxxxxx"
                                    {...form.register("phone")}
                                    error={form.formState.errors.phone?.message}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">كلمة المرور</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    startIcon={<Lock className="h-4 w-4" />}
                                    {...form.register("password")}
                                    error={form.formState.errors.password?.message}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">الصلاحية (Role)</Label>
                                <Select
                                    onValueChange={(value) => form.setValue("role", value as any)}
                                    defaultValue={form.getValues("role")}
                                >
                                    <SelectTrigger className="text-right" dir="rtl">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-4 w-4 text-muted-foreground" />
                                            <SelectValue placeholder="اختر الصلاحية" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent dir="rtl">
                                        <SelectItem value="user">مستخدم (User)</SelectItem>
                                        <SelectItem value="employee">موظف (Employee)</SelectItem>
                                        <SelectItem value="admin">مسؤول (Admin)</SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.role && (
                                    <p className="text-sm text-destructive">{form.formState.errors.role.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                isLoading={isLoading}
                                className="w-full sm:w-auto min-w-[150px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                            >
                                <Save className="ml-2 h-4 w-4" />
                                حفظ المستخدم
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
