import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — log in development
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.params ?? '');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — extract data & normalize errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const normalized = {
      message: error.response?.data?.message || error.message || 'Terjadi kesalahan pada server',
      status: error.response?.status || 500,
      originalError: error,
    };
    return Promise.reject(normalized);
  }
);

export default api;
