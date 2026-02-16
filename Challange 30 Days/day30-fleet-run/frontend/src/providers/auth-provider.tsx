'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { User } from '@/types/api';
import { toast } from 'sonner';

// AuthContextType interface 
interface AuthContextType {
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isLoading: boolean;
}

// AuthContext
const AuthContext = createContext<AuthContextType | null>(null);

// useAuth hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// AuthProvider component
export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const router = useRouter();
    const queryClient = useQueryClient();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
        setIsInitialized(true);
    }, []);

    // useQuery hook for user data
    const { data: user, isLoading: isQueryLoading, isError } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            if (!token) return null;
            try {
                const response = await api.get('/user');
                return response.data;
            } catch (error) {
                localStorage.removeItem('token');
                setToken(null);
                throw error;
            }
        },
        enabled: !!token && isInitialized,
        retry: false,
    });

    const isLoading = !isInitialized || (!!token && isQueryLoading);

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        queryClient.setQueryData(['user'], newUser);
        router.push('/dashboard');
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            localStorage.removeItem('token');
            setToken(null);
            queryClient.setQueryData(['user'], null);
            router.push('/login');
            toast.success('Logged out successfully');
        }
    };

    return (
        <AuthContext.Provider value={{ user: user || null, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}
