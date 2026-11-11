import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (username, password) =>
    apiClient.post('/auth/login', { username, password }),
  logout: () => apiClient.post('/auth/logout'),
  profile: () => apiClient.get('/auth/profile'),
};

export const dashboardAPI = {
  getSummary: (tahun) =>
    apiClient.get(`/home/getSummary?tahun=${tahun}`),
  getChartData: (tahun) =>
    apiClient.get(`/home/getChartData?tahun=${tahun}`),
  getChartRealisasi: (tahun) =>
    apiClient.get(`/home/getChartRealisasi?tahunrealisasi=${tahun}`),
  getTopKegiatan: (tahun, limit = 5) =>
    apiClient.get(`/home/getTopKegiatan?tahun=${tahun}&limit=${limit}`),
};

export const contactsAPI = {
  getList: () => apiClient.get('/contacts'),
  upload: (formData) =>
    apiClient.post('/contacts/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => apiClient.delete(`/contacts/${id}`),
};

export default apiClient;
