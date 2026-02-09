'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
        },
    },
});

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <NextThemesProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
            >
                {children}
                <Toaster
                    position="top-right"
                    richColors
                    closeButton
                    toastOptions={{
                        classNames: {
                            toast: 'font-sans',
                            title: 'font-medium',
                        },
                    }}
                />
            </NextThemesProvider>
        </QueryClientProvider>
    );
}
