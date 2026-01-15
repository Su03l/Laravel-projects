'use client';

import { useToast } from '@/context/ToastContext';

export default function ToastContainer() {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
            flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl backdrop-blur-xl
            animate-slide-up cursor-pointer transition-all duration-300 hover:scale-105
            min-w-[320px] border
            ${toast.type === 'success'
                            ? 'bg-white/95 dark:bg-neutral-900/95 border-neutral-200 dark:border-neutral-700'
                            : toast.type === 'error'
                                ? 'bg-white/95 dark:bg-neutral-900/95 border-red-200 dark:border-red-900'
                                : 'bg-white/95 dark:bg-neutral-900/95 border-neutral-200 dark:border-neutral-700'
                        }
          `}
                    onClick={() => removeToast(toast.id)}
                >
                    {/* Icon */}
                    <div className={`
            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
            ${toast.type === 'success'
                            ? 'bg-black dark:bg-white'
                            : toast.type === 'error'
                                ? 'bg-red-500'
                                : 'bg-neutral-500'
                        }
          `}>
                        {toast.type === 'success' && (
                            <svg className="w-4 h-4 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                        {toast.type === 'error' && (
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                        {toast.type === 'info' && (
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </div>

                    {/* Message */}
                    <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        {toast.message}
                    </span>

                    {/* Close button */}
                    <button
                        className="ml-auto text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                        onClick={(e) => { e.stopPropagation(); removeToast(toast.id); }}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    );
}
