import { ButtonHTMLAttributes, FC } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'danger';
    className?: string;
}

const Button: FC<ButtonProps> = ({ variant = 'primary', className, ...props }) => {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-sky-500 hover:bg-sky-600 text-white focus:ring-sky-500",
        outline: "border border-slate-900 text-slate-900 hover:bg-slate-50 focus:ring-slate-900",
        danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500", // Added for Checkout if needed
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], className)}
            {...props}
        />
    );
};

export default Button;
