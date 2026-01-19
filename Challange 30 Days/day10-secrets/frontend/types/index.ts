export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    created_at?: string;
    updated_at?: string;
}

export interface LoginCredentials {
    login: string;
    password: string;
}

export interface RegisterData {
    name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface UpdateProfileData {
    name: string;
    username: string;
    email: string;
}

export interface ChangePasswordData {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
}

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}

export interface AuthResponse {
    user: User;
    token: string;
    message?: string;
}
