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
    const baseStyles = "px-6 py-2.5 rounded-xl font-bold transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

    const variants = {
        primary: "bg-sky-500 hover:bg-sky-600 text-white focus:ring-sky-100 shadow-md shadow-sky-100",
        outline: "border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 focus:ring-slate-100",
        danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-100 shadow-md shadow-red-100",
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], className)}
            {...props}
        />
    );
};

export default Button;
