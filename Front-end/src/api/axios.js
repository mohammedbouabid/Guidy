import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Detect expired access token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      error.response?.data?.message?.includes("jwt expired")
    ) {
      originalRequest._retry = true;
      try {
        // Refresh token via cookie
        await api.get('/refresh');

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh failed:", refreshError);
        // Clear user info and redirect to login
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;