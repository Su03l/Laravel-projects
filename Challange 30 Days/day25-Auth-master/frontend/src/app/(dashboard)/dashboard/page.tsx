"use client"

import { useAuthStore } from "@/store/useAuthStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Shield, Activity, UserPlus } from "lucide-react"
import { useEffect, useState } from "react"
import api from "@/services/api"
import Link from "next/link"

export default function DashboardPage() {
    const { user } = useAuthStore()
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        bannedUsers: 0,
        admins: 0
    })

    useEffect(() => {
        // Fetch stats if user is admin, or just show welcome message
        if (user?.role === 'admin') {
            fetchStats()
        }
    }, [user])

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/users')
            const users = response.data.data || response.data
            setStats({
                totalUsers: users.length,
                activeUsers: users.filter((u: any) => !u.is_banned).length,
                bannedUsers: users.filter((u: any) => u.is_banned).length,
                admins: users.filter((u: any) => u.role === 'admin').length
            })
        } catch (e) {
            console.error("Failed to fetch stats", e)
        }
    }

    return (
        <div className="space-y-8 pt-20 pb-10 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent w-fit">
                    لوحة التحكم الرئيسية
                </h1>
                <p className="text-muted-foreground text-lg">
                    مرحباً بك مجدداً، {user?.name} 👋
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all border-blue-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            إجمالي المستخدمين
                        </CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">{stats.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">
                            +2 منذ الشهر الماضي
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all border-green-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            المستخدمين النشطين
                        </CardTitle>
                        <Activity className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">{stats.activeUsers}</div>
                        <p className="text-xs text-muted-foreground">
                            مستخدم حالياً
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all border-purple-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            المشرفين
                        </CardTitle>
                        <Shield className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">{stats.admins}</div>
                        <p className="text-xs text-muted-foreground">
                            مشرفين للنظام
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all border-orange-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            تسجيل جديد
                        </CardTitle>
                        <UserPlus className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">+12</div>
                        <p className="text-xs text-muted-foreground">
                            في آخر 24 ساعة
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-white/70 backdrop-blur-md shadow-lg border-0">
                    <CardHeader>
                        <CardTitle>نظرة عامة على النظام</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground border-2 border-dashed border-slate-200 rounded-lg">
                            مساحة للرسم البياني (Chart)
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3 bg-white/70 backdrop-blur-md shadow-lg border-0">
                    <CardHeader>
                        <CardTitle>إجراءات سريعة</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {user?.role === 'admin' && (
                                <Link href="/admin/create-user" className="flex items-center p-3 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100 shadow-sm pointer-events-auto">
                                    <div className="ml-4 h-9 w-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                        <UserPlus className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">إضافة مستخدم جديد</p>
                                        <p className="text-xs text-muted-foreground">
                                            إنشاء حساب لموظف أو عميل جديد
                                        </p>
                                    </div>
                                </Link>
                            )}
                            <Link href="/profile" className="flex items-center p-3 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100 shadow-sm pointer-events-auto">
                                <div className="ml-4 h-9 w-9 flex items-center justify-center rounded-full bg-purple-100 text-purple-600">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">إعدادات الأمان</p>
                                    <p className="text-xs text-muted-foreground">
                                        تغيير كلمة المرور أو تفعيل 2FA
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
