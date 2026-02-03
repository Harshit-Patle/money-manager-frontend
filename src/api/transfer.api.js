import axiosInstance from './axios';

export const transferAPI = {
    getTransfers: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.from) params.append('from', filters.from);
        if (filters.to) params.append('to', filters.to);

        const response = await axiosInstance.get(`/transfers?${params.toString()}`);
        return response.data;
    },

    createTransfer: async (transferData) => {
        const response = await axiosInstance.post('/transfers', transferData);
        return response.data;
    },

    updateTransfer: async (id, transferData) => {
        const response = await axiosInstance.put(`/transfers/${id}`, transferData);
        return response.data;
    },

    deleteTransfer: async (id) => {
        const response = await axiosInstance.delete(`/transfers/${id}`);
        return response.data;
    },
};
