'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Driver } from '@/types/api';
import { Truck, Search, MoreHorizontal, User, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DriversPage() {
    const { data: drivers, isLoading } = useQuery<Driver[]>({
        queryKey: ['drivers'],
        queryFn: async () => {
            try {
                const response = await api.get('/drivers');
                return response.data.data;
            } catch (error) {
                // Mock data
                return [
                    { id: 1, user_id: 1, current_lat: 24.7136, current_lng: 46.6753, status: 'online', vehicle_type: 'شاحنة ثقيلة', license_plate: 'أ ب ج 123', last_active: 'منذ دقيقتين', user: { name: 'أحمد القحطاني', email: 'ahmed@fleet.com' } } as any,
                    { id: 2, user_id: 2, current_lat: 24.7236, current_lng: 46.6853, status: 'busy', vehicle_type: 'فان بضائع', license_plate: 'د هـ و 789', last_active: 'الآن', user: { name: 'خالد بن فهد', email: 'khalid@fleet.com' } } as any,
                    { id: 3, user_id: 3, current_lat: 24.7336, current_lng: 46.6953, status: 'offline', vehicle_type: 'شاحنة تبريد', license_plate: 'ر ز س 456', last_active: '8 دقائق', user: { name: 'سلطان محمد', email: 'sultan@fleet.com' } } as any,
                ];
            }
        }
    });

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-32 bg-[#252525] rounded-3xl animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-64 bg-[#252525] rounded-3xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header with Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        إدارة الأسطول
                        <span className="text-sm font-normal text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                            {drivers?.length || 0} سائقين
                        </span>
                    </h2>
                    <p className="text-gray-400 mt-2">متابعة حالة السائقين وإدارة أذوناتهم في الوقت الحقيقي.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="بحث عن سائق..."
                            className="bg-[#252525] border border-white/5 rounded-xl pr-10 pl-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-64"
                        />
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl transition-all font-bold shadow-lg shadow-indigo-600/20">
                        إضافة سائق +
                    </button>
                </div>
            </div>

            {/* Drivers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drivers?.map((driver) => (
                    <div key={driver.id} className="glass-card bg-[#1a1a1a]/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                        {/* Decorative Background Glow */}
                        <div className="absolute -right-20 -top-20 w-40 h-40 bg-indigo-600/5 blur-[100px] group-hover:bg-indigo-600/10 transition-all" />

                        <div className="flex justify-between items-start relative z-10">
                            <div className="h-16 w-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-600/20">
                                {driver.user?.name?.charAt(0)}
                            </div>
                            <button className="p-2 text-gray-600 hover:text-white transition-colors bg-white/5 rounded-lg">
                                <MoreHorizontal className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-6 space-y-1 relative z-10 text-right">
                            <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-wide">
                                {driver.user?.name}
                            </h3>
                            <div className="flex items-center justify-end gap-2 text-gray-500">
                                <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                                <span className="text-xs">{driver.vehicle_type}</span>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-4 relative z-10">
                            <div className="bg-white/5 rounded-2xl p-3 text-right">
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter mb-1">الحالة</p>
                                <div className="flex items-center justify-end gap-2">
                                    <div className={cn("h-1.5 w-1.5 rounded-full",
                                        driver.status === 'online' ? 'bg-green-500' :
                                            driver.status === 'busy' ? 'bg-red-500' : 'bg-gray-500'
                                    )} />
                                    <span className="text-sm text-gray-200 font-medium capitalize">{driver.status}</span>
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-3 text-right">
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter mb-1">اللوحة</p>
                                <p className="text-sm text-white font-mono">{driver.license_plate}</p>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
                            <span className="text-[10px] text-gray-600 flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {driver.user?.email}
                            </span>
                            <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/5 px-2 py-0.5 rounded">
                                {driver.last_active}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
