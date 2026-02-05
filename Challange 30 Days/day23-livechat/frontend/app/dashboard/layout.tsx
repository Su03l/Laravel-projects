'use client';

import Sidebar from '@/components/Chat/Sidebar';
import { useStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, setUser } = useStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                router.push('/login');
                return;
            }

            if (!user) {
                try {
                    const { data } = await axios.get('/me');
                    setUser(data);
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                    localStorage.removeItem('token');
                    router.push('/login');
                }
            }

            setIsLoading(false);
        };

        fetchUser();
    }, [user, setUser, router]);

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-slate-50 flex overflow-hidden" dir="rtl">
            {/* Right Sidebar - Conversations (Actually Left in RTL but visually Right) */}
            <div className="w-full md:w-80 lg:w-96 h-full flex-shrink-0 z-20">
                <Sidebar />
            </div>

            {/* Main Content Area - Chat Window */}
            <main className="flex-1 h-full relative bg-white shadow-xl shadow-slate-200/50 z-10 rounded-r-[32px] overflow-hidden mr-[-20px] md:mr-0 border-r border-slate-100">
                {children}
            </main>
        </div>
    );
}
