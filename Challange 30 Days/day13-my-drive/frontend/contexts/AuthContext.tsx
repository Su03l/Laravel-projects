'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, LoginCredentials, RegisterCredentials } from '@/types';
import { authApi, userApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const refreshUser = useCallback(async () => {
        try {
            const userData = await userApi.getProfile();
            setUser(userData);
        } catch {
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }, []);

    // Check token on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await userApi.getProfile();
                    setUser(userData);
                } catch {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await authApi.login(credentials);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            setUser(response.user);
            toast.success('تم تسجيل الدخول بنجاح!');
            router.push('/dashboard');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'فشل تسجيل الدخول');
            throw error;
        }
    };

    const register = async (credentials: RegisterCredentials) => {
        try {
            const response = await authApi.register(credentials);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            setUser(response.user);
            toast.success('تم إنشاء الحساب بنجاح!');
            router.push('/dashboard');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'فشل إنشاء الحساب');
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch {
            // Ignore logout errors
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            toast.success('تم تسجيل الخروج');
            router.push('/login');
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
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
