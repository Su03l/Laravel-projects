'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import ToastContainer from '@/components/ui/ToastContainer';

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="pl-64">
                <div className="min-h-screen">
                    {children}
                </div>
            </main>

            {/* Toast Notifications */}
            <ToastContainer />
        </div>
    );
}
