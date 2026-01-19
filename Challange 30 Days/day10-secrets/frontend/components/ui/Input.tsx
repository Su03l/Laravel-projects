'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', label, error, id, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={id}
                        className="block text-sm font-medium text-neutral-700 mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={id}
                    className={`
            w-full px-4 py-2.5 text-sm rounded-xl border bg-white
            transition-all duration-200
            placeholder:text-neutral-400
            focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent
            ${error
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }
            ${className}
          `}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-sm text-red-600">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
