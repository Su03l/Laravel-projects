import React from 'react';
import { Loader2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    isLoading?: boolean;
}

export function Button({
    children,
    className,
    variant = 'primary',
    size = 'default',
    isLoading,
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const variants = {
        primary: "bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500 border border-transparent",
        secondary: "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 focus:ring-slate-200",
        ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border border-transparent",
    };

    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-lg",
        icon: "h-10 w-10 p-2",
    };

    return (
        <button
            className={twMerge(baseStyles, variants[variant], sizes[size], className)}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
}
