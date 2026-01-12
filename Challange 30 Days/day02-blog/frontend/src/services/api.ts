import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Categories API
export const categoriesAPI = {
    getAll: () => api.get('/categories'),
    getOne: (id: number) => api.get(`/categories/${id}`),
    create: (data: { name: string }) => api.post('/categories', data),
    update: (id: number, data: { name: string }) => api.put(`/categories/${id}`, data),
    delete: (id: number) => api.delete(`/categories/${id}`),
};

// Posts API
export const postsAPI = {
    getAll: () => api.get('/posts'),
    getOne: (id: number) => api.get(`/posts/${id}`),
    create: (data: { title: string; content: string; category_id: number }) =>
        api.post('/posts', data),
    update: (id: number, data: { title: string; content: string; category_id: number }) =>
        api.put(`/posts/${id}`, data),
    delete: (id: number) => api.delete(`/posts/${id}`),
};

export default api;
