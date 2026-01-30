'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { LogOut, Link as LinkIcon } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { logout, user } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <nav className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-white">
                            <LinkIcon className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">Shortener</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            {user?.name}
                        </span>
                        <Button variant="ghost" onClick={logout} className="text-sm">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
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
