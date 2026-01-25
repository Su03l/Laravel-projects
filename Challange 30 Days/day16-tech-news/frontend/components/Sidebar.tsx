'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface SidebarProps {
    title: string;
    items: {
        id: number | string;
        label: string;
        href?: string;
        meta?: string; // Date or Author for news
    }[];
    type?: 'categories' | 'news';
}

export default function Sidebar({ title, items, type = 'categories' }: SidebarProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-lg font-bold mb-4 border-l-4 border-primary pl-3">
                {title}
            </h3>
            <div className="space-y-3">
                {items.map((item) => (
                    <div key={item.id} className="group">
                        {type === 'categories' ? (
                            <Link
                                href={item.href || '#'}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-gray-700 font-medium group-hover:text-primary transition-colors">
                                    {item.label}
                                </span>
                                <span className="text-gray-400 text-xs bg-gray-100 px-2 py-1 rounded-full group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                    Browse
                                </span>
                            </Link>
                        ) : (
                            <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all"
                            >
                                <h4 className="text-sm font-semibold text-gray-800 leading-snug mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                                    {item.label}
                                </h4>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-gray-500">{item.meta}</span>
                                    <ArrowUpRight className="w-3 h-3 text-gray-400 group-hover:text-primary" />
                                </div>
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
