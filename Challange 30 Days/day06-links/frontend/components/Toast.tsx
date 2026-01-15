'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, isVisible, onClose, duration = 3000 }: ToastProps) {
    // Track whether we're in the exit animation phase
    const [isExiting, setIsExiting] = useState(false);
    // Track a unique key for each toast appearance to reset state
    const [toastKey, setToastKey] = useState(0);

    useEffect(() => {
        if (!isVisible) {
            // When toast closes, increment key so next appearance starts fresh
            // This runs after the component is no longer shown
            const resetTimer = setTimeout(() => {
                setToastKey(prev => prev + 1);
            }, 0);
            return () => clearTimeout(resetTimer);
        }

        // Start the auto-dismiss timer
        const dismissTimer = setTimeout(() => {
            setIsExiting(true);
        }, duration);

        // After exit animation, call onClose
        const closeTimer = setTimeout(() => {
            onClose();
        }, duration + 300);

        return () => {
            clearTimeout(dismissTimer);
            clearTimeout(closeTimer);
        };
    }, [isVisible, duration, onClose]);

    // Reset isExiting when toastKey changes (new toast appearance)
    useEffect(() => {
        const resetTimer = setTimeout(() => {
            setIsExiting(false);
        }, 0);
        return () => clearTimeout(resetTimer);
    }, [toastKey]);

    // Show the toast when visible and not exiting
    const isShowing = isVisible && !isExiting;

    if (!isVisible) return null;

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 ease-out ${isShowing ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
        >
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black px-5 py-3 shadow-2xl backdrop-blur-xl">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                    <svg
                        className="h-4 w-4 text-black"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <span className="font-medium text-white">{message}</span>
            </div>
        </div>
    );
}
