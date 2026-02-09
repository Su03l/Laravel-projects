import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api, { getCsrfToken } from './axios';
import type { User, LoginFormData, RegisterFormData, LoginResponse } from './types';

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    requires2FA: boolean;
    pendingEmail: string | null;

    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    fetchUser: () => Promise<void>;
    login: (data: LoginFormData) => Promise<LoginResponse>;
    verify2FA: (email: string, otp: string) => Promise<void>;
    register: (data: RegisterFormData) => Promise<void>;
    verifyAccount: (email: string, otp: string) => Promise<void>;
    resendOtp: (email: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (email: string, otp: string, password: string, password_confirmation: string) => Promise<void>;
    logout: () => Promise<void>;
    reset: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isLoading: true,
            isAuthenticated: false,
            requires2FA: false,
            pendingEmail: null,

            setUser: (user) => set({ user, isAuthenticated: !!user }),

            setToken: (token) => {
                if (token) {
                    localStorage.setItem('auth_token', token);
                } else {
                    localStorage.removeItem('auth_token');
                }
                set({ token });
            },

            fetchUser: async () => {
                set({ isLoading: true });
                try {
                    const token = localStorage.getItem('auth_token');
                    if (!token) {
                        set({ user: null, isAuthenticated: false, isLoading: false });
                        return;
                    }
                    const response = await api.get('/auth/me');
                    set({ user: response.data, isAuthenticated: true, isLoading: false });
                } catch {
                    localStorage.removeItem('auth_token');
                    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
                }
            },

            login: async (data) => {
                await getCsrfToken();
                const response = await api.post<LoginResponse>('/auth/login', data);

                if (response.data.status === '2fa_required') {
                    set({ requires2FA: true, pendingEmail: data.email });
                    return response.data;
                }

                const { token, user } = response.data.data || response.data;
                if (token) {
                    get().setToken(token);
                    set({ user, isAuthenticated: true, requires2FA: false, pendingEmail: null });
                }
                return response.data;
            },

            verify2FA: async (email, otp) => {
                const response = await api.post('/auth/login/verify', { email, otp });
                const { token, user } = response.data.data;
                get().setToken(token);
                set({ user, isAuthenticated: true, requires2FA: false, pendingEmail: null });
            },

            register: async (data) => {
                await getCsrfToken();
                await api.post('/auth/register', data);
            },

            verifyAccount: async (email, otp) => {
                await getCsrfToken();
                const response = await api.post('/auth/verify-account', { email, otp });
                const { token, user } = response.data.data;
                get().setToken(token);
                set({ user, isAuthenticated: true });
            },

            forgotPassword: async (email) => {
                await getCsrfToken();
                await api.post('/auth/forgot-password', { email });
            },

            resendOtp: async (email: string) => {
                await getCsrfToken();
                await api.post('/auth/resend-otp', { email });
            },

            resetPassword: async (email, otp, password, password_confirmation) => {
                await api.post('/auth/reset-password', { email, otp, password, password_confirmation });
            },

            logout: async () => {
                try {
                    await api.post('/auth/logout');
                } catch {
                    // Ignore errors on logout
                } finally {
                    localStorage.removeItem('auth_token');
                    set({ user: null, token: null, isAuthenticated: false });
                }
            },

            reset: () => {
                localStorage.removeItem('auth_token');
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                    requires2FA: false,
                    pendingEmail: null
                });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ token: state.token }),
        }
    )
);
