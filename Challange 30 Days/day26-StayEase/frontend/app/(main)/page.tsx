'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    Calendar, Users, Search, Star, Sparkles,
    Wifi, Coffee, Car, Dumbbell, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const featuredRooms = [
    {
        id: 1,
        name: 'الجناح الملكي',
        type: 'royal_suite',
        price: 850,
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070',
        rating: 4.9,
    },
    {
        id: 2,
        name: 'جناح إطلالة المحيط',
        type: 'suite',
        price: 550,
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1974',
        rating: 4.8,
    },
    {
        id: 3,
        name: 'ملاذ شهر العسل',
        type: 'honeymoon',
        price: 720,
        image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1974',
        rating: 4.9,
    },
];

const amenities = [
    { icon: Wifi, label: 'واي فاي مجاني' },
    { icon: Coffee, label: 'خدمة الغرف' },
    { icon: Car, label: 'موقف مجاني' },
    { icon: Dumbbell, label: 'نادي رياضي' },
];

const testimonials = [
    {
        name: 'سارة الأحمد',
        role: 'سيدة أعمال',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
        content: 'تجربة مذهلة بكل المقاييس. الاهتمام بالتفاصيل ومستوى الخدمة فاق كل توقعاتي.',
        rating: 5,
    },
    {
        name: 'محمد العلي',
        role: 'إجازة عائلية',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
        content: 'مثالي لإجازتنا العائلية. استمتع الأطفال بالمسبح، ونحن استمتعنا بالسبا. سنعود بالتأكيد!',
        rating: 5,
    },
    {
        name: 'نورة القحطاني',
        role: 'شهر عسل',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
        content: 'جناح شهر العسل كان خيالياً. كل لحظة كانت مميزة ومصممة بدقة للرومانسية.',
        rating: 5,
    },
];

export default function HomePage() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070"
                        alt="فندق فاخر"
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/50 to-stone-950/80" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 container mx-auto px-4 pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <Badge className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm">
                            <Sparkles className="h-3 w-3 ml-1" />
                            الفخامة بمفهوم جديد
                        </Badge>
                        <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                            عيش تجربة
                            <span className="block text-primary">الرفاهية والراحة</span>
                        </h1>
                        <p className="text-xl text-stone-300 mb-10 max-w-2xl mx-auto">
                            اكتشف عالماً حيث تلتقي الأناقة بالهدوء. ملاذك المثالي ينتظرك في StayEase،
                            حيث صممت كل لحظة لراحتك.
                        </p>
                    </motion.div>

                    {/* Search Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-4xl mx-auto mt-8"
                    >
                        <Card className="glass border-white/20 shadow-2xl">
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="space-y-2 text-right">
                                        <label className="text-sm font-medium text-stone-300">تسجيل الوصول</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                            <Input
                                                type="date"
                                                className="pl-10 text-right bg-white/10 border-white/20 text-white placeholder:text-stone-400"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-right">
                                        <label className="text-sm font-medium text-stone-300">المغادرة</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                            <Input
                                                type="date"
                                                className="pl-10 text-right bg-white/10 border-white/20 text-white placeholder:text-stone-400"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-right">
                                        <label className="text-sm font-medium text-stone-300">الضيوف</label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                            <Input
                                                type="number"
                                                placeholder="شخصين"
                                                min={1}
                                                className="pl-10 text-right bg-white/10 border-white/20 text-white placeholder:text-stone-400"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-end">
                                        <Button size="lg" className="w-full" asChild>
                                            <Link href="/search">
                                                <Search className="h-4 w-4 ml-2" />
                                                بحث عن غرف
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-1.5 h-1.5 bg-white rounded-full"
                        />
                    </div>
                </motion.div>
            </section>

            {/* Featured Rooms */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="text-center mb-16"
                    >
                        <motion.p variants={fadeInUp} className="text-primary font-medium mb-2">
                            الإقامة
                        </motion.p>
                        <motion.h2 variants={fadeInUp} className="font-display text-4xl md:text-5xl font-bold mb-4">
                            الأجنحة والغرف المميزة
                        </motion.h2>
                        <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto">
                            تم تصميم كل غرفة بعناية لتوفير التوازن المثالي بين الفخامة والراحة
                            لإقامة لا تُنسى.
                        </motion.p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredRooms.map((room, index) => (
                            <motion.div
                                key={room.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={`/rooms/${room.id}`}>
                                    <Card className="overflow-hidden group cursor-pointer text-right">
                                        <div className="relative h-72 overflow-hidden">
                                            <Image
                                                src={room.image}
                                                alt={room.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 to-transparent" />
                                            <div className="absolute top-4 left-4">
                                                <Badge className="bg-white/90 text-stone-900">
                                                    <Star className="h-3 w-3 ml-1 fill-amber-400 text-amber-400" />
                                                    {room.rating}
                                                </Badge>
                                            </div>
                                        </div>
                                        <CardContent className="p-6">
                                            <h3 className="font-display text-xl font-semibold mb-2">{room.name}</h3>
                                            <div className="flex items-center justify-between">
                                                <p className="text-muted-foreground text-sm capitalize">
                                                    {room.type === 'royal_suite' ? 'جناح ملكي' :
                                                        room.type === 'suite' ? 'جناح' : 'جناح شهر العسل'}
                                                </p>
                                                <p className="text-lg font-bold text-primary">
                                                    {room.price} ريال<span className="text-sm font-normal text-muted-foreground">/ليلة</span>
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/search">
                                عرض جميع الغرف
                                <ArrowLeft className="h-4 w-4 mr-2" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Amenities */}
            <section className="py-24 bg-muted/50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid lg:grid-cols-2 gap-16 items-center"
                    >
                        <motion.div variants={fadeInUp} className="text-right">
                            <p className="text-primary font-medium mb-2">مستوى عالمي</p>
                            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                                خدمات ومرافق مميزة
                            </h2>
                            <p className="text-muted-foreground mb-8 text-lg">
                                من مرافق اللياقة البدنية المتطورة إلى تجارب الطعام الفاخرة،
                                تم تصميم كل مرفق لتعزيز إقامتك وصنع ذكريات لا تُنسى.
                            </p>
                            <div className="grid grid-cols-2 gap-6">
                                {amenities.map((amenity, index) => (
                                    <motion.div
                                        key={amenity.label}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-4 flex-row-reverse justify-end"
                                    >
                                        <span className="font-medium">{amenity.label}</span>
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <amenity.icon className="h-6 w-6 text-primary" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div
                            variants={fadeInUp}
                            className="relative h-[500px] rounded-2xl overflow-hidden"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1571896349842-33c89424dee5?q=80&w=2080"
                                alt="مرافق الفندق"
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover"
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="text-center mb-16"
                    >
                        <motion.p variants={fadeInUp} className="text-primary font-medium mb-2">
                            آراء العملاء
                        </motion.p>
                        <motion.h2 variants={fadeInUp} className="font-display text-4xl md:text-5xl font-bold mb-4">
                            ماذا يقول ضيوفنا
                        </motion.h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="h-full text-right">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-1 mb-4 flex-row-reverse">
                                            {Array.from({ length: testimonial.rating }).map((_, i) => (
                                                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>
                                        <p className="text-muted-foreground mb-6 leading-relaxed">
                                            &ldquo;{testimonial.content}&rdquo;
                                        </p>
                                        <div className="flex items-center gap-4 flex-row-reverse">
                                            <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                                <Image
                                                    src={testimonial.image}
                                                    alt={testimonial.name}
                                                    fill
                                                    sizes="48px"
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-semibold">{testimonial.name}</p>
                                                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-stone-900 text-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                            جاهز لإجازتك المثالية؟
                        </h2>
                        <p className="text-stone-300 text-lg mb-8">
                            احجز إقامتك اليوم واختبر الرفاهية التي تستحقها.
                            أسعار خاصة للإقامات الطويلة.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="xl" asChild>
                                <Link href="/search">
                                    احجز الآن
                                    <ArrowLeft className="h-5 w-5 mr-2" />
                                </Link>
                            </Button>
                            <Button size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                                <Link href="/contact">تواصل معنا</Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
