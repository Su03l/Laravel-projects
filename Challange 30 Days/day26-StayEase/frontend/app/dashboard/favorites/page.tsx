'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Search, BedDouble, Star, Loader2, Clock, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useFavorites, useToggleFavorite } from '@/lib/api-hooks';
import { formatCurrency, getRoomTypeLabel, getRoomViewLabel } from '@/lib/utils';
import type { Room } from '@/lib/types';

export default function FavoritesPage() {
    const [search, setSearch] = useState('');
    const [removingId, setRemovingId] = useState<number | null>(null);

    const { data: rawFavorites, isLoading } = useFavorites();
    const favorites = Array.isArray(rawFavorites) ? rawFavorites : [];
    const toggleFavorite = useToggleFavorite();

    const filteredFavorites = favorites.filter((room: Room) =>
        getRoomTypeLabel(room.type).toLowerCase().includes(search.toLowerCase()) ||
        room.room_number.toLowerCase().includes(search.toLowerCase())
    );

    const handleRemove = async (roomId: number) => {
        setRemovingId(roomId);
        try {
            await toggleFavorite.mutateAsync(roomId);
            toast.success('تم الحذف من المفضلة');
        } catch {
            toast.error('فشل الحذف من المفضلة');
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <div className="animate-fade-in text-right">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 flex-row-reverse">
                <div>
                    <h1 className="font-display text-3xl font-bold mb-2">المفضلة</h1>
                    <p className="text-muted-foreground">
                        الغرف التي قمت بحفظها لوقت لاحق
                    </p>
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="بحث في المفضلة..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pr-10 text-right"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="overflow-hidden">
                            <Skeleton className="h-48 w-full" />
                            <CardContent className="p-4">
                                <Skeleton className="h-5 w-3/4 mb-2 ml-auto" />
                                <Skeleton className="h-4 w-1/2 mb-4 ml-auto" />
                                <Skeleton className="h-8 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : filteredFavorites && filteredFavorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFavorites.map((room: Room, index: number) => (
                        <motion.div
                            key={room.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="overflow-hidden group">
                                <div className="relative h-48">
                                    <Image
                                        src={room.images?.[0]?.url || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070'}
                                        alt={`غرفة ${room.room_number}`}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 to-transparent" />
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="absolute top-3 left-3 h-9 w-9 rounded-full"
                                        onClick={() => handleRemove(room.id)}
                                        disabled={removingId === room.id}
                                    >
                                        {removingId === room.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                                        )}
                                    </Button>
                                    <div className="absolute bottom-3 right-3 flex gap-2">
                                        <Badge className="bg-white/90 text-stone-900">
                                            {getRoomViewLabel(room.view)}
                                        </Badge>
                                        <Badge className="bg-white/90 text-stone-900">
                                            <Star className="h-3 w-3 ml-1 fill-amber-400 text-amber-400" />
                                            {room.average_rating}
                                        </Badge>
                                    </div>
                                </div>
                                <CardContent className="p-4 text-right">
                                    <h3 className="font-display text-lg font-semibold mb-1">
                                        {getRoomTypeLabel(room.type)}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        غرفة {room.room_number} • الدور {room.floor}
                                    </p>
                                    <div className="flex items-center justify-between flex-row-reverse">
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">لليلة الواحدة</p>
                                            <p className="text-lg font-bold text-primary">
                                                {formatCurrency(room.price_per_night)}
                                            </p>
                                        </div>
                                        <Link href={`/rooms/${room.id}`}>
                                            <Button size="sm">عرض التفاصيل</Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <Card className="p-12 text-center">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-display text-xl font-semibold mb-2">قائمة المفضلة فارغة</h3>
                    <p className="text-muted-foreground mb-6">
                        ابدأ بتصفح الغرف واحفظ ما يعجبك لوقت لاحق
                    </p>
                    <Link href="/search">
                        <Button>
                            <BedDouble className="h-4 w-4 ml-2" />
                            تصفح الغرف
                        </Button>
                    </Link>
                </Card>
            )}
        </div>
    );
}
