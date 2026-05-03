import api from './api';

export const createOrder = (data) => api.post('/orders', data);
export const getUserOrders = () => api.get('/orders');
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const getAllOrders = (params) => api.get('/orders/all', { params });
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });
export const getOrderStats = () => api.get('/orders/stats');
