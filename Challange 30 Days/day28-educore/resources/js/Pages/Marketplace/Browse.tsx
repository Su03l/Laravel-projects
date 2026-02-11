import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';
import { Search, SlidersHorizontal, Check } from 'lucide-react';
import CourseCard from '@/Components/Course/CourseCard';
import Pagination from '@/Components/Common/Pagination';

interface Props {
    courses: {
        data: any[];
    };
    pagination: {
        links: any[];
        meta: any;
    };
}

export default function Browse({ courses, pagination }: Props) {
    const displayCourses = courses?.data || [];
    const paginationLinks = pagination?.links || [];

    return (
        <GuestLayout>
            <Head title="تصفح الدورات" />

            <div className="bg-white min-h-screen py-12 font-['Cairo']" dir="rtl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header & Search */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 text-right">
                        <div className="max-w-xl">
                            <h1 className="text-4xl font-black mb-4 tracking-tight">
                                وسّع <span className="text-[#00D1FF]">آفاقك المعرفية</span>
                            </h1>
                            <p className="text-zinc-500 text-lg font-bold">
                                اكتشف دورات عالمية المستوى يقدمها قادة الصناعة والخبراء.
                            </p>
                        </div>

                        <div className="relative max-w-md w-full group">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-[#00D1FF] transition-colors" />
                            <input
                                type="text"
                                placeholder="ابحث عن الدورات، المهارات، أو المدربين..."
                                className="w-full pr-12 pl-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-[#00D1FF] focus:bg-white focus:border-transparent outline-none transition-all shadow-sm text-right"
                            />
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-4 gap-12">
                        {/* Sidebar Filters */}
                        <aside className="lg:col-span-1 space-y-10 text-right">
                            <div>
                                <div className="flex items-center justify-between mb-6 flex-row-reverse">
                                    <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2 flex-row-reverse">
                                        <SlidersHorizontal className="w-4 h-4 text-[#00D1FF]" /> التصنيفات
                                    </h3>
                                    <button className="text-[10px] font-bold text-[#00D1FF] hover:underline">مسح الكل</button>
                                </div>
                                <div className="space-y-3">
                                    {['البرمجة', 'التصميم', 'الأعمال', 'التسويق', 'التصوير'].map(cat => (
                                        <label key={cat} className="flex items-center justify-between cursor-pointer group flex-row-reverse">
                                            <div className="flex items-center gap-3 flex-row-reverse">
                                                <div className="relative flex items-center justify-center">
                                                    <input type="checkbox" className="peer appearance-none w-5 h-5 rounded border-2 border-zinc-200 checked:bg-black checked:border-black transition-all cursor-pointer" />
                                                    <Check className="absolute w-3 h-3 text-[#00D1FF] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                                </div>
                                                <span className="text-sm font-bold text-zinc-600 group-hover:text-black transition-colors">{cat}</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded-full">12</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* Course Grid */}
                        <div className="lg:col-span-3">
                            <div className="flex items-center justify-between mb-8 flex-row-reverse">
                                <p className="text-sm font-bold text-zinc-500">عرض <span className="text-black">{pagination?.meta?.total || displayCourses.length}</span> نتيجة</p>
                                <select className="bg-transparent border-none text-sm font-bold focus:ring-0 cursor-pointer text-right">
                                    <option>الأكثر شعبية</option>
                                    <option>الأحدث أولاً</option>
                                    <option>السعر: من الأقل للأعلى</option>
                                </select>
                            </div>

                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {displayCourses.map((course: any) => (
                                    <CourseCard
                                        key={course.id}
                                        course={{
                                            id: course.id,
                                            title: course.title,
                                            instructor: course.teacher?.name || 'مدرب',
                                            price: course.price_formatted || 'مجاني',
                                            rating: course.rating || 0,
                                            image: course.thumbnail || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800'
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Pagination Component */}
                            <Pagination links={paginationLinks} />
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
