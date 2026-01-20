'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/axios';

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: { login: string; password: string }) => Promise<void>;
    register: (data: { name: string; email: string; username: string; password: string; password_confirmation: string }) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.get('/user/profile');
            setUser(response.data.user || response.data);
        } catch {
            localStorage.removeItem('token');
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials: { login: string; password: string }) => {
        const response = await api.post('/auth/login', credentials);
        const { token, user: userData } = response.data;
        localStorage.setItem('token', token);
        setUser(userData);
    };

    const register = async (data: { name: string; email: string; username: string; password: string; password_confirmation: string }) => {
        await api.post('/auth/register', data);
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch {
            // Ignore errors during logout
        } finally {
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
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
