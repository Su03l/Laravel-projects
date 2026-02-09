'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Star, Users, Maximize, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useRooms } from '@/lib/api-hooks';
import { formatCurrency, getRoomTypeLabel, getRoomViewLabel } from '@/lib/utils';
import type { RoomType, RoomView, SearchFilters } from '@/lib/types';

function SearchContent() {
    const searchParams = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState<SearchFilters>({
        check_in: searchParams?.get('check_in') || '',
        check_out: searchParams?.get('check_out') || '',
        type: (searchParams?.get('type') as RoomType) || undefined,
        view: (searchParams?.get('view') as RoomView) || undefined,
        min_price: searchParams?.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
        max_price: searchParams?.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
    });

    const { data: rawRooms, isLoading } = useRooms(filters);
    const rooms = Array.isArray(rawRooms) ? rawRooms : [];

    const roomTypes: RoomType[] = ['standard', 'double', 'suite', 'royal_suite', 'honeymoon'];
    const roomViews: RoomView[] = ['city', 'sea', 'pool', 'garden'];

    const clearFilters = () => {
        setFilters({
            check_in: '',
            check_out: '',
            type: undefined,
            view: undefined,
            min_price: undefined,
            max_price: undefined,
        });
    };

    const hasActiveFilters = filters.type || filters.view || filters.min_price || filters.max_price;

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8 text-right">
                    <h1 className="font-display text-4xl font-bold mb-2">جد غرفتك المثالية</h1>
                    <p className="text-muted-foreground">
                        تصفح مجموعتنا المختارة من الغرف والأجنحة الفاخرة
                    </p>
                </div>

                <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                    {/* Filters Sidebar */}
                    <aside className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <Card className="sticky top-24">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-6 flex-row-reverse">
                                    <h2 className="font-semibold flex items-center gap-2 flex-row-reverse">
                                        <SlidersHorizontal className="h-4 w-4" />
                                        تصفية
                                    </h2>
                                    {hasActiveFilters && (
                                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                                            مسح الكل
                                        </Button>
                                    )}
                                </div>

                                <div className="space-y-6 text-right">
                                    {/* Dates */}
                                    <div className="space-y-3">
                                        <Label>تاريخ الوصول</Label>
                                        <Input
                                            type="date"
                                            className="text-right"
                                            value={filters.check_in}
                                            onChange={(e) => setFilters({ ...filters, check_in: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label>تاريخ المغادرة</Label>
                                        <Input
                                            type="date"
                                            className="text-right"
                                            value={filters.check_out}
                                            onChange={(e) => setFilters({ ...filters, check_out: e.target.value })}
                                        />
                                    </div>

                                    <Separator />

                                    {/* Room Type */}
                                    <div className="space-y-3">
                                        <Label>نوع الغرفة</Label>
                                        <Select
                                            value={filters.type || 'all'}
                                            onValueChange={(value) =>
                                                setFilters({ ...filters, type: value === 'all' ? undefined : value as RoomType })
                                            }
                                        >
                                            <SelectTrigger className="flex-row-reverse">
                                                <SelectValue placeholder="جميع الأنواع" />
                                            </SelectTrigger>
                                            <SelectContent align="end">
                                                <SelectItem value="all" className="flex-row-reverse justify-end">جميع الأنواع</SelectItem>
                                                {roomTypes.map((type) => (
                                                    <SelectItem key={type} value={type} className="flex-row-reverse justify-end">
                                                        {getRoomTypeLabel(type)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Room View */}
                                    <div className="space-y-3">
                                        <Label>الإطلالة</Label>
                                        <Select
                                            value={filters.view || 'all'}
                                            onValueChange={(value) =>
                                                setFilters({ ...filters, view: value === 'all' ? undefined : value as RoomView })
                                            }
                                        >
                                            <SelectTrigger className="flex-row-reverse">
                                                <SelectValue placeholder="جميع الإطلالات" />
                                            </SelectTrigger>
                                            <SelectContent align="end">
                                                <SelectItem value="all" className="flex-row-reverse justify-end">جميع الإطلالات</SelectItem>
                                                {roomViews.map((view) => (
                                                    <SelectItem key={view} value={view} className="flex-row-reverse justify-end">
                                                        {getRoomViewLabel(view)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Separator />

                                    {/* Price Range */}
                                    <div className="space-y-3">
                                        <Label>نطاق السعر</Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Input
                                                type="number"
                                                placeholder="من"
                                                className="text-right"
                                                value={filters.min_price || ''}
                                                onChange={(e) =>
                                                    setFilters({ ...filters, min_price: e.target.value ? Number(e.target.value) : undefined })
                                                }
                                            />
                                            <Input
                                                type="number"
                                                placeholder="إلى"
                                                className="text-right"
                                                value={filters.max_price || ''}
                                                onChange={(e) =>
                                                    setFilters({ ...filters, max_price: e.target.value ? Number(e.target.value) : undefined })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Room Grid */}
                    <div className="lg:col-span-3">
                        {/* Mobile Filter Toggle */}
                        <div className="lg:hidden mb-4">
                            <Button
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                {showFilters ? (
                                    <>
                                        <X className="h-4 w-4" />
                                        إخفاء الفلاتر
                                    </>
                                ) : (
                                    <>
                                        <SlidersHorizontal className="h-4 w-4" />
                                        إظهار الفلاتر
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Results Count */}
                        <div className="flex items-center justify-between mb-6 flex-row-reverse">
                            <p className="text-muted-foreground">
                                {isLoading ? 'جاري التحميل...' : `تم العثور على ${rooms?.length || 0} غرفة`}
                            </p>
                        </div>

                        {/* Loading State */}
                        {isLoading && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <Card key={i} className="overflow-hidden">
                                        <Skeleton className="h-56 w-full" />
                                        <CardContent className="p-5 text-right">
                                            <Skeleton className="h-6 w-3/4 mb-2 ml-auto" />
                                            <Skeleton className="h-4 w-1/2 mb-4 ml-auto" />
                                            <div className="flex justify-between flex-row-reverse">
                                                <Skeleton className="h-4 w-20" />
                                                <Skeleton className="h-6 w-24" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Room Cards */}
                        {!isLoading && rooms && Array.isArray(rooms) && rooms.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {rooms.map((room, index) => (
                                    <motion.div
                                        key={room.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link href={`/rooms/${room.id}`}>
                                            <Card className="overflow-hidden group cursor-pointer h-full text-right">
                                                <div className="relative h-56 overflow-hidden">
                                                    <Image
                                                        src={room.images?.[0]?.url || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070'}
                                                        alt={`Room ${room.room_number}`}
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, 50vw"
                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 to-transparent" />
                                                    <div className="absolute top-4 right-4">
                                                        <Badge className="bg-white/90 text-stone-900">
                                                            {getRoomViewLabel(room.view)}
                                                        </Badge>
                                                    </div>
                                                    <div className="absolute top-4 left-4">
                                                        <Badge className="bg-white/90 text-stone-900 flex items-center gap-1">
                                                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                            {room.average_rating}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <CardContent className="p-5">
                                                    <h3 className="font-display text-xl font-semibold mb-1">
                                                        {getRoomTypeLabel(room.type)}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground mb-4">
                                                        غرفة {room.room_number} • الدور {room.floor}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 flex-row-reverse justify-start">
                                                        <span className="flex items-center gap-1 flex-row-reverse">
                                                            <Users className="h-4 w-4" />
                                                            {room.capacity_adults} بالغين
                                                        </span>
                                                        <span className="flex items-center gap-1 flex-row-reverse">
                                                            <Maximize className="h-4 w-4" />
                                                            {room.size_sqm} م²
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between flex-row-reverse">
                                                        <p className="text-xs text-muted-foreground">لليلة الواحدة</p>
                                                        <p className="text-xl font-bold text-primary">
                                                            {formatCurrency(room.price_per_night)}
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && (!rooms || rooms.length === 0) && (
                            <Card className="p-12 text-center">
                                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="font-display text-xl font-semibold mb-2">لا توجد غرف متاحة</h3>
                                <p className="text-muted-foreground mb-6">
                                    جرب تغيير الفلاتر أو معايير البحث
                                </p>
                                <Button onClick={clearFilters}>إعادة تعيين الفلاتر</Button>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center">جاري التحميل...</div>}>
            <SearchContent />
        </Suspense>
    );
}
