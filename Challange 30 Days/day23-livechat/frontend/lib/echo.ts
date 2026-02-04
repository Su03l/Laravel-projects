import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo: Echo<'pusher'>;
    }
}

// Make Pusher available globally (required by Echo)
if (typeof window !== 'undefined') {
    window.Pusher = Pusher;
}

let echo: Echo<'pusher'> | null = null;

export const getEcho = (): Echo<'pusher'> | null => {
    if (typeof window === 'undefined') return null;

    if (!echo) {
        const token = localStorage.getItem('token');

        echo = new Echo({
            broadcaster: 'pusher',
            key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || 'xjn9ymb6gsronyqtdfxo',
            wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost',
            wsPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || '8081'),
            wssPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || '8081'),
            forceTLS: false,
            disableStats: true,
            cluster: 'mt1',
            enabledTransports: ['ws', 'wss'],
            authEndpoint: 'http://localhost:8000/api/broadcasting/auth',
            auth: {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            },
        });
    }

    return echo;
};

export const resetEcho = () => {
    if (echo) {
        echo.disconnect();
        echo = null;
    }
};

export default getEcho;

