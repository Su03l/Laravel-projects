'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { LogOut, Link as LinkIcon, LayoutDashboard, Settings, User } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { logout, user } = useAuth();

    return (
        <div className="flex min-h-screen bg-white dark:bg-slate-950">
            {/* Sidebar - Fixed Right */}
            <aside className="fixed inset-y-0 right-0 z-50 w-72 border-l border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 hidden md:flex md:flex-col">
                {/* Logo Area */}
                <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6 dark:border-slate-800">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white">
                        <LinkIcon className="h-6 w-6" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">مختصر الروابط</span>
                </div>

                {/* User Info */}
                <div className="flex flex-col gap-1 border-b border-slate-100 px-6 py-6 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            <User className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white">{user?.name}</p>
                            <p className="text-sm text-slate-500">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2 px-4 py-6">
                    <Link href="/dashboard" className="flex items-center gap-3 rounded-xl bg-sky-600 px-4 py-3 text-white shadow-md shadow-sky-200 dark:shadow-none">
                        <LayoutDashboard className="h-6 w-6" />
                        <span className="font-bold">لوحة التحكم</span>
                    </Link>
                    {/* Placeholder Links for future */}
                    <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white">
                        <Settings className="h-6 w-6" />
                        <span className="font-medium">الإعدادات</span>
                    </button>
                </nav>

                {/* Footer / Logout */}
                <div className="border-t border-slate-100 p-4 dark:border-slate-800">
                    <Button
                        variant="ghost"
                        onClick={logout}
                        className="w-full justify-start gap-3 rounded-xl px-4 py-4 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                        <LogOut className="h-6 w-6" />
                        <span className="font-bold">تسجيل خروج</span>
                    </Button>
                </div>
            </aside>

            {/* Main Content - Left Side */}
            <main className="flex-1 p-8 md:pr-80">
                <div className="mx-auto max-w-6xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
