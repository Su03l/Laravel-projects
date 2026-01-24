import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    token: string | null;
    setAuth: (user: User, token: string) => void;
    setUser: (user: User) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            token: null,
            setAuth: (user, token) => {
                localStorage.setItem('token', token);
                set({ user, token, isAuthenticated: true });
            },
            setUser: (user) => set({ user }),
            logout: () => {
                localStorage.removeItem('token');
                set({ user: null, token: null, isAuthenticated: false });
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
            },
        }),
        {
            name: 'user-storage',
        }
    )
);
