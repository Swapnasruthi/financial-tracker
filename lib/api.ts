import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Transaction } from '@/types/transaction';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const transactionApi = {
  // Get all transactions
  getAll: async (): Promise<Transaction[]> => {
    const response = await api.get('/api/transactions');
    return response.data;
  },

  // Create new transaction
  create: async (transaction: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> => {
    const response = await api.post('/api/transactions', transaction);
    return response.data;
  },

  // Update transaction
  update: async (transaction: Transaction): Promise<Transaction> => {
    const response = await api.put('/api/transactions', transaction);
    return response.data;
  },

  // Delete transaction
  delete: async (id: string): Promise<{ _id: string }> => {
    const response = await api.delete('/api/transactions', { data: { _id: id } });
    return response.data;
  },

  // Health check
  health: async (): Promise<{ status: string; message: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api; 