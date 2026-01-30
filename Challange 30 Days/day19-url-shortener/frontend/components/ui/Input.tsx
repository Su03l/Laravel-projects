import React, { forwardRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: LucideIcon;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, type = "text", icon: Icon, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === 'password';
        const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

        return (
            <div className="w-full">
                {label && (
                    <label className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-200">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {Icon && (
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                            <Icon className="h-6 w-6 text-slate-400" />
                        </div>
                    )}
                    <input
                        ref={ref}
                        type={inputType}
                        className={twMerge(
                            "w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-lg placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
                            Icon && "pr-12",
                            isPassword && "pl-12",
                            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
                            className
                        )}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                            {showPassword ? (
                                <EyeOff className="h-6 w-6" />
                            ) : (
                                <Eye className="h-6 w-6" />
                            )}
                        </button>
                    )}
                </div>
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
