import api from './api';
import { LoginResponse, User, AuthResponse } from '@/types';

export const authService = {
    async register(data: any): Promise<void> {
        await api.post('/auth/register', data);
    },

    async verifyOtp(data: { email: string; otp_code: string }): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/verify', data);
        return response.data;
    },

    async login(data: any): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>('/auth/login', data);
        return response.data;
    },

    async verifyLoginOtp(data: { email: string; otp: string }): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>('/auth/login/verify', data);
        return response.data;
    },

    async logout(): Promise<void> {
        await api.post('/auth/logout');
    },

    async getProfile(): Promise<User> {
        const response = await api.get<User>('/profile');
        return response.data;
    },

    async resendOtp(email: string): Promise<void> {
        await api.post('/auth/resend-otp', { email });
    }
};
