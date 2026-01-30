'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { LogOut, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { logout, user } = useAuth();

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            <nav className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-white">
                                <LinkIcon className="h-5 w-5" />
                            </div>
                            <span className="text-lg font-bold text-slate-900 dark:text-white">مختصر الروابط</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            هلا {user?.name}
                        </span>
                        <Button variant="ghost" onClick={logout} className="text-sm text-red-600 hover:bg-red-50 hover:text-red-700">
                            <LogOut className="ml-2 h-4 w-4" />
                            تسجيل خروج
                        </Button>
                    </div>
                </div>
            </nav>
            <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
}
