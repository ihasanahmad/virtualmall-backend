import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('vendorToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('vendorToken');
            localStorage.removeItem('vendorUser');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth services
export const authService = {
    register: async (userData) => {
        const response = await api.post('/auth/register', { ...userData, role: 'vendor' });
        if (response.data.token) {
            localStorage.setItem('vendorToken', response.data.token);
            localStorage.setItem('vendorUser', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('vendorToken', response.data.token);
            localStorage.setItem('vendorUser', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('vendorToken');
        localStorage.removeItem('vendorUser');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('vendorUser');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('vendorToken');
    }
};

// Brand services
export const brandService = {
    registerBrand: async (brandData, logoFile) => {
        const formData = new FormData();
        Object.keys(brandData).forEach(key => {
            if (key === 'businessInfo' || key === 'bankDetails' || key === 'contactInfo') {
                formData.append(key, JSON.stringify(brandData[key]));
            } else {
                formData.append(key, brandData[key]);
            }
        });
        if (logoFile) {
            formData.append('logo', logoFile);
        }

        const response = await api.post('/brands', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    getMyBrand: async () => {
        const response = await api.get('/brands');
        // Filter to get only the current vendor's brand
        const brands = response.data.data || response.data;
        return brands.find(b => b.owner === authService.getCurrentUser()?.id) || null;
    },

    updateBrand: async (id, brandData) => {
        const response = await api.put(`/brands/${id}`, brandData);
        return response.data;
    }
};

// Product services
export const productService = {
    getMyProducts: async (params = {}) => {
        const response = await api.get('/products', { params });
        return response.data;
    },

    getProduct: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    createProduct: async (productData, imageFiles) => {
        const formData = new FormData();
        Object.keys(productData).forEach(key => {
            if (key === 'specifications' || key === 'variants') {
                formData.append(key, JSON.stringify(productData[key]));
            } else {
                formData.append(key, productData[key]);
            }
        });

        if (imageFiles && imageFiles.length > 0) {
            imageFiles.forEach(file => {
                formData.append('images', file);
            });
        }

        const response = await api.post('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    updateProduct: async (id, productData) => {
        const response = await api.put(`/products/${id}`, productData);
        return response.data;
    },

    deleteProduct: async (id) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    }
};

// Category services
export const categoryService = {
    getAllCategories: async () => {
        const response = await api.get('/categories');
        return response.data;
    }
};

// Mock analytics service (will need backend endpoints)
export const vendorAnalyticsService = {
    getDashboardStats: async () => {
        // Mock data for now
        return {
            totalSales: 89,
            totalRevenue: 245000,
            activeProducts: 23,
            averageRating: 4.6,
            pendingOrders: 12,
            monthlySales: [
                { month: 'Jan', sales: 15000 },
                { month: 'Feb', sales: 22000 },
                { month: 'Mar', sales: 31000 },
                { month: 'Apr', sales: 28000 }
            ]
        };
    }
};

export default api;
