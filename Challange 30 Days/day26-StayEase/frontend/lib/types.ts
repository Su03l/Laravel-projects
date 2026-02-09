export type RoomType = 'standard' | 'double' | 'suite' | 'royal_suite' | 'honeymoon';
export type RoomView = 'city' | 'sea' | 'pool' | 'garden';
export type RoomStatus = 'available' | 'occupied' | 'maintenance' | 'disabled';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type UserRole = 'admin' | 'customer';
export type UserStatus = 'pending' | 'active' | 'suspended';
export type PackageType = 'basic' | 'half_board' | 'royal';

export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    status: UserStatus;
    avatar?: string;
    avatar_url?: string;
    two_factor_enabled: boolean;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
}

export interface Amenity {
    id: number;
    name: string;
    icon?: string;
}

export interface RoomImage {
    id: number;
    room_id: number;
    image_path: string;
    url: string;
    is_featured: boolean;
}

export interface Room {
    id: number;
    room_number: string;
    floor: number;
    type: RoomType;
    view: RoomView;
    price_per_night: number;
    capacity_adults: number;
    capacity_kids: number;
    size_sqm: number;
    status: RoomStatus;
    average_rating: number;
    amenities?: Amenity[];
    images?: RoomImage[];
    created_at: string;
    updated_at: string;
}

export interface Package {
    id: number;
    name: string;
    type: PackageType;
    price_multiplier: number;
    features: string[];
}

export interface Booking {
    id: number;
    user_id: number;
    room_id: number;
    package_id: number;
    check_in: string;
    check_out: string;
    total_price: number;
    status: BookingStatus;
    notes?: string;
    room?: Room;
    package?: Package;
    user?: User;
    review?: Review;
    created_at: string;
    updated_at: string;
}

export interface Review {
    id: number;
    user_id: number;
    room_id: number;
    booking_id: number;
    rating: number;
    comment: string;
    is_approved: boolean;
    user?: User;
    created_at: string;
    updated_at: string;
}

export interface Service {
    id: number;
    name: string;
    description?: string;
    price: number;
    category: string;
    image?: string;
}

export interface ServiceOrder {
    service_id: number;
    quantity: number;
    price_at_order: number;
    status: string;
    created_at: string;
    service?: Service;
}

export interface ApiResponse<T> {
    message?: string;
    data?: T;
    errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface LoginResponse {
    status?: '2fa_required';
    token?: string;
    user?: User;
    data?: {
        token?: string;
        user?: User;
    };
}

export interface DashboardStats {
    total_revenue: number;
    total_bookings: number;
    active_bookings: number;
    available_rooms: number;
    occupied_rooms: number;
    maintenance_rooms: number;
    occupancy_rate: number;
    pending_bookings: number;
    recent_bookings: Booking[];
    monthly_revenue: { month: string; revenue: number }[];
}

export interface LoginFormData {
    email: string;
    password: string;
    remember?: boolean;
}

export interface RegisterFormData {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
}

export interface BookingFormData {
    room_id: number;
    package_id: number;
    check_in: string;
    check_out: string;
    notes?: string;
    coupon_code?: string;
}

export interface SearchFilters {
    check_in?: string;
    check_out?: string;
    type?: RoomType;
    view?: RoomView;
    min_price?: number;
    max_price?: number;
    capacity?: number;
}
