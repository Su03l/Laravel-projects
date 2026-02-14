import { useState, PropsWithChildren } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { User } from '@/types/models';
import { LayoutDashboard, FolderKanban, Settings, LogOut, Menu, X, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AppLayout({ children }: PropsWithChildren) {
    const user = usePage().props.auth.user as User;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems = [
        { name: 'الرئيسية', href: route('dashboard'), icon: LayoutDashboard, active: route().current('dashboard') },
        { name: 'الملف الشخصي', href: route('profile.edit'), icon: Settings, active: route().current('profile.edit') },
    ];

    return (
        <div className="min-h-screen bg-[#1a1a1a] text-zinc-100 flex flex-col md:flex-row" dir="rtl">
            {/* Mobile Header */}
            <div className="md:hidden bg-[#1a1a1a]/95 backdrop-blur-xl p-4 flex justify-between items-center border-b border-white/[0.06] sticky top-0 z-50">
                <div className="font-bold text-xl flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                        <FolderKanban className="w-4 h-4 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">أوربت</span>
                </div>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-zinc-400 hover:text-white transition-colors">
                    {isSidebarOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 right-0 z-50 w-72 bg-[#141414] border-l border-white/[0.06] transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col",
                isSidebarOpen ? "translate-x-0" : "translate-x-full"
            )}>
                {/* Logo */}
                <div className="p-6 pb-2">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/10">
                            <FolderKanban className="w-5 h-5 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">أوربت</span>
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 mt-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                item.active
                                    ? "bg-indigo-500/10 text-indigo-400 shadow-sm shadow-indigo-500/5"
                                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                            )}
                        >
                            {item.active && (
                                <div className="absolute inset-0 bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />
                            )}
                            <item.icon className={cn("w-5 h-5 transition-colors relative z-10",
                                item.active
                                    ? "text-indigo-400"
                                    : "text-zinc-500 group-hover:text-zinc-300"
                            )} />
                            <span className="relative z-10">{item.name}</span>
                            {item.active && (
                                <ChevronLeft className="w-4 h-4 mr-auto text-indigo-500/40 relative z-10" />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* User card */}
                <div className="p-3 m-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 ring-2 ring-white/10">
                            {user.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <div className="font-medium text-zinc-100 truncate text-sm">{user.name}</div>
                            <div className="text-xs text-zinc-500 truncate">{user.email}</div>
                        </div>
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-rose-400 bg-rose-500/10 rounded-xl hover:bg-rose-500/15 transition-all duration-200 border border-rose-500/10 hover:border-rose-500/20"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        تسجيل الخروج
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen bg-[#1a1a1a] relative">
                {/* Background Glow Effect */}
                <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-indigo-600/[0.07] blur-[150px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-violet-600/[0.05] blur-[120px] rounded-full pointer-events-none" />
                <div className="relative z-10 h-full">
                    {children}
                </div>
            </main>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
