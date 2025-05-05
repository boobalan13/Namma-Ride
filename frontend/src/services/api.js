import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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
export const register = (userData) => api.post('/auth/register', userData);
export const login = (userData) => api.post('/auth/login', userData);
export const getMe = () => api.get('/auth/me');
export const updateDetails = (userData) => api.put('/auth/updatedetails', userData);
export const updatePassword = (passwordData) => api.put('/auth/updatepassword', passwordData);

// Cars API calls
export const getCars = () => api.get('/cars');
export const getCar = (id) => api.get(`/cars/${id}`);
export const createCar = (carData) => api.post('/cars', carData);
export const updateCar = (id, carData) => api.put(`/cars/${id}`, carData);
export const deleteCar = (id) => api.delete(`/cars/${id}`);
export const uploadCarImages = (id, formData) => api.put(`/cars/${id}/images`, formData);
export const deleteCarImage = (id, imageName) => api.delete(`/cars/${id}/images/${imageName}`);

// Bookings API calls
export const getBookings = () => api.get('/bookings');
export const getBooking = (id) => api.get(`/bookings/${id}`);
export const createBooking = (bookingData) => api.post('/bookings', bookingData);
export const updateBooking = (id, bookingData) => api.put(`/bookings/${id}`, bookingData);
export const cancelBooking = (id, reason) => api.put(`/bookings/${id}/cancel`, { reason });

export default api; 