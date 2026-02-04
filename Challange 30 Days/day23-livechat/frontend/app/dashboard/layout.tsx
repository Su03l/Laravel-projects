'use client';

import Sidebar from '@/components/Chat/Sidebar';
import { useStore } from '@/lib/store';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { activeConversationId } = useStore();

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
