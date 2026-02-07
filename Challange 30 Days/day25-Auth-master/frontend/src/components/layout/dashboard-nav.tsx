"use client"

import Link from "next/link"
import { useAuthStore } from "@/store/useAuthStore"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { authService } from "@/services/authService"
import { toast } from "sonner"
import { LogOut, User, Shield } from "lucide-react"

export function DashboardNav() {
    const { user, logout } = useAuthStore()
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await authService.logout()
        } catch (e) {
            console.warn("فشل تسجيل الخروج من السيرفر", e)
        } finally {
            logout()
            router.push("/login")
            toast.success("تم تسجيل الخروج بنجاح")
        }
    }

    return (
        <header className="fixed top-0 w-full z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl shadow-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <Link href="/profile" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        AuthMaster
                    </Link>
                    <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
                        <Link href="/profile" className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all">
                            <User className="w-4 h-4" />
                            ملفي الشخصي
                        </Link>
                        {user?.role === 'admin' && (
                            <Link href="/admin" className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all">
                                <Shield className="w-4 h-4" />
                                لوحة التحكم
                            </Link>
                        )}
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm font-medium text-slate-700 hidden sm:block">
                        مرحباً، {user?.name}
                    </div>
                    <Button variant="destructive" size="sm" onClick={handleLogout} className="rounded-full px-4 shadow-md hover:shadow-lg transition-all">
                        <LogOut className="w-4 h-4 ml-2" />
                        خروج
                    </Button>
                </div>
            </div>
        </header>
    )
}
