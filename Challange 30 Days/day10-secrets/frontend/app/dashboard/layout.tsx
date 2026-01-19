'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/context/auth-context';
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-neutral-50">
                <Sidebar />
                <main className="ml-64 min-h-screen">
                    <div className="p-8">
                        {children}
                    </div>
                </main>
            </div>
        </AuthProvider>
    );
}
