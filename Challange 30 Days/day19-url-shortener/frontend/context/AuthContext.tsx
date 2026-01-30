'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { User, AuthResponse, ApiError } from '@/types';
import toast from 'react-hot-toast';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { data } = await api.get<User>('/user');
                    setUser(data);
                } catch (error) {
                    console.error('Failed to fetch user', error);
                    localStorage.removeItem('token');
                }
            }
            setIsLoading(false);
        };

        fetchUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const { data } = await api.post<AuthResponse>('/login', { email, password });
            localStorage.setItem('token', data.token);
            setUser(data.user);
            toast.success('هلا والله! نورتنا');
            router.push('/dashboard');
        } catch (error: any) {
            const apiError = error.response?.data as ApiError;
            toast.error(apiError?.message || 'أفا! فيه خطأ بتسجيل الدخول');
            throw error;
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            const { data } = await api.post<AuthResponse>('/register', { name, email, password });
            localStorage.setItem('token', data.token);
            setUser(data.user);
            toast.success('يا هلا! تم إنشاء حسابك بنجاح');
            router.push('/dashboard');
        } catch (error: any) {
            const apiError = error.response?.data as ApiError;
            toast.error(apiError?.message || 'صار خطأ بالتسجيل، جرب مرة ثانية');
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
            localStorage.removeItem('token');
            setUser(null);
            toast.success('نشوفك على خير!');
            router.push('/login');
        } catch (error) {
            console.error("Logout error", error);
            localStorage.removeItem('token');
            setUser(null);
            router.push('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
