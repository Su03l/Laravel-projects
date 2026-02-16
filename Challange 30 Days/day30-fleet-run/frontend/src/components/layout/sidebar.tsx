'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Map, Truck, Package, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Live Map', href: '/map', icon: Map },
    { name: 'Shipments', href: '/shipments', icon: Package },
    { name: 'Drivers', href: '/drivers', icon: Truck },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <div className="hidden md:flex w-64 flex-col fixed inset-y-0 right-0 z-50">
            <div className="flex-1 flex flex-col min-h-0 bg-[#1a1a1a]/80 backdrop-blur-xl border-l border-white/5">
                <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-white/5 gap-2">
                    <Truck className="h-8 w-8 text-indigo-500" />
                    <span className="text-xl font-bold tracking-wider text-white">FleetRun</span>
                </div>

                <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
                    <nav className="mt-5 flex-1 px-2 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        isActive
                                            ? 'bg-indigo-600/10 text-indigo-400 border-r-2 border-indigo-500'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white',
                                        'group flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 gap-3'
                                    )}
                                >
                                    <item.icon
                                        className={cn(
                                            isActive ? 'text-indigo-400' : 'text-gray-400 group-hover:text-white',
                                            'flex-shrink-0 h-5 w-5 transition-colors duration-200'
                                        )}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex-shrink-0 flex border-t border-white/5 p-4">
                    <button
                        onClick={logout}
                        className="flex-shrink-0 w-full group block"
                    >
                        <div className="flex items-center gap-3">
                            <div className="inline-block h-9 w-9 rounded-full bg-red-500/10 flex items-center justify-center">
                                <LogOut className="h-5 w-5 text-red-400 group-hover:text-red-300" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white group-hover:text-gray-300 text-right">
                                    تسجيل الخروج
                                </p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
