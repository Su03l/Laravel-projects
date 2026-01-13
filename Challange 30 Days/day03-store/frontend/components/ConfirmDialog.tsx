'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ConfirmDialogOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

interface ConfirmContextType {
    confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function useConfirm() {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }
    return context;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmDialogOptions>({
        title: '',
        message: '',
        confirmText: 'تأكيد',
        cancelText: 'إلغاء',
    });
    const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

    const confirm = useCallback((opts: ConfirmDialogOptions): Promise<boolean> => {
        setOptions({
            ...opts,
            confirmText: opts.confirmText || 'تأكيد',
            cancelText: opts.cancelText || 'إلغاء',
        });
        setIsOpen(true);

        return new Promise<boolean>((resolve) => {
            setResolvePromise(() => resolve);
        });
    }, []);

    const handleConfirm = () => {
        setIsOpen(false);
        resolvePromise?.(true);
    };

    const handleCancel = () => {
        setIsOpen(false);
        resolvePromise?.(false);
    };

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}

            {/* Confirm Dialog Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={handleCancel}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

                    {/* Dialog */}
                    <div
                        className="relative bg-white border-4 border-black p-8 max-w-md w-full shadow-2xl animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 border-4 border-black flex items-center justify-center">
                                <span className="text-3xl font-bold">!</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-black text-center mb-4">
                            {options.title}
                        </h2>

                        {/* Message */}
                        <p className="text-gray-600 text-center mb-8">
                            {options.message}
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleCancel}
                                className="flex-1 py-3 border-2 border-black text-black font-medium hover:bg-gray-100 transition-colors"
                            >
                                {options.cancelText}
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex-1 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
                            >
                                {options.confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    );
}
