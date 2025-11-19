import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Create axios instance with default configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://103.161.17.93:8080/api/v1",
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add authorization token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Request:', config.method?.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error: AxiosError) => {
    // Handle request error
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Response:', response.status, response.config.url);
    }
    
    return response;
  },
  (error: AxiosError) => {
    // Handle response errors
    if (error.response) {
      // Server responded with error status
      console.error('Response Error:', error.response.status, error.response.data);
      
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            // Redirect to login page
            // window.location.href = '/login';
          }
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Server error');
          break;
        default:
          console.error('An error occurred');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Export the configured axios instance
export default axiosInstance;

// Helper methods for common HTTP operations
export const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) => 
    axiosInstance.get<T>(url, config),
  
  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => 
    axiosInstance.post<T>(url, data, config),
  
  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => 
    axiosInstance.put<T>(url, data, config),
  
  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => 
    axiosInstance.patch<T>(url, data, config),
  
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) => 
    axiosInstance.delete<T>(url, config),
};
