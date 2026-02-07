import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // For cookies if needed, though we use Bearer token
});

// Request Interceptor
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response) {
        const { status, data } = error.response;

        if (status === 401) {
            useAuthStore.getState().logout();
            // Optional: Redirect to login if not already there
            // window.location.href = '/login'; 
        }

        // 422 errors are handled by the form component generally, but we can toast generic errors
        if (status !== 422 && status !== 401) {
            toast.error(data.message || 'An error occurred');
        }
    } else {
        toast.error('Network Error. Please check your connection.');
    }
    return Promise.reject(error);
});

export default api;
