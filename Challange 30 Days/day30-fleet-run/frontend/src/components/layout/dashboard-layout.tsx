'use client';

import Sidebar from '@/components/layout/sidebar';
import Topbar from '@/components/layout/topbar';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-[#1a1a1a]">
            <Sidebar />
            <div className="md:pr-64 flex flex-col min-h-screen">
                <Topbar />
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
