import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);
export const getCurrentUser = () => api.get('/auth/me');
export const getLocations = (params) => api.get('/locations', { params });
export const getAvailableRooms = (params) => api.get('/rooms/availability', { params });
export const createReservation = (data) => api.post('/reservations', data);
export const getUserReservations = () => api.get('/reservations/me');
export const cancelReservation = (id) => api.delete(`/reservations/${id}`);
export const getAdminDashboard = () => api.get('/admin/dashboard');
export const getAllReservations = () => api.get('/admin/reservations');
export const getLocationsAdmin = () => api.get('/admin/locations');
export const createLocation = (data) => api.post('/admin/locations', data);
export const updateLocation = (id, data) => api.put(`/admin/locations/${id}`, data);
export const deleteLocation = (id) => api.delete(`/admin/locations/${id}`);
export const getRooms = () => api.get('/admin/rooms');
export const createRoom = (data) => api.post('/admin/rooms', data);
export const updateRoom = (id, data) => api.put(`/admin/rooms/${id}`, data);
export const deleteRoom = (id) => api.delete(`/admin/rooms/${id}`);

export default api;
