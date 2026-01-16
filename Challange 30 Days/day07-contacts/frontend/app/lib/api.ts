import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Accept': 'application/json',
    },
});

export interface Contact {
    id: number;
    first_name: string;
    last_name: string;
    full_phone: string;
    photo_url: string | null;
    details: string | null;
}

export interface PaginatedResponse {
    data: Contact[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface ContactFormData {
    first_name: string;
    last_name: string;
    country_code: string;
    phone: string;
    details?: string;
    photo?: File | null;
}

export const getContacts = async (page: number = 1, search: string = ''): Promise<PaginatedResponse> => {
    const response = await api.get('/contacts', {
        params: { page, search },
    });
    return response.data;
};

// Create a new contact
export const createContact = async (data: ContactFormData): Promise<Contact> => {
    const formData = new FormData();
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('country_code', data.country_code);
    formData.append('phone', data.phone);
    if (data.details) {
        formData.append('details', data.details);
    }
    if (data.photo) {
        formData.append('photo', data.photo);
    }

    const response = await api.post('/contacts', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Update an existing contact
export const updateContact = async (id: number, data: ContactFormData): Promise<Contact> => {
    const formData = new FormData();
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('country_code', data.country_code);
    formData.append('phone', data.phone);
    formData.append('_method', 'PUT'); // Laravel method override
    if (data.details) {
        formData.append('details', data.details);
    }
    if (data.photo) {
        formData.append('photo', data.photo);
    }

    const response = await api.post(`/contacts/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Delete a contact
export const deleteContact = async (id: number): Promise<void> => {
    await api.delete(`/contacts/${id}`);
};

export default api;
