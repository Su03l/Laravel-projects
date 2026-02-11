import { Link } from '@inertiajs/react';

interface Props {
    links: any[];
}

export default function Pagination({ links }: Props) {
    // إذا لم تكن هناك روابط أو كان هناك صفحة واحدة فقط
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <div className="mt-20 mb-10 flex justify-center font-['Cairo']" dir="rtl">
            <nav className="flex items-center gap-2 flex-wrap justify-center">
                {links.map((link, i) => {
                    // معالجة النص ليظهر بشكل نظيف
                    let label = link.label;
                    if (label.includes('Previous')) label = 'السابق';
                    if (label.includes('Next')) label = 'التالي';

                    return (
                        <Link
                            key={i}
                            href={link.url || '#'}
                            className={`
                                min-w-[40px] h-10 px-3 rounded-xl border flex items-center justify-center transition-all font-bold text-sm
                                ${link.active
                                    ? 'bg-black text-white border-black shadow-[0_0_20px_rgba(0,209,255,0.5)] z-10'
                                    : 'bg-white text-zinc-600 border-zinc-200 hover:border-[#00D1FF] hover:text-[#00D1FF] hover:shadow-sm'
                                }
                                ${!link.url ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                            `}
                        >
                            <span dangerouslySetInnerHTML={{ __html: label }} />
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
