import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Para enviar cookies
});

// Interceptor para adicionar token em cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  signup: (data) => api.post('/users/signup', data),
  login: (data) => api.post('/users/login', data),
  logout: () => api.post('/users/logout'),
  forgotPassword: (email) => api.post('/users/forgot-password', { email }),
  resetPassword: (token, data) => api.patch(`/users/reset-password/${token}`, data),
};

// Forum API
export const forumAPI = {
  getAllForums: (searchQuery = '') => api.get(`/forums${searchQuery ? `?search=${searchQuery}` : ''}`),
  getForum: (id) => api.get(`/forums/${id}`),
  createForum: (data) => api.post('/forums', data),
  updateForum: (id, data) => api.patch(`/forums/${id}`, data),
  deleteForum: (id) => api.delete(`/forums/${id}`),
  joinForum: (id) => api.patch(`/forums/${id}/join`),
};

export default api;