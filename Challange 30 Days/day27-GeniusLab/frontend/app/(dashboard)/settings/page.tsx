"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/AuthContext"
import { Shield, User, Lock, Loader2, CheckCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function SettingsPage() {
    const { user, updateProfile, toggleTwoFactor } = useAuth()
    const [name, setName] = useState(user?.name || "")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [isSaving, setIsSaving] = useState(false)
    const [isToggling2FA, setIsToggling2FA] = useState(false)

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password && password !== passwordConfirmation) {
            toast.error("كلمات المرور غير متطابقة")
            return
        }
        setIsSaving(true)
        try {
            await updateProfile({
                name,
                ...(password ? { password, password_confirmation: passwordConfirmation } : {})
            })
            setPassword("")
            setPasswordConfirmation("")
        } catch {
            // handled
        } finally {
            setIsSaving(false)
        }
    }

    const handleToggle2FA = async () => {
        setIsToggling2FA(true)
        try {
            await toggleTwoFactor(!user?.two_factor_enabled)
        } catch {
            // handled
        } finally {
            setIsToggling2FA(false)
        }
    }

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight gradient-text">الإعدادات</h1>
                <p className="text-zinc-500 mt-1">إدارة حسابك وتفضيلاتك</p>
            </div>

            {/* Profile Settings */}
            <Card className="glass border-zinc-800/50 hover-card-glow">
                <CardHeader className="flex flex-row items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#39ff14]/10 border border-[#39ff14]/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-[#39ff14]" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">الملف الشخصي</CardTitle>
                        <p className="text-xs text-zinc-500">تحديث بيانات حسابك</p>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-zinc-400">الاسم</Label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-black/30 border-zinc-800 focus:border-[#39ff14]/50 h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-zinc-400">البريد الإلكتروني</Label>
                            <Input
                                defaultValue={user?.email}
                                disabled
                                className="bg-black/20 border-zinc-800/50 h-11 text-zinc-500"
                            />
                        </div>
                        <div className="border-t border-zinc-800/50 my-4" />
                        <div className="space-y-2">
                            <Label className="text-zinc-400 flex items-center gap-2">
                                <Lock className="w-3 h-3" />
                                كلمة المرور الجديدة
                            </Label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="اتركه فارغاً إذا لم ترد التغيير"
                                className="bg-black/30 border-zinc-800 focus:border-[#39ff14]/50 h-11"
                            />
                        </div>
                        {password && (
                            <div className="space-y-2">
                                <Label className="text-zinc-400">تأكيد كلمة المرور</Label>
                                <Input
                                    type="password"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    className="bg-black/30 border-zinc-800 focus:border-[#39ff14]/50 h-11"
                                />
                            </div>
                        )}
                        <Button
                            type="submit"
                            className="bg-[#39ff14] text-black font-bold hover:bg-[#39ff14]/80"
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : null}
                            حفظ التغييرات
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* 2FA Settings */}
            <Card className="glass border-zinc-800/50 hover-card-glow">
                <CardHeader className="flex flex-row items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00d4ff]/10 border border-[#00d4ff]/20 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-[#00d4ff]" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">المصادقة الثنائية (2FA)</CardTitle>
                        <p className="text-xs text-zinc-500">أضف طبقة حماية إضافية لحسابك</p>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-zinc-800/50">
                        <div className="flex items-center gap-3">
                            {user?.two_factor_enabled ? (
                                <CheckCircle className="w-5 h-5 text-[#39ff14]" />
                            ) : (
                                <Shield className="w-5 h-5 text-zinc-500" />
                            )}
                            <div>
                                <p className="font-medium text-sm">
                                    {user?.two_factor_enabled ? "المصادقة الثنائية مفعّلة" : "المصادقة الثنائية معطّلة"}
                                </p>
                                <p className="text-xs text-zinc-500">
                                    {user?.two_factor_enabled
                                        ? "سيطلب منك رمز تحقق عند كل تسجيل دخول"
                                        : "فعّل المصادقة الثنائية لحماية حسابك"
                                    }
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={handleToggle2FA}
                            variant={user?.two_factor_enabled ? "destructive" : "default"}
                            className={
                                user?.two_factor_enabled
                                    ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                                    : "bg-[#00d4ff] text-black font-bold hover:bg-[#00d4ff]/80"
                            }
                            disabled={isToggling2FA}
                        >
                            {isToggling2FA ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                user?.two_factor_enabled ? "تعطيل" : "تفعيل"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
