'use client';

import QueryProvider from '@/providers/query-provider';
import EchoProvider from '@/providers/echo-provider';
import AuthProvider from '@/providers/auth-provider';
import { Toaster } from 'sonner';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryProvider>
            <EchoProvider>
                <AuthProvider>
                    {children}
                    <Toaster position="top-left" richColors theme="dark" />
                </AuthProvider>
            </EchoProvider>
        </QueryProvider>
    );
}
