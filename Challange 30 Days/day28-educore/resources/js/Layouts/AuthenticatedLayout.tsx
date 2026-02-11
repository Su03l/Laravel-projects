import { useState, PropsWithChildren, ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    BookOpen,
    Settings,
    LogOut,
    Menu,
    X,
    GraduationCap,
    Search,
    Bell,
    Compass,
    Award,
    Presentation
} from 'lucide-react';
import Toast from '@/Components/Common/Toast';

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user as any;
    const url = usePage().url;

    return (
        <div className="min-h-screen bg-white flex font-['Cairo']" dir="rtl">
            <Toast />
            {/* Sidebar */}
            <aside className="w-64 border-l border-zinc-100 hidden md:flex flex-col sticky top-0 h-screen bg-white">
                <div className="p-6">
                    <Link href="/" className="flex items-center gap-2 justify-start">
                        <div className="bg-black p-1.5 rounded-lg">
                            <GraduationCap className="w-6 h-6 text-[#00D1FF]" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">
                            إديو<span className="text-[#00D1FF]">كور</span>
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <Link
                        href="/dashboard"
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                            url === '/dashboard'
                            ? 'bg-black text-white shadow-[0_0_15px_rgba(0,209,255,0.2)]'
                            : 'text-zinc-600 hover:bg-zinc-50 hover:text-black'
                        }`}
                    >
                        <LayoutDashboard className={`w-5 h-5 ${url === '/dashboard' ? 'text-[#00D1FF]' : ''}`} />
                        لوحة التحكم
                    </Link>
                    <Link
                        href="/my-learning"
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                            url === '/my-learning'
                            ? 'bg-black text-white shadow-[0_0_15px_rgba(0,209,255,0.2)]'
                            : 'text-zinc-600 hover:bg-zinc-50 hover:text-black'
                        }`}
                    >
                        <BookOpen className={`w-5 h-5 ${url === '/my-learning' ? 'text-[#00D1FF]' : ''}`} />
                        دروسي
                    </Link>
                    <Link
                        href="/browse"
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                            url === '/browse'
                            ? 'bg-black text-white shadow-[0_0_15px_rgba(0,209,255,0.2)]'
                            : 'text-zinc-600 hover:bg-zinc-50 hover:text-black'
                        }`}
                    >
                        <Compass className={`w-5 h-5 ${url === '/browse' ? 'text-[#00D1FF]' : ''}`} />
                        تصفح الدورات
                    </Link>
                    <Link
                        href="/certificates"
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                            url === '/certificates'
                            ? 'bg-black text-white shadow-[0_0_15px_rgba(0,209,255,0.2)]'
                            : 'text-zinc-600 hover:bg-zinc-50 hover:text-black'
                        }`}
                    >
                        <Award className={`w-5 h-5 ${url === '/certificates' ? 'text-[#00D1FF]' : ''}`} />
                        شهاداتي
                    </Link>

                    {/* رابط لوحة تحكم المدرس - يظهر فقط للمدربين والمديرين */}
                    {(user.role === 'instructor' || user.role === 'admin') && (
                        <div className="pt-4 mt-4 border-t border-zinc-100">
                            <p className="px-4 mb-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">استوديو التعليم</p>
                            <Link
                                href="/instructor"
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                                    url.startsWith('/instructor')
                                    ? 'bg-[#00D1FF] text-black shadow-[0_0_15px_rgba(0,209,255,0.4)]'
                                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-black'
                                }`}
                            >
                                <Presentation className="w-5 h-5" />
                                لوحة تحكم المدرس
                            </Link>
                        </div>
                    )}

                    <Link
                        href="/profile"
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                            url === '/profile'
                            ? 'bg-black text-white shadow-[0_0_15px_rgba(0,209,255,0.2)]'
                            : 'text-zinc-600 hover:bg-zinc-50 hover:text-black'
                        }`}
                    >
                        <Settings className={`w-5 h-5 ${url === '/profile' ? 'text-[#00D1FF]' : ''}`} />
                        الإعدادات
                    </Link>
                </nav>

                <div className="p-4 border-t border-zinc-100">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl w-full transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        تسجيل الخروج
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-16 border-b border-zinc-100 bg-white flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative max-w-md w-full hidden sm:block">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="ابحث في دروسك..."
                                className="w-full pr-10 pl-4 py-2 bg-zinc-50 border-transparent rounded-lg text-sm font-bold focus:bg-white focus:ring-2 focus:ring-[#00D1FF] transition-all text-right"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-zinc-400 hover:text-black transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 left-2 w-2 h-2 bg-[#00D1FF] rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-zinc-100 mx-2"></div>
                        <div className="flex items-center gap-3 flex-row-reverse">
                            <div className="text-left hidden sm:block">
                                <p className="text-sm font-black leading-none">{user.name}</p>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1 font-bold">
                                    {user.role === 'admin' ? 'مدير النظام' : (user.role === 'instructor' ? 'مدرب' : 'طالب')}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden">
                                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=000&color=00D1FF`} alt={user.name} />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 text-right">
                    {children}
                </main>
            </div>
        </div>
    );
}
