import { api } from '@/lib/axios';

// Example interface for type safety
interface User {
  id: number;
  name: string;
  email: string;
}

interface Payment {
  id: number;
  amount: number;
  currency: string;
  status: string;
}

// Example service demonstrating how to use the axios instance
export const exampleService = {
  // GET request example
  getUsers: async () => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  // GET request with params example
  getUserById: async (id: number) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  // POST request example
  createPayment: async (paymentData: Omit<Payment, 'id'>) => {
    const response = await api.post<Payment>('/payments', paymentData);
    return response.data;
  },

  // PUT request example
  updatePayment: async (id: number, paymentData: Partial<Payment>) => {
    const response = await api.put<Payment>(`/payments/${id}`, paymentData);
    return response.data;
  },

  // PATCH request example
  patchPayment: async (id: number, updates: Partial<Payment>) => {
    const response = await api.patch<Payment>(`/payments/${id}`, updates);
    return response.data;
  },

  // DELETE request example
  deletePayment: async (id: number) => {
    const response = await api.delete(`/payments/${id}`);
    return response.data;
  },

  // Example with custom config
  getUsersWithConfig: async () => {
    const response = await api.get<User[]>('/users', {
      params: { page: 1, limit: 10 },
      headers: { 'Custom-Header': 'value' },
    });
    return response.data;
  },
};
