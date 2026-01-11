import axios from 'axios';
import { Note, NoteInput } from '@/types/note';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Get all notes
export const getNotes = async (): Promise<Note[]> => {
    const response = await api.get('/notes');
    return response.data;
};

// Get single note
export const getNote = async (id: number): Promise<Note> => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
};

// Create new note
export const createNote = async (data: NoteInput): Promise<{ message: string; note: Note }> => {
    const response = await api.post('/notes', data);
    return response.data;
};

// Update note
export const updateNote = async (id: number, data: NoteInput): Promise<{ message: string; note: Note }> => {
    const response = await api.put(`/notes/${id}`, data);
    return response.data;
};

// Delete note
export const deleteNote = async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
};
