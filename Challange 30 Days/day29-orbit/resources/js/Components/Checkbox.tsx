import { InputHTMLAttributes } from 'react';

export default function Checkbox({
    className = '',
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-white/[0.12] bg-white/[0.04] text-indigo-500 shadow-sm focus:ring-indigo-500 focus:ring-offset-0 transition-colors ' +
                className
            }
        />
    );
}
