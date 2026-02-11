import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    BookOpen,
    Clock,
    Award,
    PlayCircle,
    TrendingUp,
    ChevronLeft,
    Calendar,
    Star
} from 'lucide-react';

interface Props {
    enrolledCourses: any[];
    stats: {
        activeCourses: number;
        completedCourses: number;
        certificates: number;
        points: number;
    };
}

export default function Dashboard({ enrolledCourses, stats }: Props) {
    const dashboardStats = [
        { label: 'دورات مستمرة', value: stats.activeCourses, icon: <BookOpen className="w-5 h-5 text-[#00D1FF]" />, color: 'bg-[#00D1FF]/10' },
        { label: 'دورات مكتملة', value: stats.completedCourses, icon: <Clock className="w-5 h-5 text-purple-500" />, color: 'bg-purple-50' },
        { label: 'شهادات مكتسبة', value: stats.certificates, icon: <Award className="w-5 h-5 text-amber-500" />, color: 'bg-amber-50' },
        { label: 'النقاط', value: stats.points, icon: <TrendingUp className="w-5 h-5 text-emerald-500" />, color: 'bg-emerald-50' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="لوحة التحكم" />

            <div className="max-w-7xl mx-auto font-['Cairo']" dir="rtl">
                {/* Welcome Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black mb-2">أهلاً بك مجدداً! 👋</h1>
                        <p className="text-zinc-500 font-bold">لقد أنجزت الكثير هذا الأسبوع، واصل التقدم.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-zinc-50 px-4 py-2 rounded-2xl border border-zinc-100">
                        <Calendar className="w-5 h-5 text-zinc-400" />
                        <span className="text-sm font-bold text-zinc-600">
                            {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {dashboardStats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
                                {stat.icon}
                            </div>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                            <p className="text-2xl font-black">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Main Content: Recent Courses */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black">واصل التعلم</h2>
                            <Link href="/my-learning" className="text-sm font-bold text-[#00D1FF] hover:underline">عرض الكل</Link>
                        </div>

                        <div className="grid gap-6">
                            {enrolledCourses.length > 0 ? enrolledCourses.map((course) => (
                                <div key={course.id} className="bg-white border border-zinc-100 rounded-3xl p-4 flex flex-col sm:flex-row gap-6 group hover:border-[#00D1FF] transition-all">
                                    <div className="w-full sm:w-48 aspect-video rounded-2xl overflow-hidden relative shrink-0">
                                        <img src={course.image} className="w-full h-full object-cover" alt="" />
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <PlayCircle className="w-10 h-10 text-white fill-current" />
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <h3 className="font-black text-lg mb-1 group-hover:text-[#00D1FF] transition-colors">{course.title}</h3>
                                        <p className="text-xs text-zinc-500 font-bold mb-4">المدرب: {course.instructor}</p>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-[10px] font-black">
                                                <span>{course.progress}% مكتمل</span>
                                            </div>
                                            <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-black rounded-full transition-all duration-1000"
                                                    style={{ width: `${course.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end">
                                        <Link
                                            href={`/learn/${course.id}`}
                                            className="bg-zinc-50 p-3 rounded-xl group-hover:bg-black group-hover:text-white transition-all"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                            )) : (
                                <div className="bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-3xl p-12 text-center">
                                    <p className="text-zinc-500 font-bold mb-4">لم تشترك في أي دورة بعد.</p>
                                    <Link href="/browse" className="text-[#00D1FF] font-black hover:underline">تصفح الدورات الآن</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar: Recommendations */}
                    <div className="space-y-8">
                        <h2 className="text-xl font-black">مقترح لك</h2>
                        <div className="bg-black rounded-3xl p-6 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D1FF]/20 blur-3xl rounded-full"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-1 text-[#00D1FF] mb-4">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="text-xs font-black uppercase tracking-widest">دورة مميزة</span>
                                </div>
                                <h3 className="font-black text-lg mb-2 leading-tight">تصميم واجهات المستخدم الاحترافي</h3>
                                <p className="text-zinc-400 text-xs mb-6 font-medium">تعلم أسرار التصميم الحديث مع أفضل الخبراء.</p>
                                <Link
                                    href="/browse"
                                    className="inline-flex items-center justify-center w-full py-3 bg-[#00D1FF] text-black font-black rounded-xl hover:shadow-[0_0_20px_rgba(0,209,255,0.5)] transition-all"
                                >
                                    استكشف الآن
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
