export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: 'admin' | 'employee' | 'user';
    avatar?: string;
    two_factor_enabled?: boolean;
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
    status?: string; // for '2fa_required'
    email?: string;  // for '2fa_required'
}

export interface LoginResponse {
    token?: string;
    user?: User;
    status?: '2fa_required';
    email?: string; // returned when 2fa is required
    message?: string;
}

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}

export interface AdminUser extends User {
    is_banned: boolean;
    ban_expires_at?: string;
}
