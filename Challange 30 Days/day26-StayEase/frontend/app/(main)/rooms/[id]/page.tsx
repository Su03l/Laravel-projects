'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Star, Users, Maximize, MapPin, Heart, Share2,
    ChevronLeft, ChevronRight, Calendar, Check, Wifi,
    Tv, Wind, Coffee, Bath, Utensils
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRoom, useRoomReviews, useToggleFavorite } from '@/lib/api-hooks';
import { useAuthStore } from '@/lib/auth-store';
import { formatCurrency, formatDate, getRoomTypeLabel, getRoomViewLabel, calculateNights, getLocalizedAmenity } from '@/lib/utils';

const amenityIcons: Record<string, React.ElementType> = {
    wifi: Wifi,
    tv: Tv,
    'air-conditioning': Wind,
    'coffee-maker': Coffee,
    bathtub: Bath,
    'room-service': Utensils,
};

export default function RoomDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const roomId = params?.id as string;

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');

    const { isAuthenticated } = useAuthStore();
    const { data: room, isLoading: roomLoading } = useRoom(roomId);
    const { data: reviews } = useRoomReviews(roomId);
    const toggleFavorite = useToggleFavorite();

    const handleFavorite = () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        toggleFavorite.mutate(Number(roomId), {
            onSuccess: () => toast.success('تم التحديث في المفضلة'),
        });
    };

    const handleBooking = () => {
        if (!checkIn || !checkOut) {
            toast.error('الرجاء تحديد تواريخ الحجز');
            return;
        }
        if (!isAuthenticated) {
            router.push(`/login?redirect=/book/${roomId}?check_in=${checkIn}&check_out=${checkOut}`);
            return;
        }
        router.push(`/book/${roomId}?check_in=${checkIn}&check_out=${checkOut}`);
    };

    const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;
    const totalPrice = room ? room.price_per_night * nights : 0;

    const images = room?.images?.length
        ? room.images.map(img => img.url)
        : [
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070',
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1974',
            'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1974',
        ];

    if (roomLoading) {
        return (
            <div className="min-h-screen pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <Skeleton className="h-[500px] w-full rounded-2xl mb-8" />
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Skeleton className="h-10 w-3/4" />
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-40 w-full" />
                        </div>
                        <Skeleton className="h-96 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="font-display text-2xl font-bold mb-2">الغرفة غير موجودة</h1>
                    <p className="text-muted-foreground mb-4">هذه الغرفة غير موجودة أو تم إزالتها.</p>
                    <Button asChild>
                        <Link href="/search">تصفح الغرف</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4">
                {/* Image Gallery */}
                <div className="relative h-[500px] rounded-2xl overflow-hidden mb-8">
                    <Image
                        src={images[currentImageIndex]}
                        alt={`Room ${room.room_number}`}
                        fill
                        className="object-cover"
                    />

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={() => setCurrentImageIndex(i => i === 0 ? images.length - 1 : i - 1)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                            <button
                                onClick={() => setCurrentImageIndex(i => i === images.length - 1 ? 0 : i + 1)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        </>
                    )}

                    {/* Image Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentImageIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="absolute top-4 left-4 flex gap-2">
                        <Button size="icon" variant="secondary" onClick={handleFavorite}>
                            <Heart className={`h-4 w-4 ${toggleFavorite.isPending ? 'animate-pulse' : ''}`} />
                        </Button>
                        <Button size="icon" variant="secondary">
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8 text-right">
                        {/* Header */}
                        <div>
                            <div className="flex items-center gap-2 mb-2 flex-row-reverse justify-start">
                                <Badge>{getRoomViewLabel(room.view)}</Badge>
                                <Badge variant="outline">غرفة {room.room_number}</Badge>
                            </div>
                            <h1 className="font-display text-4xl font-bold mb-2">
                                {getRoomTypeLabel(room.type)}
                            </h1>
                            <div className="flex items-center gap-4 text-muted-foreground flex-row-reverse justify-start">
                                <span className="flex items-center gap-1 flex-row-reverse">
                                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    {room.average_rating} ({reviews?.length || 0} تقييم)
                                </span>
                                <span className="flex items-center gap-1 flex-row-reverse">
                                    <MapPin className="h-4 w-4" />
                                    الدور {room.floor}
                                </span>
                            </div>
                        </div>

                        <Separator />

                        {/* Quick Info */}
                        <div className="grid grid-cols-3 gap-4">
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                                    <p className="font-semibold">{room.capacity_adults} بالغين</p>
                                    <p className="text-sm text-muted-foreground">+ {room.capacity_kids} أطفال</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <Maximize className="h-6 w-6 mx-auto mb-2 text-primary" />
                                    <p className="font-semibold">{room.size_sqm} م²</p>
                                    <p className="text-sm text-muted-foreground">مساحة الغرفة</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <Star className="h-6 w-6 mx-auto mb-2 text-primary" />
                                    <p className="font-semibold">{room.average_rating}</p>
                                    <p className="text-sm text-muted-foreground">التقييم</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Amenities */}
                        {room.amenities && room.amenities.length > 0 && (
                            <div>
                                <h2 className="font-display text-2xl font-semibold mb-4">المرافق</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {room.amenities.map((amenity) => {
                                        const Icon = amenityIcons[amenity.icon || 'wifi'] || Check;
                                        return (
                                            <div key={amenity.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 flex-row-reverse justify-end">
                                                <span>{getLocalizedAmenity(amenity.name)}</span>
                                                <Icon className="h-5 w-5 text-primary" />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <Separator />

                        {/* Reviews */}
                        <div>
                            <h2 className="font-display text-2xl font-semibold mb-4">آراء الضيوف</h2>
                            {reviews && reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {reviews.slice(0, 5).map((review) => (
                                        <motion.div
                                            key={review.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <Card>
                                                <CardContent className="p-4 text-right">
                                                    <div className="flex items-start gap-4 flex-row-reverse">
                                                        <Avatar>
                                                            <AvatarImage src={review.user?.avatar} />
                                                            <AvatarFallback>
                                                                {review.user?.name?.charAt(0).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between mb-1 flex-row-reverse">
                                                                <p className="font-semibold">{review.user?.name}</p>
                                                                <div className="flex items-center gap-1">
                                                                    {Array.from({ length: review.rating }).map((_, i) => (
                                                                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground mb-2">
                                                                {formatDate(review.created_at)}
                                                            </p>
                                                            <p className="text-muted-foreground">{review.comment}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">لا توجد تقييمات بعد.</p>
                            )}
                        </div>
                    </div>

                    {/* Booking Widget */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between flex-row-reverse">
                                    <span>
                                        {formatCurrency(room.price_per_night)}
                                        <span className="text-sm font-normal text-muted-foreground"> / ليلة</span>
                                    </span>
                                    <Badge variant="outline" className="flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                        {room.average_rating}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-right">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label>تسجيل الوصول</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="date"
                                                className="pl-10 text-right"
                                                value={checkIn}
                                                onChange={(e) => setCheckIn(e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>المغادرة</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="date"
                                                className="pl-10 text-right"
                                                value={checkOut}
                                                onChange={(e) => setCheckOut(e.target.value)}
                                                min={checkIn || new Date().toISOString().split('T')[0]}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {nights > 0 && (
                                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                                        <div className="flex justify-between flex-row-reverse">
                                            <span>{formatCurrency(room.price_per_night)} × {nights} ليال</span>
                                            <span>{formatCurrency(totalPrice)}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between font-semibold flex-row-reverse">
                                            <span>المجموع</span>
                                            <span className="text-primary">{formatCurrency(totalPrice)}</span>
                                        </div>
                                    </div>
                                )}

                                <Button
                                    size="lg"
                                    className="w-full"
                                    onClick={handleBooking}
                                    disabled={!checkIn || !checkOut}
                                >
                                    {isAuthenticated ? 'احجز الآن' : 'سجل دخولك للحجز'}
                                </Button>

                                <p className="text-xs text-center text-muted-foreground">
                                    لن يتم خصم المبلغ الآن
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
