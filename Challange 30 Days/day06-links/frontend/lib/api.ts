import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export interface Link {
    id: number;
    original_url: string;
    code: string;
    visits: number;
    created_at: string;
    updated_at: string;
}

export interface ShortenResponse {
    message: string;
    short_url: string;
    data: Link;
}

export const shortenLink = async (url: string): Promise<ShortenResponse> => {
    const response = await api.post<ShortenResponse>('/links', { url });
    return response.data;
};

export const getLinks = async (): Promise<Link[]> => {
    const response = await api.get<Link[]>('/links');
    return response.data;
};

export const getRedirectUrl = (code: string): string => {
    return `${API_BASE_URL}/go/${code}`;
};

export default api;
