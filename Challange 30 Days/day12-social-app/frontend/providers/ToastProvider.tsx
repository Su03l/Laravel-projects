'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
    return (
        <Toaster
            position="bottom-left"
            reverseOrder={false}
            toastOptions={{
                duration: 4000,
                style: {
                    background: '#000',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0',
                    padding: '16px',
                    fontFamily: 'Tajawal, sans-serif',
                },
                success: {
                    iconTheme: {
                        primary: '#fff',
                        secondary: '#000',
                    },
                },
                error: {
                    iconTheme: {
                        primary: '#fff',
                        secondary: '#000',
                    },
                },
            }}
        />
    );
}
