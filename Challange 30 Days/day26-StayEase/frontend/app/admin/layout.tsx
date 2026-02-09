'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, BedDouble, Calendar,
    LogOut, Building2, ChevronRight, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/auth-store';

const sidebarLinks = [
    { href: '/admin', icon: LayoutDashboard, label: 'لوحة التحكم' },
    { href: '/admin/rooms', icon: BedDouble, label: 'إدارة الغرف' },
    { href: '/admin/bookings', icon: Calendar, label: 'الحجوزات' },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { logout, user } = useAuthStore();

    const handleLogout = async () => {
        await logout();
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar (Right side for RTL) */}
            <aside className="fixed top-0 right-0 z-40 w-64 h-screen border-l bg-stone-900 text-stone-100">
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center gap-2 px-6 py-5 border-b border-stone-700">
                        <Building2 className="h-7 w-7 text-primary" />
                        <span className="font-display text-xl font-bold">
                            Stay<span className="text-primary">Ease</span>
                        </span>
                        <Badge variant="secondary" className="mr-auto ml-0 text-xs">إدارة</Badge>
                    </div>

                    {/* Back to Home */}
                    <div className="px-4 py-3">
                        <Button variant="ghost" size="sm" asChild className="w-full justify-start text-stone-300 hover:text-white hover:bg-stone-800">
                            <Link href="/">
                                <ChevronRight className="h-4 w-4 ml-1" />
                                العودة للموقع
                            </Link>
                        </Button>
                    </div>

                    <Separator className="bg-stone-700" />

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                        {sidebarLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                                        isActive
                                            ? 'bg-primary text-primary-foreground shadow-md'
                                            : 'text-stone-400 hover:bg-stone-800 hover:text-white'
                                    )}
                                >
                                    <link.icon className="h-5 w-5" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <Separator className="bg-stone-700" />

                    {/* User Info & Logout */}
                    <div className="p-4">
                        <div className="flex items-center gap-3 px-4 py-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <Shield className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0 text-right">
                                <p className="text-sm font-medium truncate text-white">{user?.name}</p>
                                <p className="text-xs text-stone-400 truncate">مدير النظام</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4 ml-2" />
                            تسجيل الخروج
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content (Margin Right for RTL) */}
            <main className="mr-64 min-h-screen bg-stone-50 dark:bg-stone-950">
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}
