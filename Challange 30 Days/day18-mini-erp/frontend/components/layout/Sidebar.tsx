'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Briefcase, FolderKanban, DollarSign, CalendarCheck } from 'lucide-react';
import { clsx } from 'clsx'; // Simple clsx use is fine, or use the cn utility if I exported it globally, but I kept it local to Button for now. 
// Actually, I should probably put `cn` in a lib/utils.ts, but to save tool calls I'll just use template literals or inline clsx/tailwind-merge if complex.
// Let's use clsx directly here.

const Sidebar = () => {
    const pathname = usePathname();

    const links = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Employees', href: '/employees', icon: Users },
        { name: 'Clients', href: '/clients', icon: Briefcase },
        { name: 'Projects', href: '/projects', icon: FolderKanban },
        { name: 'Finance', href: '/invoices', icon: DollarSign }, // 'Finance' maps to /invoices or similar
        { name: 'Attendance', href: '/my-leaves', icon: CalendarCheck }, // Approximate mapping
    ];

    return (
        <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col hidden md:flex fixed top-0 left-0 z-40">
            <div className="p-6 border-b border-slate-100">
                <h1 className="text-2xl font-bold text-slate-900">
                    Mini<span className="text-sky-500">ERP</span>
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname.startsWith(link.href);

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200",
                                isActive
                                    ? "bg-sky-50 text-sky-600 border-r-2 border-sky-500 rounded-r-none"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <Icon size={20} className={clsx(isActive ? "text-sky-500" : "text-slate-400 group-hover:text-slate-600")} />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <div className="text-xs text-slate-400 text-center">
                    © 2024 Mini-ERP System
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
