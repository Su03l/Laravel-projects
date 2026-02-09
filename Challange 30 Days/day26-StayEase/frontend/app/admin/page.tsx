'use client';

import { motion } from 'framer-motion';
import {
    Calendar, BedDouble, Users, DollarSign,
    TrendingUp, TrendingDown, ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminDashboard } from '@/lib/api-hooks';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
    const { data: stats, isLoading } = useAdminDashboard();

    const statCards = [
        {
            title: 'إجمالي الإيرادات',
            value: stats?.total_revenue ?? 0,
            format: 'currency',
            icon: DollarSign,
            trend: '+12.5%',
            trendUp: true,
            color: 'text-green-600',
            bgColor: 'bg-green-100 dark:bg-green-900/30',
        },
        {
            title: 'إجمالي الحجوزات',
            value: stats?.total_bookings ?? 0,
            format: 'number',
            icon: Calendar,
            trend: '+8.2%',
            trendUp: true,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        },
        {
            title: 'الضيوف النشطين',
            value: stats?.active_bookings ?? 0,
            format: 'number',
            icon: Users,
            trend: '+5.1%',
            trendUp: true,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100 dark:bg-purple-900/30',
        },
        {
            title: 'الغرف المتاحة',
            value: stats?.available_rooms ?? 0,
            format: 'number',
            icon: BedDouble,
            trend: '-2.3%',
            trendUp: false,
            color: 'text-amber-600',
            bgColor: 'bg-amber-100 dark:bg-amber-900/30',
        },
    ];

    return (
        <div className="animate-fade-in text-right">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-display text-3xl font-bold mb-2">لوحة تحكم المسؤول</h1>
                <p className="text-muted-foreground">
                    مرحباً بعودتك! إليك نظرة عامة على ما يحدث في StayEase.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4 flex-row-reverse">
                                    <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                    <Badge
                                        variant={stat.trendUp ? 'success' : 'destructive'}
                                        className="flex items-center gap-1 flex-row-reverse"
                                    >
                                        {stat.trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                        {stat.trend}
                                    </Badge>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                                    {isLoading ? (
                                        <Skeleton className="h-9 w-24 ml-auto" />
                                    ) : (
                                        <p className="text-3xl font-bold">
                                            {stat.format === 'currency'
                                                ? formatCurrency(stat.value)
                                                : stat.value.toLocaleString('ar-SA')}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between flex-row-reverse">
                            <span>آخر الحجوزات</span>
                            <Button variant="outline" size="sm" asChild className="gap-1">
                                <Link href="/admin/bookings">
                                    عرض الكل
                                    <ArrowUpRight className="h-3 w-3" />
                                </Link>
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-4 flex-row-reverse">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div className="flex-1 text-right">
                                            <Skeleton className="h-4 w-32 mb-1 ml-auto" />
                                            <Skeleton className="h-3 w-24 ml-auto" />
                                        </div>
                                        <Skeleton className="h-6 w-20" />
                                    </div>
                                ))}
                            </div>
                        ) : stats?.recent_bookings && Array.isArray(stats.recent_bookings) && stats.recent_bookings.length > 0 ? (
                            <div className="space-y-4">
                                {stats.recent_bookings.map((booking) => (
                                    <div key={booking.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors flex-row-reverse">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-sm font-semibold text-primary">
                                                {booking.user?.name?.charAt(0) || 'G'}
                                            </span>
                                        </div>
                                        <div className="flex-1 text-right">
                                            <p className="font-medium">{booking.user?.name || 'ضيف'}</p>
                                            <p className="text-sm text-muted-foreground">غرفة {booking.room?.room_number}</p>
                                        </div>
                                        <Badge
                                            variant={
                                                booking.status === 'confirmed' ? 'success' :
                                                    booking.status === 'pending' ? 'warning' : 'secondary'
                                            }
                                        >
                                            {booking.status === 'confirmed' ? 'مؤكد' :
                                                booking.status === 'pending' ? 'معلق' :
                                                    booking.status === 'cancelled' ? 'ملغي' : 'مكتمل'}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground py-8">لا توجد حجوزات حديثة</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between flex-row-reverse">
                            <span>حالة الغرف</span>
                            <Button variant="outline" size="sm" asChild className="gap-1">
                                <Link href="/admin/rooms">
                                    إدارة
                                    <ArrowUpRight className="h-3 w-3" />
                                </Link>
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 dark:bg-green-900/20 flex-row-reverse">
                                <div className="flex items-center gap-3 flex-row-reverse">
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    <span className="font-medium">متاحة</span>
                                </div>
                                <span className="text-2xl font-bold text-green-600">{stats?.available_rooms || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex-row-reverse">
                                <div className="flex items-center gap-3 flex-row-reverse">
                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                    <span className="font-medium">مشغولة</span>
                                </div>
                                <span className="text-2xl font-bold text-blue-600">{stats?.occupied_rooms || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex-row-reverse">
                                <div className="flex items-center gap-3 flex-row-reverse">
                                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                                    <span className="font-medium">صيانة</span>
                                </div>
                                <span className="text-2xl font-bold text-amber-600">{stats?.maintenance_rooms || 0}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
