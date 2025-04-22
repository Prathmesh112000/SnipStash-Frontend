import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  sendOTP: (email) => api.post('/auth/send-otp', { email }),
  verifyOTP: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  getProfile: () => api.get('/auth/profile'),
};

// Snippets API calls
const snippetsAPI = {
  getAll: (filters = {}) => {
    const { title, language, tags } = filters;
    const params = new URLSearchParams();
    
    if (title) params.append('title', title);
    if (language) params.append('language', language);
    if (tags && tags.length > 0) params.append('tags', tags.join(','));
    
    return api.get(`/snippets?${params.toString()}`);
  },
  getById: (id) => api.get(`/snippets/${id}`),
  create: (data) => api.post('/snippets', data),
  update: (id, data) => api.put(`/snippets/${id}`, data),
  delete: (id) => api.delete(`/snippets/${id}`),
};

export { snippetsAPI, authAPI };

export default api; 