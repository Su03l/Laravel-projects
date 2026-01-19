'use client';

import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
}

export function Card({ children, className = '' }: CardProps) {
    return (
        <div className={`bg-white rounded-2xl border border-neutral-200 shadow-sm ${className}`}>
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '' }: CardProps) {
    return (
        <div className={`px-6 py-5 border-b border-neutral-100 ${className}`}>
            {children}
        </div>
    );
}

export function CardContent({ children, className = '' }: CardProps) {
    return (
        <div className={`px-6 py-5 ${className}`}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className = '' }: CardProps) {
    return (
        <h3 className={`text-lg font-semibold text-neutral-900 ${className}`}>
            {children}
        </h3>
    );
}

export function CardDescription({ children, className = '' }: CardProps) {
    return (
        <p className={`text-sm text-neutral-500 mt-1 ${className}`}>
            {children}
        </p>
    );
}
