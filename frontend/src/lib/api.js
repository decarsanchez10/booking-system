import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('obsidian_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('obsidian_user');
      localStorage.removeItem('obsidian_token');
    }

    return Promise.reject(error);
  },
);

export const getApiErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  const data = error.response?.data;

  if (data?.message) return data.message;

  if (data?.errors) {
    const firstError = Object.values(data.errors).flat()[0];
    if (firstError) return firstError;
  }

  return error.message || fallback;
};

export default api;
