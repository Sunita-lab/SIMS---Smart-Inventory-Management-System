import axios from 'axios';

const API = axios.create({
  baseURL: 'https://sims-4njv.onrender.com/api',
});

// Interceptor: automatically attaches token with every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;