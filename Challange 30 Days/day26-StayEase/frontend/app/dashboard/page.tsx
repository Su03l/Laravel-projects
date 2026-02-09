'use client';

import { Calendar, BedDouble, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useMyBookings } from '@/lib/api-hooks';
import { useAuthStore } from '@/lib/auth-store';

export default function DashboardPage() {
    const { user } = useAuthStore();
    const { data: bookings, isLoading } = useMyBookings();

    const safeBookings = Array.isArray(bookings) ? bookings : [];
    const activeBookings = safeBookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
    const completedBookings = safeBookings.filter(b => b.status === 'completed');

    const stats = [
        {
            title: 'حجوزات نشطة',
            value: activeBookings.length,
            icon: Calendar,
            color: 'text-primary',
            bgColor: 'bg-primary/10',
        },
        {
            title: 'إقامات مكتملة',
            value: completedBookings.length,
            icon: BedDouble,
            color: 'text-green-600',
            bgColor: 'bg-green-100 dark:bg-green-900/30',
        },
        {
            title: 'إجمالي الحجوزات',
            value: safeBookings.length,
            icon: TrendingUp,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        },
        {
            title: 'تقييمات مقدمة',
            value: completedBookings.length, // Assuming one review per completed booking for now
            icon: Star,
            color: 'text-amber-600',
            bgColor: 'bg-amber-100 dark:bg-amber-900/30',
        },
    ];

    return (
        <div className="animate-fade-in text-right">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="font-display text-3xl font-bold mb-2">
                    مرحباً بك، {user?.name?.split(' ')[0]}!
                </h1>
                <p className="text-muted-foreground">
                    إليك نظرة عامة على نشاط حسابك.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between flex-row-reverse">
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                                    {isLoading ? (
                                        <Skeleton className="h-9 w-16 ml-auto" />
                                    ) : (
                                        <p className="text-3xl font-bold">{stat.value}</p>
                                    )}
                                </div>
                                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Bookings */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-right">آخر الحجوزات</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4 flex-row-reverse">
                                    <Skeleton className="h-16 w-16 rounded-lg" />
                                    <div className="flex-1 text-right">
                                        <Skeleton className="h-5 w-40 mb-2 ml-auto" />
                                        <Skeleton className="h-4 w-24 ml-auto" />
                                    </div>
                                    <Skeleton className="h-6 w-20" />
                                </div>
                            ))}
                        </div>
                    ) : safeBookings.length > 0 ? (
                        <div className="space-y-4">
                            {safeBookings.slice(0, 5).map((booking) => (
                                <div key={booking.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors flex-row-reverse">
                                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <BedDouble className="h-8 w-8 text-primary" />
                                    </div>
                                    <div className="flex-1 text-right">
                                        <p className="font-semibold">غرفة {booking.room?.room_number}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {booking.check_in} - {booking.check_out}
                                        </p>
                                    </div>
                                    <Badge
                                        variant={
                                            booking.status === 'confirmed' ? 'success' :
                                                booking.status === 'pending' ? 'warning' :
                                                    booking.status === 'cancelled' ? 'destructive' : 'secondary'
                                        }
                                    >
                                        {booking.status === 'confirmed' ? 'مؤكد' :
                                            booking.status === 'pending' ? 'بانتظار التأكيد' :
                                                booking.status === 'cancelled' ? 'ملغي' : 'مكتمل'}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">
                            لا توجد حجوزات حتى الآن. ابدأ التخطيط لعطلتك القادمة!
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
