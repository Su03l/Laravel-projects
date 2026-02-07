"use client"

import { useAuthStore } from "@/store/useAuthStore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, Shield, Activity, UserPlus, TrendingUp, ArrowUpRight, Calendar } from "lucide-react"
import { useEffect, useState } from "react"
import api from "@/services/api"
import Link from "next/link"
import { OverviewChart } from "@/components/dashboard/overview-chart"

export default function DashboardPage() {
    const { user } = useAuthStore()
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        admins: 0,
        employees: 0,
        newUsers24h: 0
    })
    const [chartData, setChartData] = useState<{ name: string, total: number }[]>([])

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/stats')
                const data = response.data
                setStats({
                    totalUsers: data.total_users,
                    activeUsers: data.active_users,
                    admins: data.admins_count,
                    employees: data.employees_count,
                    newUsers24h: data.new_users_24h
                })
                setChartData(data.roles_distribution)
            } catch (e) {
                console.error("Failed to fetch stats", e)
            }
        }

        if (user?.role === 'admin') {
            fetchStats()
        }
    }, [user])

    const currentDate = new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="space-y-8 pt-24 pb-10 animate-in fade-in duration-700 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        مرحباً، {user?.name}
                    </h1>
                    <p className="text-slate-500 text-base">
                        إليك نظرة عامة على أداء المنصة اليوم.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                    <Calendar className="h-4 w-4 text-indigo-500" />
                    <span>{currentDate}</span>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <MinimalStatCard
                    title="المستخدمين"
                    value={stats.totalUsers}
                    icon={Users}
                    desc="إجمالي المسجلين"
                />
                <MinimalStatCard
                    title="النشطين"
                    value={stats.activeUsers}
                    icon={Activity}
                    desc="مستخدمين حالين"
                />
                <MinimalStatCard
                    title="الإداريين"
                    value={stats.admins + stats.employees}
                    icon={Shield}
                    desc="طاقم العمل"
                />
                <MinimalStatCard
                    title="الجدد"
                    value={stats.newUsers24h}
                    icon={UserPlus}
                    desc="في آخر 24 ساعة"
                    highlight
                />
            </div>

            {/* Main Content Areas */}
            <div className="grid gap-6 md:grid-cols-7">

                {/* Analytics Chart */}
                <Card className="md:col-span-4 border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-base font-semibold text-slate-900">توزيع الصلاحيات</CardTitle>
                                <CardDescription>نظرة تفصيلية على هيكل المستخدمين</CardDescription>
                            </div>
                            <div className="p-2 bg-slate-50 rounded-lg">
                                <TrendingUp className="h-4 w-4 text-slate-500" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pl-2 pt-4">
                        <OverviewChart data={chartData} />
                    </CardContent>
                </Card>

                {/* Quick Actions & Status */}
                <div className="md:col-span-3 space-y-6">
                    {/* Actions Card */}
                    <Card className="border-slate-200 shadow-sm bg-white">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-slate-900">الوصول السريع</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            {user?.role === 'admin' && (
                                <Link href="/admin/create-user" className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            <UserPlus className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-700">إضافة مستخدم</span>
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500" />
                                </Link>
                            )}
                            <Link href="/profile" className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-700 group-hover:text-white transition-colors">
                                        <Shield className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">إعدادات الأمان</span>
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500" />
                            </Link>
                        </CardContent>
                    </Card>

                    {/* System Status (Decorative) */}
                    <Card className="border-0 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <Activity className="h-4 w-4 text-green-400" />
                                حالة النظام
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-2xl font-bold mb-1">يعمل بكفاءة</div>
                            <p className="text-xs text-slate-400">آخر تحديث للبيانات: قبل لحظات</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

interface MinimalStatCardProps {
    title: string
    value: number | string
    icon: React.ElementType
    desc: string
    highlight?: boolean
}

function MinimalStatCard({ title, value, icon: Icon, desc, highlight = false }: MinimalStatCardProps) {
    return (
        <Card className={`border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md group ${highlight ? 'bg-indigo-50/50 border-indigo-100' : 'bg-white'}`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-500 group-hover:text-indigo-600 transition-colors">{title}</span>
                    <Icon className={`h-5 w-5 ${highlight ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'} transition-colors`} />
                </div>
                <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
            </CardContent>
        </Card>
    )
}
