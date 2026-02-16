'use client';

import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEcho } from '@/providers/echo-provider';
import { Driver } from '@/types/api';
import { renderToString } from 'react-dom/server';
import { Truck, Navigation } from 'lucide-react';
import api from '@/lib/axios';

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle auto-zoom
function MapBounds({ drivers }: { drivers: Driver[] }) {
    const map = useMap();

    useEffect(() => {
        if (drivers.length > 0) {
            const bounds = L.latLngBounds(drivers.map(d => [d.current_lat || 0, d.current_lng || 0]));
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [drivers, map]);

    return null;
}

export default function LiveMap() {
    const echo = useEcho();
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

    // Fetch initial drivers
    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await api.get('/drivers');
                setDrivers(response.data.data);
            } catch (error) {
                console.error("Failed to fetch drivers:", error);
                // Mock data for demo
                setDrivers([
                    { id: 1, user_id: 1, current_lat: 24.7136, current_lng: 46.6753, status: 'online', vehicle_type: 'Truck', license_plate: 'KSA-123', last_active: 'Now', user: { id: 1, name: 'Ahmed', role: 'driver', email: 'a@a.com', created_at: '', updated_at: '' } },
                    { id: 2, user_id: 2, current_lat: 24.7236, current_lng: 46.6853, status: 'busy', vehicle_type: 'Van', license_plate: 'KSA-456', last_active: 'Now', user: { id: 2, name: 'Khalid', role: 'driver', email: 'k@k.com', created_at: '', updated_at: '' } },
                ]);
            }
        };

        fetchDrivers();
    }, []);

    // Real-time updates
    useEffect(() => {
        if (!echo) return;

        const channel = echo.private('fleet');

        channel.listen('.driver.moved', (e: { driver_id: number; lat: number; lng: number; status: string }) => {
            console.log("Event received:", e);
            setDrivers(prev => prev.map(driver => {
                if (driver.id === e.driver_id) {
                    return {
                        ...driver,
                        current_lat: e.lat,
                        current_lng: e.lng,
                        status: e.status as any,
                        last_active: new Date().toISOString()
                    };
                }
                return driver;
            }));
        });

        return () => {
            channel.stopListening('.driver.moved');
        };
    }, [echo]);

    const getTruckIcon = (status: string) => {
        let colorClass = 'text-gray-500';
        if (status === 'online') colorClass = 'text-green-500';
        if (status === 'busy') colorClass = 'text-red-500';
        if (status === 'offline') colorClass = 'text-gray-400';

        const html = renderToString(
            <div className={`p-2 bg-[#1a1a1a]/90 rounded-full border-2 border-white/20 shadow-xl ${colorClass}`}>
                <Truck className="w-6 h-6 transform -scale-x-100" />
            </div>
        );

        return L.divIcon({
            html: html,
            className: 'custom-marker-icon',
            iconSize: [40, 40],
            iconAnchor: [20, 20],
        });
    };

    return (
        <div className="h-[calc(100vh-80px)] w-full rounded-xl overflow-hidden glass-card border border-white/10 relative">
            <MapContainer
                center={[24.7136, 46.6753]} // Riyadh Default
                zoom={12}
                style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <MapBounds drivers={drivers} />

                {drivers.map((driver) => (
                    driver.current_lat && driver.current_lng ? (
                        <Marker
                            key={driver.id}
                            position={[driver.current_lat, driver.current_lng]}
                            icon={getTruckIcon(driver.status)}
                            eventHandlers={{
                                click: () => setSelectedDriver(driver),
                            }}
                        >
                            <Popup className="glass-popup">
                                <div className="p-2 min-w-[200px]">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                                            {driver.user?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{driver.user?.name}</h3>
                                            <p className="text-xs text-gray-500">{driver.vehicle_type} • {driver.license_plate}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 text-xs font-semibold">
                                        <span className={`px-2 py-0.5 rounded-full ${driver.status === 'online' ? 'bg-green-100 text-green-800' :
                                            driver.status === 'busy' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {driver.status.toUpperCase()}
                                        </span>
                                        <span className="text-gray-400">
                                            Updated: {driver.last_active && new Date(driver.last_active).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ) : null
                ))}
            </MapContainer>

            {/* Optional Overlay Stats */}
            <div className="absolute top-4 end-4 z-[400] bg-[#1a1a1a]/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl">
                <h4 className="text-white text-sm font-semibold mb-3 flex items-center">
                    <Navigation className="w-4 h-4 me-2 text-indigo-500" />
                    Fleet Status
                </h4>
                <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-gray-400">
                        <span>Total Online</span>
                        <span className="text-white font-bold">{drivers.filter(d => d.status === 'online').length}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                        <span>Busy / In-Transit</span>
                        <span className="text-white font-bold">{drivers.filter(d => d.status === 'busy').length}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                        <span>Offline</span>
                        <span className="text-white font-bold">{drivers.filter(d => d.status === 'offline').length}</span>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .leaflet-popup-content-wrapper {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.3);
                }
                .leaflet-popup-tip {
                    background: rgba(255, 255, 255, 0.95);
                }
            `}</style>
        </div>
    );
}
