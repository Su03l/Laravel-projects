import api from './axios';
import { Stats, Transaction, TransactionFormData } from '@/types';

export const getStats = async (): Promise<Stats> => {
    const response = await api.get('/wallet/stats');
    return response.data;
};

// Transactions API
export const getTransactions = async (type?: string): Promise<Transaction[]> => {
    const params = type ? { type } : {};
    const response = await api.get('/transactions', { params });
    return response.data;
};

export const createTransaction = async (data: TransactionFormData): Promise<Transaction> => {
    const response = await api.post('/transactions', data);
    return response.data.data;
};

export const updateTransaction = async (id: number, data: TransactionFormData): Promise<Transaction> => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data.data;
};

export const deleteTransaction = async (id: number): Promise<void> => {
    await api.delete(`/transactions/${id}`);
};
