import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    color: 'green' | 'red' | 'sky';
}

export default function StatsCard({ title, value, icon: Icon, color }: StatsCardProps) {
    const colorClasses = {
        green: 'text-green-600 bg-green-50',
        red: 'text-red-600 bg-red-50',
        sky: 'text-sky-600 bg-sky-50',
    };

    return (
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
}
