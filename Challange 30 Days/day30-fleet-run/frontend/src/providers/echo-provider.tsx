'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Make Pusher available globally
if (typeof window !== 'undefined') {
    (window as any).Pusher = Pusher;
}

const EchoContext = createContext<Echo<any> | null>(null);

export const useEcho = () => useContext(EchoContext);

export default function EchoProvider({ children }: { children: React.ReactNode }) {
    const [echoInstance, setEchoInstance] = useState<Echo<any> | null>(null);

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        const echo = new Echo({
            broadcaster: 'reverb',
            key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
            wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
            wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT || 8085),
            wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT || 8085),
            forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'https') === 'https',
            enabledTransports: ['ws', 'wss'],
            authEndpoint: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace('/api', '') + '/broadcasting/auth',
            auth: {
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                    Accept: 'application/json',
                },
            },
        });

        // Use a timeout or next tick to avoid synchronous setState warning if strictly enforced,
        // but often setting it once on mount is fine. The lint is cautious.
        setEchoInstance(echo);

        return () => {
            echo.disconnect();
        };
    }, []);

    return (
        <EchoContext.Provider value={echoInstance}>
            {children}
        </EchoContext.Provider>
    );
}
