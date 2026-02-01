import axios from "axios";

// Constants for configuration
// In a real app, use process.env.NEXT_PUBLIC_API_URL
export const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Add response interceptor for global error handling if needed
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // We can log errors here or trigger a global toast
        console.error("API Error:", error);
        return Promise.reject(error);
    }
);

export default api;
