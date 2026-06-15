/* 
 * Project Name: Saadat Shawl House
 * Author: Syed Noor ul Absar
 * Description: Custom-built architecture for the Saadat Shawl House Application.
 * Notes: This code is proprietary and developed from scratch.
 */

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 60000
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('km_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally (Session Expired etc)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Redirect to login only if it's NOT a login or register request
    const isAuthRoute = err.config.url.includes('/auth/login') || err.config.url.includes('/auth/register');
    
    if (err.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('km_token');
      localStorage.removeItem('km_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
