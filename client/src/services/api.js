// client/src/services/api.js
import axios from 'axios';

const getBaseApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    // Local development or local preview
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:4000/api';
    }
    // If running on the same domain as the deployed backend
    if (host === 'secure-app-s3de.vercel.app') {
      return '/api';
    }
  }
  // Production backend deployed on Vercel
  return 'https://secure-app-s3de.vercel.app/api';
};

export const API_URL = getBaseApiUrl().replace(/\/+$/, '');

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API functions
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/password', data),
  deleteAccount: () => api.delete('/auth/account'),
};

export default api;
