export interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface Link {
    id: number;
    user_id: number;
    original_url: string;
    short_code: string;
    name: string | null;
    visits: number;
    created_at: string;
    updated_at: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}
