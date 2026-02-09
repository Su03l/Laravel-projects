'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Coffee, UtensilsCrossed, ShoppingBag, Plus, Minus,
    Loader2, Clock, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useMyBookings, useServiceMenu, useOrderService, useBookingOrders } from '@/lib/api-hooks';
import { formatCurrency } from '@/lib/utils';
import type { Booking, Service } from '@/lib/types';

interface CartItem {
    service: Service;
    quantity: number;
}

export default function RoomServicePage() {
    const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isOrdering, setIsOrdering] = useState(false);

    const { data: rawBookings, isLoading: bookingsLoading } = useMyBookings();
    const bookings = Array.isArray(rawBookings) ? rawBookings : [];

    const { data: rawMenu, isLoading: menuLoading } = useServiceMenu();
    const menu = Array.isArray(rawMenu) ? rawMenu : [];

    const orderService = useOrderService();
    const { data: rawOrders } = useBookingOrders(selectedBookingId || 0);
    const orders = Array.isArray(rawOrders) ? rawOrders : [];

    // Filter only active bookings (confirmed and within date range)
    const activeBookings = bookings.filter((b: Booking) =>
        b.status === 'confirmed' && new Date(b.check_out) >= new Date()
    );

    const addToCart = (service: Service) => {
        const existing = cart.find(item => item.service.id === service.id);
        if (existing) {
            setCart(cart.map(item =>
                item.service.id === service.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { service, quantity: 1 }]);
        }
    };

    const removeFromCart = (serviceId: number) => {
        const existing = cart.find(item => item.service.id === serviceId);
        if (existing && existing.quantity > 1) {
            setCart(cart.map(item =>
                item.service.id === serviceId
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            ));
        } else {
            setCart(cart.filter(item => item.service.id !== serviceId));
        }
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.service.price * item.quantity, 0);

    const handleOrder = async () => {
        if (!selectedBookingId || cart.length === 0) return;

        setIsOrdering(true);
        try {
            await orderService.mutateAsync({
                booking_id: selectedBookingId,
                items: cart.map(item => ({
                    service_id: item.service.id,
                    quantity: item.quantity,
                })),
            });
            toast.success('تم إرسال الطب بنجاح!');
            setCart([]);
        } catch {
            toast.error('فشل إرسال الطلب');
        } finally {
            setIsOrdering(false);
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'breakfast': return Coffee;
            case 'food': return UtensilsCrossed;
            default: return ShoppingBag;
        }
    };

    const getLocalizedCategory = (category: string) => {
        switch (category) {
            case 'breakfast': return 'فطور';
            case 'food': return 'مأكولات';
            case 'drinks': return 'مشروبات';
            default: return category;
        }
    };

    // Group menu items by category
    const menuByCategory = menu?.reduce((acc: Record<string, Service[]>, item: Service) => {
        const cat = item.category || 'other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {} as Record<string, Service[]>) || {};

    return (
        <div className="animate-fade-in text-right">
            <div className="mb-8">
                <h1 className="font-display text-3xl font-bold mb-2">خدمة الغرف</h1>
                <p className="text-muted-foreground">
                    اطلب الطعام والمشروبات والخدمات مباشرة إلى غرفتك
                </p>
            </div>

            {/* Booking Selector */}
            <Card className="mb-8">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between flex-row-reverse">
                        <div className="text-right">
                            <h2 className="font-semibold mb-1">اختر حجزك النشط</h2>
                            <p className="text-sm text-muted-foreground">
                                اختر الحجز الذي تريد طلب الخدمة له
                            </p>
                        </div>
                        {bookingsLoading ? (
                            <Skeleton className="h-10 w-[200px]" />
                        ) : activeBookings.length > 0 ? (
                            <Select
                                value={selectedBookingId?.toString() || ''}
                                onValueChange={(val) => setSelectedBookingId(Number(val))}
                            >
                                <SelectTrigger className="w-[280px] flex-row-reverse">
                                    <SelectValue placeholder="اختر الحجز" />
                                </SelectTrigger>
                                <SelectContent align="end">
                                    {activeBookings.map((booking: Booking) => (
                                        <SelectItem key={booking.id} value={booking.id.toString()}>
                                            غرفة {booking.room?.room_number} • {booking.check_in}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <Badge variant="secondary">لا توجد حجوزات نشطة</Badge>
                        )}
                    </div>
                </CardContent>
            </Card>

            {selectedBookingId ? (
                <div className="grid lg:grid-cols-3 gap-8 ">
                    {/* Cart & Orders - Swapped Order for RTL visual flow */}
                    <div className="space-y-6 lg:order-last">
                        {/* Cart */}
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 flex-row-reverse">
                                    <ShoppingBag className="h-5 w-5" />
                                    <span>طلباتك</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {cart.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-8">
                                        السلة فارغة
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {cart.map((item) => (
                                            <div key={item.service.id} className="flex justify-between items-center flex-row-reverse">
                                                <div className="text-right">
                                                    <p className="font-medium">{item.service.name}</p>
                                                    <p className="text-sm text-muted-foreground" dir="ltr">
                                                        {formatCurrency(item.service.price)} × {item.quantity}
                                                    </p>
                                                </div>
                                                <p className="font-semibold">
                                                    {formatCurrency(item.service.price * item.quantity)}
                                                </p>
                                            </div>
                                        ))}
                                        <Separator />
                                        <div className="flex justify-between font-bold text-lg flex-row-reverse">
                                            <span>الإجمالي</span>
                                            <span className="text-primary">{formatCurrency(cartTotal)}</span>
                                        </div>
                                        <Button
                                            className="w-full"
                                            onClick={handleOrder}
                                            disabled={isOrdering}
                                        >
                                            {isOrdering && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
                                            إرسال الطلب
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent Orders */}
                        {orders && orders.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 flex-row-reverse">
                                        <Clock className="h-5 w-5" />
                                        <span>آخر الطلبات</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {orders.slice(0, 5).map((order: { service?: { name: string }; status: string; created_at: string }, index: number) => (
                                            <div key={index} className="flex items-center gap-3 text-sm flex-row-reverse">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                <div className="flex-1 text-right">
                                                    <p className="font-medium">{order.service?.name}</p>
                                                    <p className="text-muted-foreground">
                                                        {order.status} • {new Date(order.created_at).toLocaleTimeString('ar-SA')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Menu - Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {menuLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <Card key={i}>
                                        <CardContent className="p-4">
                                            <Skeleton className="h-20 w-full" />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            Object.entries(menuByCategory).map(([category, items]) => {
                                const Icon = getCategoryIcon(category);
                                return (
                                    <div key={category}>
                                        <h3 className="font-display text-xl font-semibold mb-4 flex items-center gap-2 capitalize justify-end">
                                            <span>{getLocalizedCategory(category)}</span>
                                            <Icon className="h-5 w-5" />
                                        </h3>
                                        <div className="grid gap-4">
                                            {(items as Service[]).map((item, index) => {
                                                const inCart = cart.find(c => c.service.id === item.id);
                                                return (
                                                    <motion.div
                                                        key={item.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                    >
                                                        <Card>
                                                            <CardContent className="p-4">
                                                                <div className="flex items-center gap-4 flex-row-reverse">
                                                                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                                                                        <Icon className="h-6 w-6 text-muted-foreground" />
                                                                    </div>
                                                                    <div className="flex-1 text-right">
                                                                        <h4 className="font-semibold">{item.name}</h4>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            {item.description || 'طازج ولذيذ'}
                                                                        </p>
                                                                    </div>
                                                                    <div className="text-left">
                                                                        <p className="font-bold text-primary mb-2">
                                                                            {formatCurrency(item.price)}
                                                                        </p>
                                                                        {inCart ? (
                                                                            <div className="flex items-center gap-2">
                                                                                <Button
                                                                                    size="icon"
                                                                                    variant="outline"
                                                                                    className="h-8 w-8"
                                                                                    onClick={() => addToCart(item)}
                                                                                >
                                                                                    <Plus className="h-4 w-4" />
                                                                                </Button>
                                                                                <span className="w-8 text-center font-semibold">
                                                                                    {inCart.quantity}
                                                                                </span>
                                                                                <Button
                                                                                    size="icon"
                                                                                    variant="outline"
                                                                                    className="h-8 w-8"
                                                                                    onClick={() => removeFromCart(item.id)}
                                                                                >
                                                                                    <Minus className="h-4 w-4" />
                                                                                </Button>
                                                                            </div>
                                                                        ) : (
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={() => addToCart(item)}
                                                                            >
                                                                                <Plus className="h-4 w-4 ml-1" />
                                                                                إضافة
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            ) : (
                <Card className="p-12 text-center">
                    <UtensilsCrossed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-display text-xl font-semibold mb-2">اختر حجزاً</h3>
                    <p className="text-muted-foreground">
                        الرجاء اختيار حجز نشط لتصفح قائمة خدمة الغرف
                    </p>
                </Card>
            )}
        </div>
    );
}
