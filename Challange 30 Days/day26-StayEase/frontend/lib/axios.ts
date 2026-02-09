import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle 401 and malformed JSON
api.interceptors.response.use(
    (response) => {
        // Handle malformed JSON response (e.g. starts with "2{" or similar artifacts)
        if (typeof response.data === 'string') {
            try {
                // Find the start of the JSON object or array
                const jsonStartIndex = response.data.search(/[{\[]/);
                if (jsonStartIndex !== -1) {
                    const jsonString = response.data.substring(jsonStartIndex);
                    response.data = JSON.parse(jsonString);
                }
            } catch (e) {
                console.error('Failed to parse malformed JSON in interceptor:', e);
            }
        }
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Helper to get CSRF cookie before auth requests
export const getCsrfToken = async () => {
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
        withCredentials: true,
    });
};

export default api;
