'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { User, LoginCredentials, RegisterData, UpdateProfileData, ChangePasswordData, AuthResponse } from '@/types';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: UpdateProfileData) => Promise<void>;
    changePassword: (data: ChangePasswordData) => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    // Handle mounting to prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const refreshUser = useCallback(async () => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (!token) {
                setIsLoading(false);
                return;
            }

            const response = await api.get<User>('/user/profile');
            setUser(response.data);
        } catch {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            refreshUser();
        }
    }, [mounted, refreshUser]);

    const login = async (credentials: LoginCredentials) => {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        const { user, token } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        router.push('/dashboard');
    };

    const register = async (data: RegisterData) => {
        const response = await api.post<AuthResponse>('/auth/register', data);
        const { user, token } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        router.push('/dashboard');
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch {
            // Continue with logout even if API fails
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            router.push('/login');
        }
    };

    const updateProfile = async (data: UpdateProfileData) => {
        const response = await api.put<User>('/user/profile', data);
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
    };

    const changePassword = async (data: ChangePasswordData) => {
        await api.post('/user/change-password', data);
    };

    // Show loading state until mounted to prevent hydration mismatch
    if (!mounted) {
        return (
            <AuthContext.Provider
                value={{
                    user: null,
                    isLoading: true,
                    isAuthenticated: false,
                    login,
                    register,
                    logout,
                    updateProfile,
                    changePassword,
                    refreshUser,
                }}
            >
                {children}
            </AuthContext.Provider>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                updateProfile,
                changePassword,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
