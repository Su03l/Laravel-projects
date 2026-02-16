'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const LiveMap = dynamic(() => import('@/components/maps/live-map'), {
    ssr: false,
    loading: () => (
        <div className="h-[calc(100vh-80px)] w-full flex items-center justify-center bg-[#1a1a1a] rounded-xl border border-white/5">
            <div className="flex flex-col items-center">
                <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
                <p className="text-gray-400 animate-pulse">Initializing Satellite Connection...</p>
            </div>
        </div>
    ),
});

export default function MapPage() {
    return (
        <div className="h-full">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Live Fleet Map</h2>
                    <p className="text-gray-400 mt-1">Real-time driver tracking and status monitoring.</p>
                </div>
                <div className="flex space-x-2">
                    <span className="flex items-center text-xs text-gray-400">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        Online
                    </span>
                    <span className="flex items-center text-xs text-gray-400">
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                        Busy
                    </span>
                    <span className="flex items-center text-xs text-gray-400">
                        <span className="w-2 h-2 rounded-full bg-gray-500 mr-2"></span>
                        Offline
                    </span>
                </div>
            </div>

            <LiveMap />
        </div>
    );
}
