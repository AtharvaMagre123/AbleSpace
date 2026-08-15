import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const authApi = {
  guestLogin: (username?: string) => api.post('/auth/guest', { username }),
  register: (data: { username: string; password: string; email?: string }) =>
    api.post('/auth/register', data),
  login: (data: { username: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateTheme: (theme: string) => api.patch('/auth/theme', { theme }),
  updateColorMode: (colorMode: string) => api.patch('/auth/color-mode', { colorMode }),
  updateProfile: (data: { fullName?: string; title?: string; username?: string; email?: string }) => 
    api.patch('/auth/profile', data),
};

// Users API
export const usersApi = {
  search: (query: string) => api.get(`/users/search?q=${encodeURIComponent(query)}`),
};

// Tasks API
export const tasksApi = {
  getAll: (params?: Record<string, string>) =>
    api.get('/tasks', { params }),
  getOne: (id: string) => api.get(`/tasks/${id}`),
  create: (data: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    startDate?: string;
    dueDate?: string;
    category?: string;
    tags?: string[];
  }) => api.post('/tasks', data),
  update: (
    id: string,
    data: Partial<{
      title: string;
      description: string;
      status: string;
      priority: string;
      startDate: string;
      dueDate: string;
      category: string;
      tags: string[];
      order: number;
      members: any[];
    }>
  ) => api.patch(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
  getStats: () => api.get('/tasks/stats'),
};

// Projects API
export const projectsApi = {
  getAll: () => api.get('/projects'),
  getOne: (id: string) => api.get(`/projects/${id}`),
  create: (data: {
    name: string;
    description?: string;
    priority?: string;
    dueDate?: string;
    lead?: string;
  }) => api.post('/projects', data),
  update: (
    id: string,
    data: Partial<{
      name: string;
      description: string;
      priority: string;
      dueDate: string;
      lead: string;
    }>
  ) => api.patch(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};
