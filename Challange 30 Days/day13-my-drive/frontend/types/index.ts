// User types
export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    avatar?: string;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
}

// Auth types
export interface AuthResponse {
    user: User;
    token: string;
    message?: string;
}

export interface LoginCredentials {
    login: string;  // Can be email or username
    password: string;
}

export interface RegisterCredentials {
    name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
}

// Folder types
export interface Folder {
    id: number;
    name: string;
    parent_id: number | null;
    user_id: number;
    created_at: string;
    updated_at: string;
}

export interface FolderContent {
    folder: Folder;
    files: FileItem[];
    subfolders: Folder[];
    breadcrumbs: BreadcrumbItem[];
}

// File types
export interface FileItem {
    id: number;
    name: string;
    original_name: string;
    path: string;
    mime_type: string;
    size: number;
    folder_id: number | null;
    user_id: number;
    created_at: string;
    updated_at: string;
}

// Breadcrumb for navigation
export interface BreadcrumbItem {
    id: number | null;
    name: string;
}

// API Response types
export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}
