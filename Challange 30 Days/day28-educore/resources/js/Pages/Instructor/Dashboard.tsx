import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Plus,
    Users,
    BookOpen,
    DollarSign,
    TrendingUp,
    MoreVertical,
    Edit3,
    BarChart3
} from 'lucide-react';

interface Course {
    id: number;
    title: string;
    students: number;
    revenue: string;
    status: string;
}

interface Props {
    courses: Course[];
    stats: {
        totalStudents: string;
        totalCourses: number;
        totalRevenue: string;
        avgRating: string;
    };
}

export default function InstructorDashboard({ courses, stats }: Props) {
    const dashboardStats = [
        { label: 'إجمالي الطلاب', value: stats.totalStudents, icon: <Users className="w-5 h-5" />, change: '+12%' },
        { label: 'إجمالي الدورات', value: stats.totalCourses, icon: <BookOpen className="w-5 h-5" />, change: '0%' },
        { label: 'إجمالي الإيرادات', value: stats.totalRevenue, icon: <DollarSign className="w-5 h-5" />, change: '+18%' },
        { label: 'متوسط التقييم', value: stats.avgRating, icon: <TrendingUp className="w-5 h-5" />, change: '+0.2' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="استوديو المدرب" />

            <div className="max-w-7xl mx-auto font-['Cairo']" dir="rtl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 text-right">
                    <div>
                        <h1 className="text-3xl font-black mb-2">استوديو المدرب</h1>
                        <p className="text-zinc-500 font-bold">إدارة دوراتك ومتابعة أداء طلابك.</p>
                    </div>
                    <Link
                        href="/instructor/courses/create"
                        className="bg-black text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,209,255,0.4)] transition-all border border-transparent hover:border-[#00D1FF]"
                    >
                        <Plus className="w-5 h-5 text-[#00D1FF]" />
                        إنشاء دورة جديدة
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {dashboardStats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
                            <div className="flex items-center justify-between mb-4 flex-row-reverse">
                                <div className="bg-zinc-50 p-2 rounded-xl text-black">
                                    {stat.icon}
                                </div>
                                <span className="text-[10px] font-black text-[#00D1FF] bg-[#00D1FF]/10 px-2 py-1 rounded-full">
                                    {stat.change}
                                </span>
                            </div>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1 text-right">{stat.label}</p>
                            <p className="text-2xl font-black text-right">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Courses Table */}
                <div className="bg-white border border-zinc-100 rounded-[40px] overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-zinc-100 flex items-center justify-between flex-row-reverse">
                        <h2 className="font-black text-xl">دوراتك التدريبية</h2>
                        <button className="text-sm font-bold text-[#00D1FF] hover:underline">عرض الكل</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead>
                                <tr className="bg-zinc-50 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                    <th className="px-8 py-5">اسم الدورة</th>
                                    <th className="px-8 py-5">الحالة</th>
                                    <th className="px-8 py-5">الطلاب</th>
                                    <th className="px-8 py-5">الإيرادات</th>
                                    <th className="px-8 py-5 text-left">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {courses.length > 0 ? courses.map((course) => (
                                    <tr key={course.id} className="hover:bg-zinc-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <p className="font-black text-sm">{course.title}</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
                                                course.status === 'منشور'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-zinc-100 text-zinc-600'
                                            }`}>
                                                {course.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-bold text-zinc-600">{course.students}</td>
                                        <td className="px-8 py-5 text-sm font-black">{course.revenue}</td>
                                        <td className="px-8 py-5 text-left">
                                            <div className="flex items-center justify-start gap-2">
                                                <Link
                                                    href={`/instructor/courses/${course.id}/builder`}
                                                    className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-400 hover:text-black"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </Link>
                                                <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-400 hover:text-black">
                                                    <BarChart3 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-400 hover:text-black">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="text-zinc-400 font-bold">لم تقم بإنشاء أي دورات بعد.</div>
                                            <Link href="/instructor/courses/create" className="text-[#00D1FF] font-black hover:underline mt-2 inline-block">ابدأ بإنشاء دورتك الأولى الآن</Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
