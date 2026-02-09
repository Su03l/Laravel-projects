'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BedDouble, Search, Filter, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { useRooms, useUpdateRoomStatus } from '@/lib/api-hooks';
import { formatCurrency, getRoomTypeLabel, getRoomStatusLabel, getStatusColor } from '@/lib/utils';
import type { RoomStatus } from '@/lib/types';

export default function AdminRoomsPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [updateDialog, setUpdateDialog] = useState<{ roomId: number; status: RoomStatus } | null>(null);

    const { data: rawRooms, isLoading } = useRooms({});
    const rooms = Array.isArray(rawRooms) ? rawRooms : [];
    const updateStatus = useUpdateRoomStatus();

    const filteredRooms = rooms?.filter(room => {
        const matchesSearch = room.room_number.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleStatusUpdate = async () => {
        if (!updateDialog) return;

        try {
            await updateStatus.mutateAsync({
                roomId: updateDialog.roomId,
                status: updateDialog.status,
            });
            toast.success('تم تحديث حالة الغرفة');
            setUpdateDialog(null);
        } catch {
            toast.error('فشل تحديث حالة الغرفة');
        }
    };

    const statusOptions: RoomStatus[] = ['available', 'occupied', 'maintenance', 'disabled'];

    const getLocalizedStatusLabel = (status: string) => {
        switch (status) {
            case 'available': return 'متاحة';
            case 'occupied': return 'مشغولة';
            case 'maintenance': return 'صيانة';
            case 'disabled': return 'معطلة';
            default: return status;
        }
    };

    return (
        <div className="animate-fade-in text-right">
            <div className="flex items-center justify-between mb-8 flex-row-reverse">
                <div>
                    <h1 className="font-display text-3xl font-bold mb-2">إدارة الغرف</h1>
                    <p className="text-muted-foreground">
                        إدارة حالة الغرف وتوافرها
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
                                placeholder="بحث برقم الغرفة..."
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

            {/* Rooms Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-right">كل الغرف ({filteredRooms?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg flex-row-reverse">
                                    <Skeleton className="h-12 w-12 rounded-lg" />
                                    <div className="flex-1 text-right">
                                        <Skeleton className="h-5 w-32 mb-2 ml-auto" />
                                        <Skeleton className="h-4 w-48 ml-auto" />
                                    </div>
                                    <Skeleton className="h-8 w-24" />
                                </div>
                            ))}
                        </div>
                    ) : filteredRooms && filteredRooms.length > 0 ? (
                        <div className="space-y-3">
                            {filteredRooms.map((room, index) => (
                                <motion.div
                                    key={room.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors flex-row-reverse"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <BedDouble className="h-6 w-6 text-primary" />
                                    </div>

                                    <div className="flex-1 text-right">
                                        <div className="flex items-center gap-2 mb-1 justify-end">
                                            <Badge variant="outline">{getRoomTypeLabel(room.type)}</Badge>
                                            <h4 className="font-semibold">غرفة {room.room_number}</h4>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            الدور {room.floor} • {room.capacity_adults} كبار • {formatCurrency(room.price_per_night)}/ليلة
                                        </p>
                                    </div>

                                    <Select
                                        value={room.status}
                                        onValueChange={(value: RoomStatus) =>
                                            setUpdateDialog({ roomId: room.id, status: value })
                                        }
                                    >
                                        <SelectTrigger className={`w-[140px] ${getStatusColor(room.status)}`}>
                                            <SelectValue>
                                                {getLocalizedStatusLabel(room.status)}
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
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <BedDouble className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">لا توجد غرف</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Confirmation Dialog */}
            <Dialog open={!!updateDialog} onOpenChange={() => setUpdateDialog(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-right">تحديث حالة الغرفة</DialogTitle>
                        <DialogDescription className="text-right">
                            هل أنت متأكد من تغيير حالة الغرفة إلى {updateDialog ? getLocalizedStatusLabel(updateDialog.status) : ''}؟
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setUpdateDialog(null)}>
                            <X className="h-4 w-4 ml-2" />
                            إلغاء
                        </Button>
                        <Button onClick={handleStatusUpdate} disabled={updateStatus.isPending}>
                            {updateStatus.isPending ? (
                                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                            ) : (
                                <Check className="h-4 w-4 ml-2" />
                            )}
                            تأكيد
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
