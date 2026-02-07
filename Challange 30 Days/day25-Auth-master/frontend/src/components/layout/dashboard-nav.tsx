"use client"

import Link from "next/link"
import { useAuthStore } from "@/store/useAuthStore"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { authService } from "@/services/authService"
import { toast } from "sonner"
import { LogOut, User, Shield, Activity, Users, ChevronDown } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DashboardNav() {
    const { user, logout } = useAuthStore()
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await authService.logout()
        } catch (e: any) {
            // Ignore 401 errors as we are logging out anyway
            if (e.response?.status !== 401) {
                console.warn("فشل تسجيل الخروج من السيرفر", e)
            }
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
                    <Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        AuthMaster
                    </Link>
                    <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
                        <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all">
                            <Activity className="w-4 h-4" />
                            الرئيسية
                        </Link>
                        {user?.role === 'admin' && (
                            <Link href="/admin" className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all">
                                <Users className="w-4 h-4" />
                                الموظفين والعملاء
                            </Link>
                        )}
                        <Link href="/profile" className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all">
                            <User className="w-4 h-4" />
                            ملفي الشخصي
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <DropdownMenu dir="rtl">
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full md:w-auto md:px-2 md:gap-2 hover:bg-slate-100">
                                <div className="h-9 w-9 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="text-sm font-bold text-slate-500">{user?.name?.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div className="hidden md:flex flex-col items-start gap-0.5">
                                    <span className="text-sm font-medium text-slate-700">{user?.name}</span>
                                    <span className="text-[10px] text-slate-500">{user?.role === 'admin' ? 'مسؤول' : 'مستخدم'}</span>
                                </div>
                                <ChevronDown className="h-4 w-4 text-slate-500 hidden md:block" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
                                <User className="ml-2 h-4 w-4" />
                                <span>ملفي الشخصي</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                <LogOut className="ml-2 h-4 w-4" />
                                <span>تسجيل الخروج</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
