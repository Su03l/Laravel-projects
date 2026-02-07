import api from './api';

// Extensions to auth service for forgot password
export const passwordService = {
    async forgotPassword(email: string): Promise<void> {
        await api.post('/auth/forgot-password', { email });
    },

    async resetPassword(data: any): Promise<void> {
        await api.post('/auth/reset-password', data);
    }
};
