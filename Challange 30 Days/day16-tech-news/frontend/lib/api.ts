import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true, // Important for Sanctum cookies if used
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor to add Bearer token if we are storing it in localStorage or cookies manually
// For this setup, we'll check localStorage for a token (common pattern) or rely on cookies.
// The user prompt mentioned "Bearer Token (Sanctum) stored in Cookies".
// If Sanctum is stateful (SPA mode), cookies are handled automatically by 'withCredentials: true'.
// If it's API token mode, we need to inject the token.
// Assuming stateless API token for "Bearer" spec.

api.interceptors.request.use((config) => {
    // If we have a token stored (e.g., after login response)
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api;
