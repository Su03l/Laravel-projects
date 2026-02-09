'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, BedDouble, Clock, X, ExternalLink, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useMyBookings, useCancelBooking } from '@/lib/api-hooks';
import { formatDate, formatCurrency, getStatusColor, calculateNights } from '@/lib/utils';
import { ReviewModal } from '@/components/review-modal';

export default function BookingsPage() {
    const { data: rawBookings, isLoading } = useMyBookings();
    const bookings = Array.isArray(rawBookings) ? rawBookings : [];
    const cancelBooking = useCancelBooking();
    const [cancelId, setCancelId] = useState<number | null>(null);
    const [reviewBooking, setReviewBooking] = useState<{ id: number; roomNumber: string } | null>(null);

    const handleCancel = async () => {
        if (!cancelId) return;

        try {
            await cancelBooking.mutateAsync(cancelId);
            toast.success('تم إلغاء الحجز بنجاح');
            setCancelId(null);
        } catch {
            toast.error('فشل إلغاء الحجز');
        }
    };

    const canCancel = (checkIn: string) => {
        const checkInDate = new Date(checkIn);
        const now = new Date();
        const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        return hoursUntilCheckIn > 48;
    };

    const getLocalizedStatus = (status: string) => {
        switch (status) {
            case 'confirmed': return 'مؤكد';
            case 'pending': return 'بانتظار التأكيد';
            case 'cancelled': return 'ملغي';
            case 'completed': return 'مكتمل';
            default: return status;
        }
    };

    return (
        <div className="animate-fade-in text-right">
            <div className="flex items-center justify-between mb-8 flex-row-reverse">
                <div>
                    <h1 className="font-display text-3xl font-bold mb-2">حجوزاتي</h1>
                    <p className="text-muted-foreground">
                        عرض وإدارة حجوزاتك الفندقية
                    </p>
                </div>
                <Button asChild>
                    <Link href="/search">حجز إقامة جديدة</Link>
                </Button>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <div className="flex gap-6 flex-row-reverse">
                                    <Skeleton className="w-32 h-32 rounded-xl" />
                                    <div className="flex-1 space-y-3 text-right">
                                        <Skeleton className="h-6 w-48 ml-auto" />
                                        <Skeleton className="h-4 w-32 ml-auto" />
                                        <Skeleton className="h-4 w-64 ml-auto" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : bookings && bookings.length > 0 ? (
                <div className="space-y-4">
                    {bookings.map((booking, index) => (
                        <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex flex-col lg:flex-row gap-6 lg:flex-row-reverse">
                                        {/* Room Image Placeholder */}
                                        <div className="w-full lg:w-32 h-32 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <BedDouble className="h-12 w-12 text-primary" />
                                        </div>

                                        {/* Booking Info */}
                                        <div className="flex-1 text-right">
                                            <div className="flex items-start justify-between mb-2 flex-row-reverse">
                                                <div>
                                                    <h3 className="font-display text-xl font-semibold">
                                                        غرفة {booking.room?.room_number}
                                                    </h3>
                                                    <p className="text-muted-foreground">
                                                        {booking.package?.name || 'الباقة الأساسية'}
                                                    </p>
                                                </div>
                                                <Badge className={getStatusColor(booking.status)}>
                                                    {getLocalizedStatus(booking.status)}
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 rtl:text-right">
                                                <div className="flex items-center gap-2 text-sm justify-end">
                                                    <span>
                                                        {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                                                    </span>
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                <div className="flex items-center gap-2 text-sm justify-end">
                                                    <span>
                                                        {calculateNights(booking.check_in, booking.check_out)} ليالي
                                                    </span>
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                <div className="text-sm flex justify-end gap-2">
                                                    <span className="font-semibold text-primary">
                                                        {formatCurrency(booking.total_price)}
                                                    </span>
                                                    <span className="text-muted-foreground">:الإجمالي</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-row lg:flex-col gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/rooms/${booking.room_id}`}>
                                                    <ExternalLink className="h-4 w-4 ml-2" />
                                                    عرض الغرفة
                                                </Link>
                                            </Button>
                                            {booking.status === 'pending' && canCancel(booking.check_in) && (
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => setCancelId(booking.id)}
                                                >
                                                    <X className="h-4 w-4 ml-2" />
                                                    إلغاء الحجز
                                                </Button>
                                            )}
                                            {booking.status === 'completed' && !booking.review && (
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => setReviewBooking({
                                                        id: booking.id,
                                                        roomNumber: booking.room?.room_number || 'غير معروف'
                                                    })}
                                                >
                                                    <Star className="h-4 w-4 ml-2" />
                                                    تقييم الإقامة
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-12 text-center">
                        <BedDouble className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-display text-xl font-semibold mb-2">لا توجد حجوزات حتى الآن</h3>
                        <p className="text-muted-foreground mb-6">
                            ابدأ التخطيط لعطلتك الفاخرة القادمة!
                        </p>
                        <Button asChild>
                            <Link href="/search">تصفح الغرف</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Cancel Dialog */}
            <Dialog open={!!cancelId} onOpenChange={() => setCancelId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-right">إلغاء الحجز؟</DialogTitle>
                        <DialogDescription className="text-right">
                            هل أنت متأكد أنك تريد إلغاء هذا الحجز؟ هذا الإجراء لا يمكن الرجوع عنه.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setCancelId(null)}>
                            الاحتفاظ بالحجز
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleCancel}
                            disabled={cancelBooking.isPending}
                        >
                            {cancelBooking.isPending ? 'جاري الإلغاء...' : 'نعم، إلغاء الحجز'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Review Modal */}
            {reviewBooking && (
                <ReviewModal
                    bookingId={reviewBooking.id}
                    roomNumber={reviewBooking.roomNumber}
                    isOpen={!!reviewBooking}
                    onClose={() => setReviewBooking(null)}
                />
            )}
        </div>
    );
}
