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
        const token = localStorage.getItem('adminToken');
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
            // Unauthorized - redirect to login
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth services
export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('adminToken', response.data.token);
            localStorage.setItem('adminUser', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('adminUser');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('adminToken');
    }
};

// Brand services
export const brandService = {
    getAllBrands: async (status = null) => {
        const url = status ? `/brands?status=${status}` : '/brands';
        const response = await api.get(url);
        return response.data;
    },

    getBrand: async (id) => {
        const response = await api.get(`/brands/${id}`);
        return response.data;
    },

    approveBrand: async (id) => {
        const response = await api.put(`/brands/${id}/approve`);
        return response.data;
    },

    rejectBrand: async (id, reason) => {
        const response = await api.put(`/brands/${id}/reject`, { reason });
        return response.data;
    },

    updateCommission: async (id, commissionRate) => {
        const response = await api.put(`/brands/${id}`, { commissionRate });
        return response.data;
    }
};

// Product services
export const productService = {
    getAllProducts: async (params = {}) => {
        const response = await api.get('/products', { params });
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
    },

    createCategory: async (categoryData) => {
        const response = await api.post('/categories', categoryData);
        return response.data;
    },

    updateCategory: async (id, categoryData) => {
        const response = await api.put(`/categories/${id}`, categoryData);
        return response.data;
    },

    deleteCategory: async (id) => {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    }
};

// Analytics/Stats services (placeholder - will need backend endpoints)
export const analyticsService = {
    getDashboardStats: async () => {
        // TODO: Implement backend endpoint
        // For now, return mock data
        return {
            totalRevenue: 1250000,
            activeBrands: 35,
            totalProducts: 542,
            pendingApprovals: 8,
            recentOrders: 127,
            monthlyRevenue: [
                { month: 'Jan', revenue: 85000 },
                { month: 'Feb', revenue: 92000 },
                { month: 'Mar', revenue: 115000 },
                { month: 'Apr', revenue: 125000 }
            ]
        };
    }
};

export default api;
