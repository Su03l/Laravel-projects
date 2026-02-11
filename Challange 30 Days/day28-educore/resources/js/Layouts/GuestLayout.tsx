import { Link, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import { GraduationCap, User as UserIcon } from 'lucide-react';
import Toast from '@/Components/Common/Toast';

interface Props {
    children: ReactNode;
}

export default function GuestLayout({ children }: Props) {
    const { auth } = usePage().props as any;

    return (
        <div className="min-h-screen bg-white flex flex-col font-['Cairo']" dir="rtl">
            <Toast />
            <nav className="border-b border-zinc-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="bg-black p-1.5 rounded-lg">
                                    <GraduationCap className="w-6 h-6 text-[#00D1FF]" />
                                </div>
                                <span className="text-xl font-bold tracking-tight">
                                    إديو<span className="text-[#00D1FF]">كور</span>
                                </span>
                            </Link>
                        </div>

                        <div className="hidden md:flex items-center gap-8">
                            <Link href="/browse" className="text-sm font-bold hover:text-[#00D1FF] transition-colors">تصفح الدورات</Link>

                            {auth.user ? (
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 bg-zinc-50 px-4 py-2 rounded-xl border border-zinc-100 hover:border-[#00D1FF] transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                                        <UserIcon className="w-4 h-4 text-[#00D1FF]" />
                                    </div>
                                    <span className="text-sm font-black text-black">{auth.user.name}</span>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="text-sm font-bold hover:text-[#00D1FF] transition-colors">تسجيل الدخول</Link>
                                    <Link
                                        href="/register"
                                        className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold hover:shadow-[0_0_15px_rgba(0,209,255,0.4)] transition-all border border-transparent hover:border-[#00D1FF]"
                                    >
                                        ابدأ التعلم مجاناً
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow">
                {children}
            </main>

            <footer className="bg-zinc-50 border-t border-zinc-100 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-black p-1.5 rounded-lg">
                                    <GraduationCap className="w-5 h-5 text-[#00D1FF]" />
                                </div>
                                <span className="text-lg font-bold">إديوكور</span>
                            </div>
                            <p className="text-zinc-500 max-w-xs text-sm leading-relaxed">
                                تمكين المتعلمين في جميع أنحاء العالم من خلال دورات احترافية ومدربين رائدين في الصناعة.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">المنصة</h4>
                            <ul className="space-y-2 text-sm text-zinc-600 font-bold">
                                <li><Link href="/browse" className="hover:text-[#00D1FF]">تصفح الدورات</Link></li>
                                <li><Link href="#" className="hover:text-[#00D1FF]">كن مدرباً</Link></li>
                                <li><Link href="#" className="hover:text-[#00D1FF]">للأعمال</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">الدعم</h4>
                            <ul className="space-y-2 text-sm text-zinc-600 font-bold">
                                <li><Link href="#" className="hover:text-[#00D1FF]">مركز المساعدة</Link></li>
                                <li><Link href="#" className="hover:text-[#00D1FF]">شروط الخدمة</Link></li>
                                <li><Link href="#" className="hover:text-[#00D1FF]">سياسة الخصوصية</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-zinc-200 text-center text-zinc-400 text-xs">
                        © {new Date().getFullYear()} إديوكور LMS. جميع الحقوق محفوظة.
                    </div>
                </div>
            </footer>
        </div>
    );
}
