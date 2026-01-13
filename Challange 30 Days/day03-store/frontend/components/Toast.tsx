'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        onClick={() => removeToast(toast.id)}
                        className={`
              px-6 py-4 shadow-lg cursor-pointer transform transition-all duration-300
              animate-slide-in border-2 border-black
              ${toast.type === 'success' ? 'bg-white text-black' : ''}
              ${toast.type === 'error' ? 'bg-black text-white' : ''}
              ${toast.type === 'info' ? 'bg-gray-100 text-black' : ''}
            `}
                    >
                        <div className="flex items-center gap-3">
                            {toast.type === 'success' && (
                                <span className="text-xl">✓</span>
                            )}
                            {toast.type === 'error' && (
                                <span className="text-xl">✕</span>
                            )}
                            {toast.type === 'info' && (
                                <span className="text-xl">ℹ</span>
                            )}
                            <span className="font-medium">{toast.message}</span>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
