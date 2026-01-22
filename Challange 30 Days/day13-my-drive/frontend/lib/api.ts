import api from './axios';
import {
    AuthResponse,
    LoginCredentials,
    RegisterCredentials,
    User,
    Folder,
    FolderContent,
    FileItem
} from '@/types';


export const authApi = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
        const response = await api.post('/auth/register', credentials);
        return response.data;
    },

    logout: async (): Promise<void> => {
        await api.post('/auth/logout');
    },
};


export const userApi = {
    getProfile: async (): Promise<User> => {
        const response = await api.get('/user/profile');
        return response.data.data || response.data;
    },

    updateProfile: async (data: { name: string; email: string }): Promise<User> => {
        const response = await api.put('/user/profile', data);
        return response.data.data || response.data;
    },

    changePassword: async (data: {
        current_password: string;
        password: string;
        password_confirmation: string;
    }): Promise<void> => {
        await api.post('/user/change-password', data);
    },
};


export const folderApi = {
    getRootFolders: async (): Promise<Folder[]> => {
        const response = await api.get('/folders');
        return response.data.data || response.data;
    },

    getFolderContent: async (id: number): Promise<FolderContent> => {
        const response = await api.get(`/folders/${id}`);
        return response.data.data || response.data;
    },

    createFolder: async (name: string, parentId?: number | null): Promise<Folder> => {
        const payload: { name: string; parent_id?: number } = { name };
        if (parentId) {
            payload.parent_id = parentId;
        }
        const response = await api.post('/folders', payload);
        return response.data.data || response.data;
    },

    deleteFolder: async (id: number): Promise<void> => {
        await api.delete(`/folders/${id}`);
    },
};

// ==================== File API ====================

export const fileApi = {
    getRootFiles: async (): Promise<FileItem[]> => {
        const response = await api.get('/files');
        return response.data.data || response.data;
    },

    uploadFile: async (file: File, folderId?: number | null): Promise<FileItem> => {
        const formData = new FormData();
        formData.append('file', file);
        if (folderId) {
            formData.append('folder_id', folderId.toString());
        }

        const response = await api.post('/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data || response.data;
    },

    downloadFile: async (id: number): Promise<Blob> => {
        const response = await api.get(`/files/${id}/download`, {
            responseType: 'blob',
        });
        return response.data;
    },

    deleteFile: async (id: number): Promise<void> => {
        await api.delete(`/files/${id}`);
    },
};

// Helper function to trigger file download
export const triggerDownload = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};
