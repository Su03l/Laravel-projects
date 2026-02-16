'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { DashboardStats } from '@/types/api';
import { Users, Package, Wrench, Activity } from 'lucide-react';
import { cn } from '@/lib/utils'; // Ensure this utility exists

export default function DashboardPage() {
    const { data: stats, isLoading } = useQuery<DashboardStats>({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            // Mock data for initial dev or if API fails
            try {
                const response = await api.get('/dashboard/stats');
                return response.data.data;
            } catch (error) {
                console.warn("API not ready, using mock data");
                return {
                    total_drivers: 12,
                    active_shipments: 8,
                    maintenance_vehicles: 2,
                    online_drivers: 5
                };
            }
        }
    });

    const statCards = [
        {
            name: 'Total Drivers',
            value: stats?.total_drivers,
            icon: Users,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20'
        },
        {
            name: 'Active Shipments',
            value: stats?.active_shipments,
            icon: Package,
            color: 'text-indigo-500',
            bg: 'bg-indigo-500/10',
            border: 'border-indigo-500/20'
        },
        {
            name: 'In Maintenance',
            value: stats?.maintenance_vehicles,
            icon: Wrench,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10',
            border: 'border-orange-500/20'
        },
        {
            name: 'Online Now',
            value: stats?.online_drivers,
            icon: Activity,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
            border: 'border-green-500/20'
        },
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 rounded-xl bg-[#252525] animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Overview</h2>
                <p className="text-gray-400 mt-2">Real-time logistics monitoring.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <div
                        key={stat.name}
                        className={cn(
                            "relative overflow-hidden rounded-xl p-6 glass-card border transition-all duration-300 hover:scale-[1.02]",
                            stat.border
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                                <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                            </div>
                            <div className={cn("p-3 rounded-xl", stat.bg)}>
                                <stat.icon className={cn("h-6 w-6", stat.color)} />
                            </div>
                        </div>
                        {/* Decorative glow */}
                        <div className={cn("absolute -right-6 -bottom-6 h-24 w-24 rounded-full blur-2xl opacity-20 pointer-events-none", stat.color.replace('text-', 'bg-'))} />
                    </div>
                ))}
            </div>

            {/* Placeholder for Recent Activity or Map Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-xl glass-card border border-white/5 p-6 h-[400px] flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-4">Live Fleet Map</h3>
                    <div className="flex-1 bg-[#1a1a1a] rounded-lg border border-white/5 flex items-center justify-center text-gray-500">
                        Map Component Loading...
                    </div>
                </div>

                <div className="rounded-xl glass-card border border-white/5 p-6 h-[400px]">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Alerts</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                                <div className="h-2 w-2 mt-2 rounded-full bg-indigo-500" />
                                <div>
                                    <p className="text-sm text-gray-300">Driver Ahmed started shipment #SH-{1000 + i}</p>
                                    <p className="text-xs text-gray-500 mt-1">2 mins ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
