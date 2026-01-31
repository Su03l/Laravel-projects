import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    color: 'green' | 'red' | 'sky';
}

export default function StatsCard({ title, value, icon: Icon, color }: StatsCardProps) {
    const colorClasses = {
        green: 'text-green-600 bg-green-50 border-green-100',
        red: 'text-red-600 bg-red-50 border-red-100',
        sky: 'text-sky-600 bg-sky-50 border-sky-100',
    };

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className={`absolute top-0 left-0 w-1 h-full ${colorClasses[color].split(' ')[1].replace('bg-', 'bg-')}-500 opacity-0 transition-opacity group-hover:opacity-100`}></div>
            <div className="flex items-center justify-between relative z-10">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <p className="text-3xl font-black text-gray-900 tracking-tight">{value}</p>
                </div>
                <div className={`rounded-xl p-3 shadow-inner ${colorClasses[color]}`}>
                    <Icon className="h-7 w-7" />
                </div>
            </div>
            {/* Decoration circle */}
            <div className={`absolute -bottom-4 -right-4 h-24 w-24 rounded-full opacity-5 ${colorClasses[color].split(' ')[0]}`}></div>
        </div>
    );
}
