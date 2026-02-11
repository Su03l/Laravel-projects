import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Play, Clock, Award, ChevronLeft } from 'lucide-react';

interface Props {
    courses: any[];
}

export default function MyLearning({ courses }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="دروسي" />

            <div className="max-w-6xl mx-auto font-['Cairo']" dir="rtl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 text-right">
                    <div>
                        <h1 className="text-3xl font-black mb-2">دروسي التعليمية</h1>
                        <p className="text-zinc-500 font-bold">أكمل ما بدأته وواصل رحلتك التعليمية.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-100 flex-row-reverse">
                        <div className="bg-black p-2 rounded-lg">
                            <Award className="w-6 h-6 text-[#00D1FF]" />
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">الشهادات</p>
                            <p className="text-sm font-black">0 مكتسبة</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6">
                    {courses && courses.length > 0 ? courses.map((course) => (
                        <div key={course.id} className="bg-white border border-zinc-100 rounded-3xl p-4 flex flex-col md:flex-row-reverse gap-6 hover:shadow-xl transition-all group text-right">
                            <div className="w-full md:w-64 aspect-video rounded-2xl overflow-hidden relative shrink-0">
                                <img src={course.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                                        <Play className="w-5 h-5 text-black fill-current mr-1" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-between py-2">
                                <div>
                                    <div className="flex items-center justify-between mb-2 flex-row-reverse">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#00D1FF] bg-[#00D1FF]/10 px-2 py-0.5 rounded">قيد التعلم</span>
                                        <span className="text-xs text-zinc-400 flex items-center gap-1 flex-row-reverse font-bold">
                                            <Clock className="w-3 h-3" /> {course.lastAccessed}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-black mb-1 group-hover:text-[#00D1FF] transition-colors">{course.title}</h3>
                                    <p className="text-sm text-zinc-500 mb-4 font-bold">المدرب: {course.instructor}</p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm flex-row-reverse">
                                        <span className="font-black">تم إكمال {course.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-black rounded-full transition-all duration-1000 relative"
                                            style={{ width: `${course.progress}%` }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#00D1FF]/50"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center px-4">
                                <Link
                                    href={`/learn/${course.id}`}
                                    className="bg-zinc-50 hover:bg-black hover:text-white p-4 rounded-2xl transition-all group/btn border border-zinc-100 hover:border-black"
                                >
                                    <ChevronLeft className="w-6 h-6 group-hover/btn:text-[#00D1FF]" />
                                </Link>
                            </div>
                        </div>
                    )) : (
                        <div className="bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-3xl p-16 text-center">
                            <p className="text-zinc-500 font-bold mb-4 text-lg">لم تشترك في أي دورة بعد.</p>
                            <Link href="/browse" className="bg-black text-white px-8 py-3 rounded-2xl font-black hover:shadow-[0_0_20px_rgba(0,209,255,0.4)] transition-all inline-block">
                                استكشف الدورات الآن
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
