'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, username: string, email: string, password: string, password_confirmation: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await api.post('/auth/login', { login: email, password });
            const { token: newToken, user: newUser } = response.data;

            setToken(newToken);
            setUser(newUser);
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(newUser));

            toast.success('تم تسجيل الدخول بنجاح');
            return true;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            const message = err.response?.data?.message || 'فشل تسجيل الدخول';
            toast.error(message);
            return false;
        }
    };

    const register = async (
        name: string,
        username: string,
        email: string,
        password: string,
        password_confirmation: string
    ): Promise<boolean> => {
        try {
            const response = await api.post('/auth/register', {
                name,
                username,
                email,
                password,
                password_confirmation,
            });
            const { token: newToken, user: newUser } = response.data;

            setToken(newToken);
            setUser(newUser);
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(newUser));

            toast.success('تم إنشاء الحساب بنجاح');
            return true;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            const message = err.response?.data?.message || 'فشل إنشاء الحساب';
            toast.error(message);
            return false;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await api.post('/auth/logout');
        } catch {
            // Ignore errors
        } finally {
            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            toast.success('تم تسجيل الخروج');
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                isLoading,
                login,
                register,
                logout,
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
