'use client';

import { Loader2 } from 'lucide-react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
}

export default function Spinner({ size = 'md' }: SpinnerProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    }[size];

    return (
        <Loader2 className={`${sizeClasses} text-black animate-spin`} />
    );
}

export function FullPageSpinner() {
    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-40">
            <div className="flex flex-col items-center gap-4">
                <Spinner size="lg" />
                <p className="text-gray-600 font-medium">جاري التحميل...</p>
            </div>
        </div>
    );
}
