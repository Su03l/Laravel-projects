'use client';

import { Stats } from '@/types';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface StatsCardsProps {
    stats: Stats | null;
    loading: boolean;
}

export default function StatsCards({ stats, loading }: StatsCardsProps) {
    const cards = [
        {
            title: 'إجمالي الدخل',
            value: stats?.total_income ?? 0,
            icon: TrendingUp,
            iconColor: 'text-green-500',
            bgColor: 'bg-green-50',
        },
        {
            title: 'إجمالي المصروفات',
            value: stats?.total_expense ?? 0,
            icon: TrendingDown,
            iconColor: 'text-red-500',
            bgColor: 'bg-red-50',
        },
        {
            title: 'الرصيد',
            value: stats?.balance ?? 0,
            icon: Wallet,
            iconColor: 'text-blue-500',
            bgColor: 'bg-blue-50',
        },
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-pulse"
                    >
                        <div className="flex items-center justify-between">
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                                <div className="h-8 bg-gray-200 rounded w-32"></div>
                            </div>
                            <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium mb-1">
                                    {card.title}
                                </p>
                                <p className="text-2xl font-bold text-black">
                                    ${card.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className={`${card.bgColor} p-3 rounded-xl`}>
                                <Icon className={`h-6 w-6 ${card.iconColor}`} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
