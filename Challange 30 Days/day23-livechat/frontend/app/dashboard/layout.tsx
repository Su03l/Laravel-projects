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
        <div className="h-screen w-full bg-slate-50 flex overflow-hidden">
            {/* Left Sidebar - Conversations */}
            <div className="w-full md:w-80 lg:w-96 h-full flex-shrink-0">
                <Sidebar />
            </div>

            {/* Main Content Area - Chat Window */}
            <main className="flex-1 h-full relative bg-white shadow-xl shadow-slate-200/50 z-10 rounded-l-[32px] overflow-hidden ml-[-20px] md:ml-0 border-l border-slate-100">
                {children}
            </main>
        </div>
    );
}
