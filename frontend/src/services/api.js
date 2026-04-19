import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const initCsrf = () => axios.get('/sanctum/csrf-cookie', { baseURL: '', withCredentials: true });
export const login = (data) => api.post('/login', data);
export const logout = () => api.post('/logout');
export const getUser = () => api.get('/user');

// Dashboard
export const getDashboardStats = () => api.get('/dashboard/stats');
export const getDashboardCharts = () => api.get('/dashboard/charts');

// Items
export const getItems = (params) => api.get('/items', { params });
export const getItem = (id) => api.get(`/items/${id}`);
export const createItem = (data) => api.post('/items', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateItem = (id, data) => api.post(`/items/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteItem = (id) => api.delete(`/items/${id}`);

// Categories
export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Locations
export const getLocations = () => api.get('/locations');
export const createLocation = (data) => api.post('/locations', data);
export const updateLocation = (id, data) => api.put(`/locations/${id}`, data);
export const deleteLocation = (id) => api.delete(`/locations/${id}`);

// Borrowings
export const getBorrowings = (params) => api.get('/borrowings', { params });
export const createBorrowing = (data) => api.post('/borrowings', data);
export const returnBorrowing = (id) => api.put(`/borrowings/${id}/return`);

// Mutations
export const getMutations = (params) => api.get('/mutations', { params });
export const createMutation = (data) => api.post('/mutations', data);

// Maintenance
export const getMaintenances = (params) => api.get('/maintenances', { params });
export const createMaintenance = (data) => api.post('/maintenances', data);
export const updateMaintenance = (id, data) => api.put(`/maintenances/${id}`, data);

// Reports
export const exportPdf = (params) => api.get('/reports/items/pdf', { params, responseType: 'blob' });
export const exportExcel = (params) => api.get('/reports/items/excel', { params, responseType: 'blob' });

// Activity Logs
export const getActivityLogs = (params) => api.get('/activity-logs', { params });

// User Management (admin only)
export const getUsers = (params) => api.get('/users', { params });
export const createUser = (data) => api.post('/users', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateUser = (id, data) => api.post(`/users/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const getRoles = () => api.get('/roles');

// Profile & Password
// Gunakan POST + _method=PUT karena PUT tidak mendukung multipart/form-data di beberapa server
export const updateProfile = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  formData.append('_method', 'PUT');
  return api.post('/user/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const changePassword = (data) => api.put('/user/password', data);

export default api;
