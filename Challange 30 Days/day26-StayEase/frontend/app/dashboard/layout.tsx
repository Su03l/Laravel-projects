'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, Calendar, Utensils,
    Heart, User, LogOut, Building2, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/auth-store';

const sidebarLinks = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'لوحة التحكم' },
    { href: '/dashboard/bookings', icon: Calendar, label: 'حجوزاتي' },
    { href: '/dashboard/room-service', icon: Utensils, label: 'خدمة الغرف' },
    { href: '/dashboard/favorites', icon: Heart, label: 'المفضلة' },
    { href: '/dashboard/profile', icon: User, label: 'الملف الشخصي' },
];

export default function DashboardLayout({
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
        <div className="min-h-screen bg-background" dir="rtl">
            {/* Sidebar (Right side for RTL) */}
            <aside className="fixed top-0 right-0 z-40 w-64 h-screen border-l bg-card text-right">
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center gap-2 px-6 py-5 border-b">
                        <Building2 className="h-7 w-7 text-primary" />
                        <span className="font-display text-xl font-bold">
                            Stay<span className="text-primary">Ease</span>
                        </span>
                    </div>

                    {/* Back to Home */}
                    <div className="px-4 py-3">
                        <Button variant="ghost" size="sm" asChild className="w-full justify-start text-right">
                            <Link href="/">
                                <ChevronRight className="h-4 w-4 ml-2" />
                                العودة للرئيسية
                            </Link>
                        </Button>
                    </div>

                    <Separator />

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                        {sidebarLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all justify-start',
                                        isActive
                                            ? 'bg-primary text-primary-foreground shadow-md'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    )}
                                >
                                    <link.icon className="h-5 w-5 ml-2" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <Separator />

                    {/* User Info & Logout */}
                    <div className="p-4">
                        <div className="flex items-center gap-3 px-4 py-3 mb-2 flex-row-reverse">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-semibold">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0 text-right">
                                <p className="text-sm font-medium truncate">{user?.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 text-right"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4 ml-2" />
                            تسجيل الخروج
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content (Margin Right for RTL) */}
            <main className="mr-64 min-h-screen">
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}
