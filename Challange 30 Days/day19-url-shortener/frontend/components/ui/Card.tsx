import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
    return (
        <div
            className={twMerge("rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950", className)}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className, ...props }: CardProps) {
    return <div className={twMerge("p-6", className)} {...props}>{children}</div>;
}

export function CardTitle({ children, className, ...props }: CardProps) {
    return <h3 className={twMerge("text-lg font-semibold leading-none tracking-tight", className)} {...props}>{children}</h3>;
}

export function CardContent({ children, className, ...props }: CardProps) {
    return <div className={twMerge("p-6 pt-0", className)} {...props}>{children}</div>;
}

export function CardFooter({ children, className, ...props }: CardProps) {
    return <div className={twMerge("flex items-center p-6 pt-0", className)} {...props}>{children}</div>;
}
