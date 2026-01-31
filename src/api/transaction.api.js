import axiosInstance from './axios';

export const transactionAPI = {
  getTransactions: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.category) params.append('category', filters.category);
    if (filters.division) params.append('division', filters.division);
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);

    const response = await axiosInstance.get(`/transactions?${params.toString()}`);
    return response.data;
  },

  addTransaction: async (transactionData) => {
    const response = await axiosInstance.post('/transactions', transactionData);
    return response.data;
  },

  updateTransaction: async (id, transactionData) => {
    const response = await axiosInstance.put(`/transactions/${id}`, transactionData);
    return response.data;
  },

  deleteTransaction: async (id) => {
    const response = await axiosInstance.delete(`/transactions/${id}`);
    return response.data;
  },

  transferBetweenAccounts: async (transferData) => {
    const response = await axiosInstance.post('/transactions/transfer', transferData);
    return response.data;
  },

  getCategorySummary: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);
    if (filters.division) params.append('division', filters.division);

    const response = await axiosInstance.get(`/transactions/summary/categories?${params.toString()}`);
    return response.data;
  }
};