'use client';

import { useAuth } from '@/providers/auth-provider';
import { Bell, Search } from 'lucide-react';

export default function Topbar() {
    const { user } = useAuth();

    return (
        <div className="sticky top-0 z-40 flex h-16 flex-shrink-0 bg-[#1a1a1a]/80 backdrop-blur-xl border-b border-white/5">
            <div className="flex-1 flex justify-between px-4 md:px-8">
                <div className="flex-1 flex items-center">
                    <div className="relative w-full max-w-md text-gray-400 focus-within:text-gray-200">
                        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                            <Search className="h-5 w-5" />
                        </div>
                        <input
                            name="search"
                            id="search"
                            className="block w-full h-full ps-10 pe-3 py-2 border-transparent text-gray-300 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm bg-transparent"
                            placeholder="Search shipments, drivers, or alerts..."
                            type="search"
                        />
                    </div>
                </div>
                <div className="ms-4 flex items-center md:ms-6 space-x-4 space-x-reverse">
                    <button className="bg-[#252525] p-2 rounded-full text-gray-400 hover:text-white focus:outline-none ring-1 ring-white/10 hover:ring-indigo-500/50 transition-all">
                        <span className="sr-only">View notifications</span>
                        <Bell className="h-5 w-5" />
                    </button>

                    {/* Profile Dropdown or Info */}
                    <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="text-end hidden md:block">
                            <p className="text-sm font-medium text-white">{user?.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{user?.role || 'Commander'}</p>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold ring-2 ring-[#1a1a1a]">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
