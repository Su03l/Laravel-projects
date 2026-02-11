import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Play, Clock, BookOpen, Globe, Award, Star, CheckCircle2, ChevronRight } from 'lucide-react';

interface Props {
    course: any;
}

export default function CourseDetails({ course }: Props) {
    const { post, processing } = useForm();

    const data = course?.data || {
        id: 1,
        title: 'أنماط ريأكت المتقدمة',
        description: 'أتقن بناء تطبيقات ريأكت قابلة للتوسع باستخدام الأنماط المتقدمة وتحسين الأداء.',
        price: '350 ر.س',
        rating: 4.9,
        reviews_count: 850,
        students_count: '12,400',
        teacher: { name: 'سارة دراسنر', avatar: 'https://i.pravatar.cc/150?u=sarah' },
        chapters: []
    };

    const handleEnroll = () => {
        post(route('courses.enroll', data.id));
    };

    return (
        <GuestLayout>
            <Head title={data.title} />

            <div className="bg-black text-white py-16 relative overflow-hidden font-['Cairo']" dir="rtl">
                <div className="absolute top-0 left-0 w-1/3 h-full bg-[#00D1FF]/10 blur-[120px] rounded-full"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 text-right">
                            <nav className="flex items-center gap-2 text-sm text-zinc-400 mb-6 flex-row-reverse">
                                <Link href="/browse" className="hover:text-[#00D1FF]">الدورات</Link>
                                <ChevronRight className="w-4 h-4 rotate-180" />
                                <span className="text-zinc-200">البرمجة</span>
                            </nav>

                            <h1 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">{data.title}</h1>
                            <p className="text-lg text-zinc-300 mb-8 max-w-2xl">{data.description}</p>

                            <div className="flex flex-wrap items-center gap-6 text-sm flex-row-reverse">
                                <div className="flex items-center gap-2 flex-row-reverse">
                                    <div className="flex items-center gap-1 text-[#00D1FF]">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="font-bold">{data.rating}</span>
                                    </div>
                                    <span className="text-zinc-400">({data.reviews_count} تقييم)</span>
                                </div>
                                <div className="text-zinc-400">
                                    <span className="font-bold text-white">{data.students_count}</span> طالب مشترك
                                </div>
                            </div>

                            <div className="mt-8 flex items-center gap-4 justify-end">
                                <div className="text-left">
                                    <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold">بواسطة</p>
                                    <p className="font-bold text-[#00D1FF]">{data.teacher.name}</p>
                                </div>
                                <img src={data.teacher.avatar} className="w-12 h-12 rounded-full border-2 border-[#00D1FF]" alt="" />
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-3xl p-2 shadow-2xl sticky top-24 text-right">
                                <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 group">
                                    <img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800" className="w-full h-full object-cover" alt="" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                                            <Play className="w-6 h-6 text-black fill-current mr-1" />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 pt-0">
                                    <div className="flex items-baseline gap-2 mb-6 flex-row-reverse">
                                        <span className="text-4xl font-black text-black">{data.price}</span>
                                        <span className="text-zinc-400 line-through text-lg">700 ر.س</span>
                                    </div>

                                    <button
                                        onClick={handleEnroll}
                                        disabled={processing}
                                        className="w-full bg-black text-white py-4 rounded-2xl font-black text-lg hover:shadow-[0_0_20px_rgba(0,209,255,0.4)] transition-all mb-4 border border-transparent hover:border-[#00D1FF] disabled:opacity-50"
                                    >
                                        {processing ? 'جاري الاشتراك...' : 'اشترك الآن'}
                                    </button>

                                    <div className="space-y-4 mt-8">
                                        <p className="font-bold text-sm text-black uppercase tracking-wider">تتضمن هذه الدورة:</p>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-sm text-zinc-600 flex-row-reverse">
                                                <Play className="w-4 h-4 text-[#00D1FF]" />
                                                <span>15 ساعة فيديو حسب الطلب</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-zinc-600 flex-row-reverse">
                                                <Award className="w-4 h-4 text-[#00D1FF]" />
                                                <span>شهادة إتمام معتمدة</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
