'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem } from '@/types';

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="flex items-center gap-1 text-sm">
            <Link
                href="/dashboard"
                className="flex items-center gap-1 px-2 py-1 rounded-md transition-colors hover:bg-white/10"
                style={{ color: 'var(--text-secondary)' }}
            >
                <Home className="w-4 h-4" />
                <span>Home</span>
            </Link>

            {items.map((item, index) => (
                <div key={item.id ?? 'root'} className="flex items-center gap-1">
                    <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />

                    {index === items.length - 1 ? (
                        <span className="px-2 py-1 text-white font-medium">{item.name}</span>
                    ) : (
                        <Link
                            href={item.id ? `/folder/${item.id}` : '/dashboard'}
                            className="px-2 py-1 rounded-md transition-colors hover:bg-white/10"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            {item.name}
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    );
}
