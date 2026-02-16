// User interface
export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'driver' | 'user';
    created_at: string;
    updated_at: string;
}

export interface DriveLocation {
    lat: number;
    lng: number;
}

export interface Driver {
    id: number;
    user_id: number;
    user?: User;
    current_lat: number | null;
    current_lng: number | null;
    status: 'online' | 'offline' | 'busy';
    vehicle_type: string;
    license_plate: string;
    last_active: string;
}

export interface Shipment {
    id: number;
    tracking_number: string;
    status: 'pending' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
    driver_id: number | null;
    driver?: Driver;
    pickup_address: string;
    pickup_lat: number;
    pickup_lng: number;
    delivery_address: string;
    delivery_lat: number;
    delivery_lng: number;
    proof_of_delivery_path?: string | null;
    created_at: string;
    updated_at: string;
}

export interface DashboardStats {
    total_drivers: number;
    active_shipments: number;
    maintenance_vehicles: number;
    online_drivers: number;
}
