'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

interface User {
    role: 'admin' | 'employee';
    email?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, role: 'admin' | 'employee') => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role') as 'admin' | 'employee' | null;

        if (storedToken && storedRole) {
            setToken(storedToken);
            setUser({ role: storedRole });
        }
        setIsLoading(false);
    }, []);

    const login = (newToken: string, newRole: 'admin' | 'employee') => {
        setToken(newToken);
        setUser({ role: newRole });
        localStorage.setItem('token', newToken);
        localStorage.setItem('role', newRole);
        toast.success('Logged in successfully');
        router.push('/dashboard');
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        toast.success('Logged out');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
