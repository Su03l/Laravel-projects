'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, Check, Calendar,
    Package, CreditCard, Loader2, Star
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useRoom, usePackages, useCreateBooking } from '@/lib/api-hooks';
import { useAuthStore } from '@/lib/auth-store';
import { formatCurrency, calculateNights, getRoomTypeLabel } from '@/lib/utils';

const bookingSchema = z.object({
    check_in: z.string().min(1, 'تاريخ الوصول مطلوب'),
    check_out: z.string().min(1, 'تاريخ المغادرة مطلوب'),
    package_id: z.number().min(1, 'الرجاء اختيار الباقة'),
    coupon_code: z.string().optional(),
    notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const steps = [
    { id: 1, title: 'التواريخ', icon: Calendar },
    { id: 2, title: 'الباقة', icon: Package },
    { id: 3, title: 'تأكيد', icon: CreditCard },
];

interface BookingContentProps {
    id: string;
}

function BookingContent({ id }: BookingContentProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const { user } = useAuthStore();
    const { data: room } = useRoom(id);
    const { data: packages } = usePackages();
    const createBooking = useCreateBooking();

    const form = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            check_in: searchParams?.get('check_in') || '',
            check_out: searchParams?.get('check_out') || '',
            package_id: 1,
            coupon_code: '',
            notes: '',
        },
    });

    const watchedValues = form.watch();
    const nights = watchedValues.check_in && watchedValues.check_out
        ? calculateNights(watchedValues.check_in, watchedValues.check_out)
        : 0;

    const selectedPackage = packages?.find(p => p.id === watchedValues.package_id);
    const basePrice = room ? room.price_per_night * nights : 0;
    const packageMultiplier = selectedPackage?.price_multiplier || 1;
    const totalPrice = basePrice * packageMultiplier;

    const nextStep = () => {
        if (step === 1) {
            if (!watchedValues.check_in || !watchedValues.check_out) {
                toast.error('الرجاء اختيار التواريخ');
                return;
            }
            if (nights <= 0) {
                toast.error('تاريخ المغادرة يجب أن يكون بعد تاريخ الوصول');
                return;
            }
        }
        setStep(s => Math.min(s + 1, 3));
    };

    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const onSubmit = async () => {
        if (!room) return;

        setIsLoading(true);
        try {
            await createBooking.mutateAsync({
                room_id: room.id,
                check_in: watchedValues.check_in,
                check_out: watchedValues.check_out,
                package_id: watchedValues.package_id,
                coupon_code: watchedValues.coupon_code || undefined,
                notes: watchedValues.notes || undefined,
            });
            toast.success('تم تأكيد الحجز بنجاح!');
            router.push('/dashboard/bookings');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'فشل الحجز');
        } finally {
            setIsLoading(false);
        }
    };

    if (!room) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="animate-pulse">جاري تحميل تفاصيل الغرفة...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Progress Steps */}
                <div className="mb-12">
                    <div className="flex items-center justify-center flex-row-reverse">
                        {steps.map((s, idx) => (
                            <div key={s.id} className="flex items-center flex-row-reverse">
                                <div className="flex flex-col items-center">
                                    <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-semibold
                    ${step > s.id ? 'bg-primary text-primary-foreground' :
                                            step === s.id ? 'bg-primary text-primary-foreground' :
                                                'bg-muted text-muted-foreground'}
                  `}>
                                        {step > s.id ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                                    </div>
                                    <span className={`text-sm mt-2 ${step === s.id ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                                        {s.title}
                                    </span>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className={`w-24 h-0.5 mx-2 ${step > s.id ? 'bg-primary' : 'bg-muted'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2 text-right">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {/* Step 1: Dates */}
                            {step === 1 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>اختر تواريخ إقامتك</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>تاريخ الوصول</Label>
                                                <Input
                                                    type="date"
                                                    className="text-right"
                                                    {...form.register('check_in')}
                                                    min={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>تاريخ المغادرة</Label>
                                                <Input
                                                    type="date"
                                                    className="text-right"
                                                    {...form.register('check_out')}
                                                    min={watchedValues.check_in || new Date().toISOString().split('T')[0]}
                                                />
                                            </div>
                                        </div>
                                        {nights > 0 && (
                                            <p className="text-muted-foreground">
                                                مدة الإقامة: <strong>{nights} {nights === 1 ? 'ليلة' : 'ليال'}</strong>
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Step 2: Package */}
                            {step === 2 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>اختر الباقة المناسبة</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {packages?.map((pkg) => (
                                            <label
                                                key={pkg.id}
                                                className={`
                          flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all flex-row-reverse
                          ${watchedValues.package_id === pkg.id
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-border hover:border-primary/50'}
                        `}
                                            >
                                                <input
                                                    type="radio"
                                                    value={pkg.id}
                                                    checked={watchedValues.package_id === pkg.id}
                                                    onChange={() => form.setValue('package_id', pkg.id)}
                                                    className="sr-only"
                                                />
                                                <div className={`
                          w-5 h-5 rounded-full border-2 flex items-center justify-center
                          ${watchedValues.package_id === pkg.id ? 'border-primary' : 'border-muted-foreground'}
                        `}>
                                                    {watchedValues.package_id === pkg.id && (
                                                        <div className="w-3 h-3 rounded-full bg-primary" />
                                                    )}
                                                </div>
                                                <div className="flex-1 text-right">
                                                    <div className="flex items-center gap-2 justify-end mb-1">
                                                        {pkg.type === 'royal' && (
                                                            <Badge className="bg-amber-500">
                                                                <Star className="h-3 w-3 ml-1" />
                                                                أفضل قيمة
                                                            </Badge>
                                                        )}
                                                        <h4 className="font-semibold">{pkg.name}</h4>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {pkg.features?.join('، ') || 'المرافق الأساسية مشمولة'}
                                                    </p>
                                                </div>
                                                <p className="font-semibold">
                                                    {pkg.price_multiplier === 1 ? 'مشمول' : `+${((pkg.price_multiplier - 1) * 100).toFixed(0)}%`}
                                                </p>
                                            </label>
                                        ))}

                                        <Separator className="my-6" />

                                        <div className="space-y-2">
                                            <Label>كود الخصم (اختياري)</Label>
                                            <Input
                                                placeholder="أدخل الكود"
                                                className="text-right"
                                                {...form.register('coupon_code')}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>طلبات خاصة (اختياري)</Label>
                                            <Input
                                                placeholder="هل لديك أي طلبات خاصة؟"
                                                className="text-right"
                                                {...form.register('notes')}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Step 3: Confirm */}
                            {step === 3 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>تأكيد الحجز</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="bg-muted/50 rounded-xl p-6 space-y-4 text-right">
                                            <div className="flex justify-between flex-row-reverse">
                                                <span className="text-muted-foreground">الضيف</span>
                                                <span className="font-medium">{user?.name}</span>
                                            </div>
                                            <div className="flex justify-between flex-row-reverse">
                                                <span className="text-muted-foreground">البريد الإلكتروني</span>
                                                <span className="font-medium">{user?.email}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between flex-row-reverse">
                                                <span className="text-muted-foreground">الوصول</span>
                                                <span className="font-medium">{watchedValues.check_in}</span>
                                            </div>
                                            <div className="flex justify-between flex-row-reverse">
                                                <span className="text-muted-foreground">المغادرة</span>
                                                <span className="font-medium">{watchedValues.check_out}</span>
                                            </div>
                                            <div className="flex justify-between flex-row-reverse">
                                                <span className="text-muted-foreground">المدة</span>
                                                <span className="font-medium">{nights} ليال</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between flex-row-reverse">
                                                <span className="text-muted-foreground">الباقة</span>
                                                <span className="font-medium">{selectedPackage?.name}</span>
                                            </div>
                                            {watchedValues.coupon_code && (
                                                <div className="flex justify-between flex-row-reverse">
                                                    <span className="text-muted-foreground">الخصم</span>
                                                    <span className="font-medium">{watchedValues.coupon_code}</span>
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-sm text-muted-foreground text-center">
                                            بتأكيد الحجز، أنت توافق على الشروط والأحكام.
                                            إلغاء مجاني حتى 48 ساعة قبل موعد الوصول.
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Navigation */}
                            <div className="flex justify-between mt-6 flex-row-reverse">
                                <Button
                                    variant="outline"
                                    onClick={prevStep}
                                    disabled={step === 1}
                                    className="gap-1"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                    رجوع
                                </Button>
                                {step < 3 ? (
                                    <Button onClick={nextStep} className="gap-1">
                                        التالي
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button onClick={onSubmit} disabled={isLoading}>
                                        {isLoading && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
                                        تأكيد الحجز
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Booking Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle className="text-right">ملخص الحجز</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-right">
                                <div>
                                    <h3 className="font-display text-lg font-semibold">
                                        {getRoomTypeLabel(room.type)}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">غرفة {room.room_number}</p>
                                </div>

                                <Separator />

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between flex-row-reverse">
                                        <span>{formatCurrency(room.price_per_night)} × {nights} ليال</span>
                                        <span>{formatCurrency(basePrice)}</span>
                                    </div>
                                    {packageMultiplier > 1 && (
                                        <div className="flex justify-between flex-row-reverse">
                                            <span>ترقية {selectedPackage?.name}</span>
                                            <span>+{formatCurrency(basePrice * (packageMultiplier - 1))}</span>
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                <div className="flex justify-between font-semibold text-lg flex-row-reverse">
                                    <span>المجموع</span>
                                    <span className="text-primary">{formatCurrency(totalPrice)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
    const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

    useEffect(() => {
        params.then(setResolvedParams);
    }, [params]);

    if (!resolvedParams) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="animate-pulse">جاري التحميل...</div>
            </div>
        );
    }

    return (
        <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center">جاري التحميل...</div>}>
            <BookingContent id={resolvedParams.id} />
        </Suspense>
    );
}
