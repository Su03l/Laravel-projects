'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgColor = {
        success: 'bg-black',
        error: 'bg-black border-2 border-red-500',
        info: 'bg-gray-800',
    }[type];

    const IconComponent = {
        success: CheckCircle,
        error: XCircle,
        info: Info,
    }[type];

    const iconColor = type === 'error' ? 'text-red-500' : 'text-white';

    return (
        <div
            className={`fixed bottom-4 left-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 z-50 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
            dir="rtl"
        >
            <IconComponent className={`w-5 h-5 ${iconColor}`} />
            <span className="font-medium">{message}</span>
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                }}
                className="mr-2 hover:bg-white/20 rounded-full p-1 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

// Toast Container for managing multiple toasts
interface ToastItem {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContainerProps {
    toasts: ToastItem[];
    removeToast: (id: number) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
    return (
        <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
            {toasts.map((toast, index) => (
                <div
                    key={toast.id}
                    style={{ transform: `translateY(-${index * 10}px)` }}
                >
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                </div>
            ))}
        </div>
    );
}
