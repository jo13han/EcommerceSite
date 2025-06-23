import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    // Add Authorization header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('Request config:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
      baseURL: config.baseURL
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    });
    return Promise.reject(error);
  }
);

export const getProducts = async () => {
  const response = await api.get('/api/products');
  return response.data.products;
};

export const getProductsByCategory = async (category: string) => {
  const response = await api.get(`/api/products/category/${category}`);
  return response.data.products;
};

export const getCategories = async () => {
  const response = await api.get('/api/products/categories');
  return response.data;
};

export default api; 