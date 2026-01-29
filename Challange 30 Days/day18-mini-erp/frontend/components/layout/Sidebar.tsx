'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Briefcase, FolderKanban, DollarSign, CalendarCheck } from 'lucide-react';
import { clsx } from 'clsx';

const Sidebar = () => {
    const pathname = usePathname();

    const links = [
        { name: 'لوحة التحكم', href: '/dashboard', icon: LayoutDashboard },
        { name: 'الموظفين', href: '/employees', icon: Users },
        { name: 'العملاء', href: '/clients', icon: Briefcase },
        { name: 'المشاريع', href: '/projects', icon: FolderKanban },
        { name: 'المالية', href: '/invoices', icon: DollarSign },
        { name: 'الحضور والانصراف', href: '/my-leaves', icon: CalendarCheck },
    ];

    return (
        <aside className="w-64 bg-white border-l border-slate-200 h-screen flex flex-col hidden md:flex fixed top-0 right-0 z-40 shadow-sm">
            <div className="p-8 border-b border-slate-50">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-500 text-4xl">.</span>
                    ميني <span className="text-sky-500">ERP</span>
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname.startsWith(link.href);

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={clsx(
                                "flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-sky-50 text-sky-600 shadow-sm"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            {isActive && (
                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-sky-500 rounded-l-full" />
                            )}
                            <Icon size={22} className={clsx(isActive ? "text-sky-500" : "text-slate-400 group-hover:text-slate-600 transition-colors")} />
                            <span>{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-slate-50">
                <div className="text-xs text-slate-400 text-center font-medium">
                    © 2024 جميع الحقوق محفوظة
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
