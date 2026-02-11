import { Link } from '@inertiajs/react';
import { Star, Clock, BookOpen, PlusCircle } from 'lucide-react';

interface CourseCardProps {
    course: {
        id: number;
        title: string;
        instructor: string;
        price: string;
        rating: number;
        image: string;
    };
}

export default function CourseCard({ course }: CourseCardProps) {
    return (
        <div className="bg-white rounded-3xl border border-zinc-100 overflow-hidden hover:shadow-xl transition-all group text-right font-['Cairo']" dir="rtl">
            <Link href={`/courses/${course.id}`}>
                <div className="relative aspect-video overflow-hidden">
                    <img
                        src={course.image}
                        alt={course.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-xl text-xs font-black shadow-sm">
                        {course.price}
                    </div>
                </div>
            </Link>
            <div className="p-5">
                <div className="flex items-center gap-2 mb-3 justify-start flex-row-reverse">
                    <span className="bg-[#00D1FF]/10 text-[#00D1FF] text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded">الأكثر مبيعاً</span>
                    <div className="flex items-center gap-1 text-xs font-bold flex-row-reverse">
                        <Star className="w-3 h-3 fill-[#00D1FF] text-[#00D1FF]" />
                        {course.rating}
                    </div>
                </div>
                <Link href={`/courses/${course.id}`}>
                    <h3 className="font-black text-lg mb-1 group-hover:text-[#00D1FF] transition-colors line-clamp-1">{course.title}</h3>
                </Link>
                <p className="text-zinc-500 text-xs font-bold mb-4">بواسطة {course.instructor}</p>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-50 flex-row-reverse">
                    <div className="flex items-center gap-3 text-zinc-400 text-[11px] font-bold flex-row-reverse">
                        <span className="flex items-center gap-1 flex-row-reverse"><BookOpen className="w-3 h-3" /> 12 درس</span>
                        <span className="flex items-center gap-1 flex-row-reverse"><Clock className="w-3 h-3" /> 4س 30د</span>
                    </div>
                    <button className="text-black hover:text-[#00D1FF] transition-colors">
                        <PlusCircle className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}
