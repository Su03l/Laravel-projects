import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Types
export interface Comment {
    id: number;
    body: string;
    commentable_type: string;
    commentable_id: number;
    created_at: string;
    updated_at: string;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    comments: Comment[];
    created_at: string;
    updated_at: string;
}

export interface Video {
    id: number;
    title: string;
    url: string;
    comments: Comment[];
    created_at: string;
    updated_at: string;
}

// Posts API
export const postsApi = {
    getAll: () => api.get<Post[]>('/posts'),
    getOne: (id: number) => api.get<Post>(`/posts/${id}`),
    create: (data: { title: string; content: string }) => api.post('/posts', data),
    update: (id: number, data: { title: string; content: string }) => api.put(`/posts/${id}`, data),
    delete: (id: number) => api.delete(`/posts/${id}`),
};

// Videos API
export const videosApi = {
    getAll: () => api.get<Video[]>('/videos'),
    getOne: (id: number) => api.get<Video>(`/videos/${id}`),
    create: (data: { title: string; url: string }) => api.post('/videos', data),
    update: (id: number, data: { title: string; url: string }) => api.put(`/videos/${id}`, data),
    delete: (id: number) => api.delete(`/videos/${id}`),
};

// Comments API
export const commentsApi = {
    getAll: () => api.get<Comment[]>('/comments'),
    create: (data: { body: string; type: 'post' | 'video'; id: number }) =>
        api.post('/comments', data),
    update: (id: number, data: { body: string }) => api.put(`/comments/${id}`, data),
    delete: (id: number) => api.delete(`/comments/${id}`),
};

export default api;
