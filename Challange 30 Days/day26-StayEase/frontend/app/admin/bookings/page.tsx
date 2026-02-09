'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, Filter, X, Loader2, User, BedDouble } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useAdminBookings, useUpdateBookingStatus } from '@/lib/api-hooks';
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils';
import type { BookingStatus } from '@/lib/types';

export default function AdminBookingsPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [cancelDialog, setCancelDialog] = useState<number | null>(null);

    const { data: rawBookings, isLoading } = useAdminBookings({ status: statusFilter === 'all' ? undefined : statusFilter as BookingStatus });
    const bookings = Array.isArray(rawBookings) ? rawBookings : [];
    const updateStatus = useUpdateBookingStatus();

    const filteredBookings = bookings?.filter(booking => {
        const matchesSearch =
            booking.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
            booking.room?.room_number?.toLowerCase().includes(search.toLowerCase());
        return matchesSearch;
    });

    const handleForceCancel = async () => {
        if (!cancelDialog) return;

        try {
            await updateStatus.mutateAsync({
                bookingId: cancelDialog,
                status: 'cancelled',
            });
            toast.success('تم إلغاء الحجز');
            setCancelDialog(null);
        } catch {
            toast.error('فشل إلغاء الحجز');
        }
    };

    const handleStatusChange = async (bookingId: number, status: BookingStatus) => {
        try {
            await updateStatus.mutateAsync({ bookingId, status });
            toast.success('تم تحديث حالة الحجز');
        } catch {
            toast.error('فشل تحديث الحالة');
        }
    };

    const statusOptions: BookingStatus[] = ['pending', 'confirmed', 'cancelled', 'completed'];

    const getLocalizedStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'معلق';
            case 'confirmed': return 'مؤكد';
            case 'cancelled': return 'ملغي';
            case 'completed': return 'مكتمل';
            default: return status;
        }
    };

    return (
        <div className="animate-fade-in text-right">
            <div className="flex items-center justify-between mb-8 flex-row-reverse">
                <div>
                    <h1 className="font-display text-3xl font-bold mb-2">إدارة الحجوزات</h1>
                    <p className="text-muted-foreground">
                        عرض وإدارة جميع حجوزات الفندق
                    </p>
                </div>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="بحث باسم الضيف أو الغرفة..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pr-10 text-right"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px] flex-row-reverse">
                                <Filter className="h-4 w-4 ml-2" />
                                <SelectValue placeholder="تصفية حسب الحالة" />
                            </SelectTrigger>
                            <SelectContent align="end">
                                <SelectItem value="all">كل الحالات</SelectItem>
                                {statusOptions.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {getLocalizedStatusLabel(status)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Bookings Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-right">كل الحجوزات ({filteredBookings?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg flex-row-reverse">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="flex-1 text-right">
                                        <Skeleton className="h-5 w-32 mb-2 ml-auto" />
                                        <Skeleton className="h-4 w-48 ml-auto" />
                                    </div>
                                    <Skeleton className="h-8 w-24" />
                                </div>
                            ))}
                        </div>
                    ) : filteredBookings && filteredBookings.length > 0 ? (
                        <div className="space-y-3">
                            {filteredBookings.map((booking, index) => (
                                <motion.div
                                    key={booking.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="flex flex-col lg:flex-row lg:items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors text-right lg:flex-row-reverse"
                                >
                                    {/* Guest Info */}
                                    <div className="flex items-center gap-3 min-w-[200px] flex-row-reverse justify-end">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <User className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{booking.user?.name || 'ضيف'}</p>
                                            <p className="text-sm text-muted-foreground">{booking.user?.email}</p>
                                        </div>
                                    </div>

                                    {/* Room Info */}
                                    <div className="flex items-center gap-3 min-w-[150px] flex-row-reverse justify-end">
                                        <BedDouble className="h-4 w-4 text-muted-foreground" />
                                        <span>غرفة {booking.room?.room_number}</span>
                                    </div>

                                    {/* Dates */}
                                    <div className="flex items-center gap-3 flex-1 flex-row-reverse justify-end">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <div className="font-semibold text-primary min-w-[100px]">
                                        {formatCurrency(booking.total_price)}
                                    </div>

                                    {/* Status & Actions */}
                                    <div className="flex items-center gap-2 flex-row-reverse">
                                        <Select
                                            value={booking.status}
                                            onValueChange={(value: BookingStatus) =>
                                                handleStatusChange(booking.id, value)
                                            }
                                        >
                                            <SelectTrigger className={`w-[130px] ${getStatusColor(booking.status)}`}>
                                                <SelectValue>
                                                    {getLocalizedStatusLabel(booking.status)}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent align="end">
                                                {statusOptions.map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {getLocalizedStatusLabel(status)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => setCancelDialog(booking.id)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">لا توجد حجوزات</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Cancel Confirmation Dialog */}
            <Dialog open={!!cancelDialog} onOpenChange={() => setCancelDialog(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-right">إلغاء الحجز بالقوة</DialogTitle>
                        <DialogDescription className="text-right">
                            هل أنت متأكد من إلغاء هذا الحجز؟ لا يمكن التراجع عن هذا الإجراء.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setCancelDialog(null)}>
                            إبقاء الحجز
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleForceCancel}
                            disabled={updateStatus.isPending}
                        >
                            {updateStatus.isPending ? (
                                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                            ) : (
                                <X className="h-4 w-4 ml-2" />
                            )}
                            إلغاء بالقوة
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
