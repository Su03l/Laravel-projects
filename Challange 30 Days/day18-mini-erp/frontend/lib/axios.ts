import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    // Ensure token is valid and not string "undefined"
    if (token && token !== 'undefined') {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Check if the error is 401
        if (error.response && error.response.status === 401) {
            // Prevent redirect loop if already on login page or if the request was TO /login
            // We check if the request URL ends with /login (ignoring query params)
            const isLoginRequest = error.config.url?.endsWith('/login');
            const isLoginPage = typeof window !== 'undefined' && window.location.pathname === '/login';

            if (!isLoginRequest && !isLoginPage) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
