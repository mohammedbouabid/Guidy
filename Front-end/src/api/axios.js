import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // ✅ This automatically sends cookies
  headers: {
    'Content-Type': 'application/json'
  }
});


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if this is a 401 error and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        console.log('🔄 Access token expired, refreshing...');
        
        // Call refresh endpoint (uses refreshToken cookie from backend)
        await axios.post('http://localhost:3000/api/refresh', {}, {
          withCredentials: true // Important: send cookies
        });
        
        console.log('✅ Token refreshed successfully');
        
        // Retry the original request with new access token
        return api(originalRequest);
        
      } catch (refreshError) {
        console.error('❌ Refresh failed:', refreshError);
        
        // Clear cookies and redirect to login
        document.cookie = 'accessToken=; Max-Age=0; path=/;';
        document.cookie = 'refreshToken=; Max-Age=0; path=/;';
        document.cookie = 'userInfo=; Max-Age=0; path=/;';
        
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;